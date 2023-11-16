import Ad from "@/components/Ad";
import BlogPostGallery from "@/components/BlogPostGallery";
import BlogPostLink from "@/components/BlogPostLink";
import BlogPostPicture from "@/components/BlogPostPicture";
import BlogsAsideMenu from "@/components/BlogsAsideMenu";
import dbConnect from "@/db/dbConnect";
import { TimeLineModel } from "@/db/models";
import { TimelineFormInputs } from "@/types";
import formatDateString from "@/utils/formatDateString";
import { isVideo } from "@/utils/isVideo";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import React, {
  ChangeEventHandler,
  Dispatch,
  FunctionComponent,
  SetStateAction,
} from "react";

interface TimelinePageProps {
  timelineData: TimelineFormInputs | null;
}

const BlogPost: FunctionComponent<
  TimelinePageProps & {
    handleSearchBar: ChangeEventHandler<HTMLInputElement>;
    setSearchValue: Dispatch<SetStateAction<string | null>>;
  }
> = ({ timelineData, handleSearchBar, setSearchValue }) => {
  return (
    <section className="p-4 w-auto">
      <div className="lg:min-w-[1024px] max-w-[1700px] grid grid-cols-1 md:grid-rows-7 mx-auto">
        <div className="md:col-span-1 min-w-[200px] pr-4 md:block hidden">
          <BlogsAsideMenu
            handleSearchBar={handleSearchBar}
            setSearchValue={setSearchValue}
          />
        </div>
        <div className="md:col-start-2 col-span-4 min-h-screen">
          {/* content */}
          <div className="">
            <div className="">
              <div className="md:min-w-[400px] lg:min-w-[800px] xl:min-w-[1000px] min-[1350px]:min-w-[1100px]">
                {timelineData &&
                  timelineData.photo &&
                  timelineData.photo.length > 0 && (
                    <BlogPostPicture timelineData={timelineData} />
                  )}
              </div>

              <div className="mb-2">
                <ul className="mt-4 flex font-semibold text-sm text-[#777777]">
                  <li className="capitalize">
                    {formatDateString(timelineData?.createdAt as string)}{" "}
                  </li>
                  <li className="border-l border-l-gray-400 pl-4 ml-4">
                    Publicado por : {timelineData?.authorName}
                  </li>
                </ul>
              </div>

              <div className="text-[#777]">
                <div
                  className="prose min-w-full break-normal text-md"
                  dangerouslySetInnerHTML={{
                    __html: timelineData?.mainText || "",
                  }}
                ></div>
              </div>

              {timelineData?.links && timelineData?.links.length > 0 && (
                <BlogPostLink
                  _id={timelineData._id}
                  links={timelineData.links}
                />
              )}
            </div>
          </div>
          <div className="w-full h-32 overflow-hidden">
            <Ad />
          </div>
          {timelineData && <BlogPostGallery timelineData={timelineData} />}
        </div>
      </div>
    </section>
  );
};

export default BlogPost;

export const getServerSideProps: GetServerSideProps<TimelinePageProps> = async (
  context: GetServerSidePropsContext
) => {
  try {
    await dbConnect();

    const { slug } = context.query;

    let timeline;

    if (slug!.length !== 9) {
      timeline = await TimeLineModel.findOne({ urlSlug: slug }).lean();
    } else {
      timeline = await TimeLineModel.findById(slug).lean();
    }

    if (!timeline) {
      return {
        notFound: true,
      };
    }

    const timelineData = {
      _id: timeline._id,
      urlSlug: timeline.urlSlug || "",
      mainText: timeline.mainText,
      length: timeline.length,
      photo: timeline.photo,
      createdAt: timeline.createdAt.toISOString(),
      tags: timeline.tags || [],
      authorId: timeline.authorId || "",
      authorName: timeline.authorName || "",
      links: timeline.links
        ? timeline.links.map((link) =>
            typeof link === "string" ? { value: link } : link
          )
        : [],
    };

    return {
      props: {
        timelineData,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
