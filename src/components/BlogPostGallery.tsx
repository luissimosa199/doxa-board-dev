import { TimelineFormInputs } from "@/types";
import { isVideo } from "@/utils/isVideo";
import Image from "next/image";
import React from "react";

const BlogPostGallery = ({
  timelineData,
}: {
  timelineData: TimelineFormInputs;
}) => {
  return (
    <div className="md:min-w-[400px] lg:min-w-[800px] xl:min-w-[1000px] my-2">
      {timelineData &&
        timelineData.photo &&
        timelineData.photo.length > 1 &&
        timelineData.photo.map((e, idx) => {
          if (idx === 0) {
            return null;
          }

          return (
            <>
              <div
                key={idx}
                className={`w-full ${
                  timelineData &&
                  timelineData.photo &&
                  timelineData?.photo?.length > 0
                    ? "min-h-[400px] md:min-h-[600px] lg:min-h-[1000px]"
                    : "h-0"
                } md:min-w-[550px] lg:min-w-[800px] xl:min-w-[1000px] relative overflow-hidden my-2`}
              >
                {timelineData &&
                timelineData.photo &&
                timelineData?.photo?.length > 1 &&
                isVideo(e.url) ? (
                  <video
                    controls
                    className="object-contain"
                  >
                    <source
                      src={e.url}
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
                      src={e.url}
                      alt=""
                      className="absolute object-contain"
                    />
                  )
                )}
              </div>
              {e && e.caption && (
                <span className="block w-full text-center mt-2">
                  {e.caption}
                </span>
              )}
            </>
          );
        })}
    </div>
  );
};

export default BlogPostGallery;
