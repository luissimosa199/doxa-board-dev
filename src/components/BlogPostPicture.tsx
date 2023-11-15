import { TimelineFormInputs } from "@/types";
import Image from "next/image";
import React from "react";

const isVideo = (string: string) => {
  return string.includes("/dahu3rii0/video/upload/") && string.endsWith(".mp4");
};

const BlogPostPicture = ({
  timelineData,
}: {
  timelineData: TimelineFormInputs;
}) => {
  return (
    <div
      className={`w-full ${
        timelineData && timelineData.photo && timelineData?.photo?.length > 0
          ? "h-[400px]  md:min-h-[600px] lg:h-[1000px]"
          : "h-0"
      } lg:min-w-[900px] xl:min-w-[1150px] relative overflow-hidden`}
    >
      {timelineData &&
      timelineData.photo &&
      timelineData?.photo?.length > 0 &&
      isVideo(timelineData.photo[0].url) ? (
        <video
          controls
          className="object-cover"
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
            className="absolute object-cover"
          />
        )
      )}
    </div>
  );
};

export default BlogPostPicture;
