import { TimelineFormInputs } from "@/types";
import { isVideo } from "@/utils/isVideo";
import Image from "next/image";
import React from "react";

const BlogPostPicture = ({
  timelineData,
}: {
  timelineData: TimelineFormInputs;
}) => {
  return (
    <>
      <div
        className={`w-full ${
          timelineData && timelineData.photo && timelineData?.photo?.length > 0
            ? "min-h-[400px] md:min-h-[600px] lg:min-h-[1000px]"
            : "h-0"
        } md:min-w-[550px] lg:min-w-[800px] xl:min-w-[1000px] relative overflow-hidden`}
      >
        {timelineData &&
        timelineData.photo &&
        timelineData?.photo?.length > 0 &&
        isVideo(timelineData.photo[0].url) ? (
          <video
            controls
            className="object-contain"
          >
            <source
              src={timelineData.photo[0].url}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          timelineData &&
          timelineData.photo &&
          timelineData?.photo?.length > 0 && (
            <Image
              fill
              src={timelineData.photo[0].url}
              alt=""
              className="absolute object-contain"
            />
          )
        )}
      </div>
      {timelineData.photo && timelineData.photo[0].caption && (
        <span className="block w-full text-center mt-2">
          {timelineData.photo[0].caption}
        </span>
      )}
    </>
  );
};

export default BlogPostPicture;
