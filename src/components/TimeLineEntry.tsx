import { FunctionComponent } from "react";
import { TimeLineEntryProps } from "@/types";
import { CldImage } from "next-cloudinary";
import ShareButtons from "./ShareButtons";

const TimeLineEntry: FunctionComponent<TimeLineEntryProps> = ({
  data,
  idx,
  length,
}) => {
  const isVideo =
    (data.url.includes("/dahu3rii0/video/upload/") &&
      data.url.endsWith(".mp4")) ||
    data.url.includes("data:video/mp4");

  return (
    <div className="mt-4 w-fit mx-auto bg-white">
      <div className="w-full relative">
        {isVideo ? (
          <video
            controls
            width="850"
            height="850"
            className="rounded mx-auto"
          >
            <source
              src={data.url}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <CldImage
            className="rounded mx-auto"
            src={data.url}
            alt={data.caption || "image"}
            width={850}
            height={850}
            priority={idx === 0}
          />
        )}
        <div className="absolute bottom-2 right-14 scale-150">
          <ShareButtons
            url={data.url}
            title="foto"
          />
        </div>
      </div>
      <p className="text-lg text-gray-500 mt-2 ml-2 break-normal">
        {data.caption}
      </p>
    </div>
  );
};

export default TimeLineEntry;
