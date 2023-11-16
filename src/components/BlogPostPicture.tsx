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
      <div className={`w-full h-full`}>
        {timelineData &&
        timelineData.photo &&
        timelineData?.photo?.length > 0 &&
        isVideo(timelineData.photo[0].url) ? (
          <video
            controls
            className="w-full h-auto"
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
              width={400}
              height={400}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
              src={timelineData.photo[0].url}
              alt=""
              className="w-full h-auto"
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
