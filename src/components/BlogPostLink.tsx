import { InputItem } from "@/types";
import { isYtUrl, extractVideoId, extractTimestamp } from "@/utils/isYtUrl";
import React from "react";
import IFrame from "./Iframe";
import YouTubePlayer from "./YoutubePlayer";

const BlogPostLink = ({
  links,
  _id,
}: {
  links: string[] | InputItem[];
  _id: string;
}) => {
  return (
    <>
      {links &&
        links.map((e: string | InputItem, idx: number) => {
          let src: string;
          let caption: string | undefined;

          if (typeof e === "object" && e.value) {
            src = e.value;
            caption = e.caption;
          } else if (typeof e === "string") {
            src = e;
            caption = undefined;
          } else {
            return null;
          }

          if (isYtUrl(src) && extractVideoId(src)) {
            const start = extractTimestamp(src);

            return (
              <div
                key={src + _id}
                className="mt-4 max-w-[800px] w-full mx-auto bg-white"
              >
                <div className="">
                  <YouTubePlayer
                    videoId={extractVideoId(src) as string}
                    h="500px"
                    start={start}
                  />
                  {caption && (
                    <p className="text-lg text-gray-500 mt-2 ml-2">{caption}</p>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={src + _id}
              className="mt-4 w-full mx-auto bg-white"
            >
              <div className="">
                <IFrame
                  src={src}
                  h="800px"
                />
                {caption && (
                  <p className="text-lg text-gray-500 mt-2 ml-2">{caption}</p>
                )}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default BlogPostLink;
