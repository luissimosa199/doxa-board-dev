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
    <div className="my-2">
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
                className={`w-full h-full my-2`}
              >
                {timelineData &&
                timelineData.photo &&
                timelineData?.photo?.length > 1 &&
                isVideo(e.url) ? (
                  <video
                    controls
                    className="w-full h-auto"
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
                      width={500}
                      height={500}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                      src={e.url}
                      alt=""
                      className="w-full h-auto"
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
