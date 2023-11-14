import {
  faCamera,
  faTag,
  faLink,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfilePicture from "./ProfilePicture";
import { useSession } from "next-auth/react";
import { ChangeEvent, useRef, useState } from "react";
import FlexInputList from "./FlexInputList";
import { InputItem, TimelineFormInputs } from "@/types";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  createDataObject,
  createPhotoData,
  handleCaptionChange,
  handleDeleteImage,
  handleFileChange,
  sendData,
  uploadImages,
} from "../utils/formHelpers";
import useOptimisticUpdate from "@/hooks/useOptimisticUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PrimaryFormMainTextInput from "./PrimaryFormMainTextInput";
import { Editor } from "@tinymce/tinymce-react";

const PrimaryForm = () => {
  const [tagInputVisibility, setTagInputVisibility] = useState<boolean>(false);
  const [tagsList, setTagsList] = useState<string[]>([]);

  const [linkInputVisibility, setLinkInputVisibility] =
    useState<boolean>(false);
  const [linksList, setLinksList] = useState<InputItem[]>([]);

  const [photoInputVisibility, setPhotoInputVisibility] =
    useState<boolean>(false);

  const [openModule, setOpenModule] = useState<boolean>(false);
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState<boolean>(false);
  const [imageUploadPromise, setImageUploadPromise] =
    useState<Promise<any> | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imagesCaption, setImagesCaptions] = useState<
    { idx: number; value: string }[]
  >([]);

  const { data: session } = useSession();
  const editorRef = useRef<Editor["elementRef"] | null>(null);

  const { register, handleSubmit, reset, setValue, getValues } =
    useForm<TimelineFormInputs>();

  const queryClient = useQueryClient();

  const optimisticUpdate = useOptimisticUpdate(
    imagesCaption,
    tagsList,
    session
  );

  const mutation = useMutation(
    async ({
      data,
      urls,
    }: {
      data: Omit<TimelineFormInputs, "_id" | "createdAt">;
      urls: string[];
    }) => {
      const payload = {
        ...data,
        photo: urls.map((url, photoIdx: number) => {
          const caption = imagesCaption.find((e) => e.idx === photoIdx)?.value;
          return {
            url: url,
            idx: photoIdx,
            caption: caption,
          };
        }),
      };
      return sendData(payload);
    },
    {
      onSuccess: async (data) => {
        // Retrieve the current data for the user's timelines
        const currentData =
          queryClient.getQueryData<TimelineFormInputs[]>([
            session?.user?.email,
            "userTimelines",
          ]) || [];

        const response = await data.json();

        // Prepare the new payload, incorporating photo data
        const newPayload = {
          ...response,
          photo: previews.map((image, photoIdx: number) => {
            const caption = imagesCaption.find(
              (e) => e.idx === photoIdx
            )?.value;
            return {
              url: image,
              idx: photoIdx,
              caption: caption,
            };
          }),
        };

        // Update the query data with the new payload
        queryClient.setQueryData<TimelineFormInputs[]>(
          [session?.user?.email, "userTimelines"],
          [
            newPayload, // Add the new payload at the beginning of the array
            ...currentData, // Append the existing data
          ]
        );

        setPreviews([]);
      },
    }
  );

  const moduleOpen = () => {
    return tagInputVisibility;
  };

  type ModuleName = "tags" | "links" | "photo";
  type ToggleFunction = (name: ModuleName) => void;

  const toggleOpenModule: ToggleFunction = (name) => {
    if (name === "tags") {
      if (tagInputVisibility) {
        setTagInputVisibility(false);
        setOpenModule(false);
        return;
      }
      setPhotoInputVisibility(false);
      setTagInputVisibility(true);
      setLinkInputVisibility(false);
      setOpenModule(true);
    } else if (name === "links") {
      if (linkInputVisibility) {
        setLinkInputVisibility(false);
        setOpenModule(false);
        return;
      }
      setPhotoInputVisibility(false);
      setLinkInputVisibility(true);
      setTagInputVisibility(false);
      setOpenModule(true);
    } else if (name === "photo") {
      if (photoInputVisibility && images.length === 0) {
        setPhotoInputVisibility(false);
        setOpenModule(false);
        return;
      }
      setPhotoInputVisibility(true);
      setLinkInputVisibility(false);
      setTagInputVisibility(false);
      setOpenModule(true);
    }
  };

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    setSubmitBtnDisabled(true);
    const newPreviews = await handleFileChange(event);
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

    try {
      const uploadedUrls = await uploadImages(event);

      // If you want to set the URLs to some state
      setImages((prevImages) => [...prevImages, ...(uploadedUrls as string[])]);

      setImagesCaptions((prevCaptions) => [
        ...prevCaptions,
        ...new Array(newPreviews.length)
          .fill(0)
          .map((_, index) => ({ idx: prevCaptions.length + index, value: "" })),
      ]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }

    setSubmitBtnDisabled(false);
    event.target.value = "";
  };

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const handleInputActivation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputFileRef?.current?.click();
    toggleOpenModule("photo");
  };

  const onSubmit = async (data: TimelineFormInputs) => {
    if (
      data.mainText === "" &&
      data.photo?.length === 0 &&
      linksList.length === 0
    ) {
      return;
    }

    setSubmitBtnDisabled(true);
    const previewPhotos = createPhotoData(images, imagesCaption);
    const previewData = createDataObject(
      data,
      previewPhotos,
      tagsList,
      session,
      linksList
    );
    const { previousData } = optimisticUpdate({
      data: previewData,
      images: images,
    });

    let urls: string[] = [];
    if (imageUploadPromise) {
      urls = await imageUploadPromise;
      setImages([...images, ...urls]);
      setImageUploadPromise(null);
    }

    const currentPhotos = createPhotoData(urls, imagesCaption);
    const processedData = createDataObject(
      data,
      currentPhotos,
      tagsList,
      session,
      linksList
    );

    try {
      await mutation.mutateAsync({ data: processedData, urls: images });
    } catch (err) {
      if (previousData) {
        queryClient.setQueryData<{
          pages: TimelineFormInputs[][];
          pageParams: any[];
        }>(["timelines"], previousData);
      }
      throw err;
    }

    // Reset state only after successful submission
    setTagsList([]);
    setLinksList([]);
    setImages([]);
    editorRef.current.setContent("");
    reset();
    setSubmitBtnDisabled(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-12 border-2 flex flex-col min-h-48 my-4 rounded-md max-w-[850px] w-full"
    >
      <div className="h-2/3 flex">
        <div className="w-32">
          {session && (
            <ProfilePicture username={session!.user!.email as string} />
          )}
        </div>
        <PrimaryFormMainTextInput
          register={register}
          setValue={setValue}
          editorRef={editorRef}
        />
        {/* <textarea {...register("mainText")} placeholder="Escribe algo acá" className='w-full p-2 placeholder:text-2xl' /> */}
      </div>
      <div
        className={`border-t-2 p-4 bg-stone-100 ${
          moduleOpen() ? "min-h-48" : "h-3/5"
        }`}
      >
        <div className="flex gap-4">
          <div>
            <button
              className="h-8"
              onClick={handleInputActivation}
            >
              <FontAwesomeIcon
                className="h-full text-orange-600 cursor-pointer hover:text-orange-500 transition-all"
                icon={faCamera}
              />
            </button>
            <input
              accept="image/png, image/jpeg, video/mp4"
              className="absolute opacity-0 w-0 h-0 hidden"
              type="file"
              id={"photo"}
              multiple
              {...(register ? register("photo") : {})}
              ref={inputFileRef}
              onChange={handleUploadImages}
            />
          </div>
          <div>
            <button
              className="h-8 "
              onClick={(e) => {
                e.preventDefault();
                toggleOpenModule("tags");
              }}
            >
              <FontAwesomeIcon
                className={`h-full cursor-pointer hover:text-orange-500 transition-all ${
                  tagInputVisibility ? "text-orange-900" : "text-orange-600"
                } `}
                icon={faTag}
              />
            </button>
          </div>
          <div>
            <button
              className="h-8 "
              onClick={(e) => {
                e.preventDefault();
                toggleOpenModule("links");
              }}
            >
              <FontAwesomeIcon
                className="h-full text-orange-600 cursor-pointer hover:text-orange-500 transition-all "
                icon={faLink}
              />
            </button>
          </div>

          <div className="ml-auto mr-4">
            <button
              className="h-8 "
              disabled={submitBtnDisabled}
              type="submit"
            >
              <FontAwesomeIcon
                className="h-full text-orange-600 cursor-pointer hover:text-orange-500 transition-all "
                icon={faPaperPlane}
              />
            </button>
          </div>
        </div>

        {openModule && (
          <div className={`min-h-24 mt-2`}>
            {linkInputVisibility && (
              <FlexInputList
                inputList={linksList}
                setInputList={setLinksList}
                placeholder="Agrega un link y presiona Enter"
                type="link"
                showState={true}
              />
            )}

            {tagInputVisibility && (
              <FlexInputList
                inputList={tagsList}
                setInputList={setTagsList}
                placeholder="Agrega una categoría y presiona Enter"
                type="tag"
                showState={true}
              />
            )}

            {photoInputVisibility && previews.length > 0 && (
              <div className="flex flex-col gap-2">
                {previews.map((e, idx) => {
                  const isVideo = e.includes("data:video/mp4");

                  return (
                    <div key={idx}>
                      <button
                        className="text-xs text-red-500 mb-1"
                        onClick={(event) =>
                          handleDeleteImage(event, idx, setImages, setPreviews)
                        }
                      >
                        Borrar
                      </button>
                      {isVideo ? (
                        <video
                          controls
                          width="834"
                          height="834"
                          className="mt-2 rounded shadow-md"
                        >
                          <source
                            src={e}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Image
                          src={e}
                          alt={`Thumbnail ${idx}`}
                          className="mt-2 rounded shadow-md"
                          width={834}
                          height={834}
                        />
                      )}
                      <input
                        className="border w-full mb-1 p-2 placeholder:text-sm rounded-md"
                        placeholder="Agrega un texto a esta foto"
                        type="text"
                        onChange={(event) =>
                          handleCaptionChange(
                            event,
                            idx,
                            imagesCaption,
                            setImagesCaptions
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default PrimaryForm;
