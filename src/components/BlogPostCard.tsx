import { TimeLineProps } from "@/types";
import { stripHtml } from "@/utils/stripHtml";
import Image from "next/image";
import Link from "next/link";
import React, { FunctionComponent, useState } from "react";
import { getDayAndMonth } from "./getDayAndMonth";
import BlogPostCardButtons from "./BlogPostCardButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import ShareButtons from "./ShareButtons";

const BlogPostCard: FunctionComponent<TimeLineProps> = ({
  timeline,
  length,
  mainText,
  createdAt,
  tags,
  _id,
  authorId,
  authorName,
  links,
  urlSlug,
}) => {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const { day, month } = getDayAndMonth(createdAt);

  return (
    <div className="border h-full w-full md:w-fit">
      <div className="flex flex-col h-full">
        <div className="relative">
          <div className="relative overflow-hidden w-full md:w-[375px] lg:w-[475px] h-[315px]">
            <Link href={`/${urlSlug || _id}`}>
              <Image
                src={
                  timeline &&
                  timeline.length > 0 &&
                  !timeline[0].url.includes("/dahu3rii0/video/upload/") &&
                  !timeline[0].url.endsWith(".mp4")
                    ? (timeline[0].url as string)
                    : "/assets/1.jpg"
                }
                className="absolute object-cover"
                alt=""
                fill
              />
            </Link>
            <BlogPostCardButtons
              _id={_id}
              authorId={authorId}
            />
          </div>
          <div className="absolute bottom-8 left-8 px-2 py-3 bg-white shadow-md">
            <div className="flex flex-col justify-center items-center">
              <h3 className="font-semibold text-lg">{day}</h3>
              <h6 className="capitalize">{month}</h6>
            </div>
          </div>
        </div>
        <div className="p-5 w-full md:w-[375px] lg:w-[475px] relative">
          <div className="min-h-[100px]">
            <h6 className="text-[#9a9a9a] font-semibold capitalize">
              <i className=""></i>
              {tags && tags.map((e) => `${e} `)}
            </h6>
            <Link href={`/${urlSlug || _id}`}>
              <h5 className="text-[#333333] font-semibold text-lg">
                {`${mainText && stripHtml(mainText).slice(0, 45)}${
                  mainText && mainText?.length > 15 ? "..." : ""
                }`}
              </h5>
            </Link>
            <p className="text-[#9a9a9a]">
              {`${mainText && stripHtml(mainText).slice(0, 100)}${
                mainText && mainText?.length > 100 ? "..." : ""
              } `}
            </p>
          </div>
          <div className="absolute w-8 h-8 right-2 top-2 flex justify-center">
            <button
              onClick={() => {
                setShowShareModal(!showShareModal);
              }}
            >
              <FontAwesomeIcon
                className="w-6 h-6"
                icon={faShareNodes}
              />
            </button>
            {showShareModal && (
              <div className="w-36 h-6 absolute top-0 right-16 z-40">
                <ShareButtons
                  url={`${process.env.NEXT_PUBLIC_BASE_URL}/${
                    urlSlug as string
                  }`}
                  title={mainText ? mainText : "Visita nuestro blog!"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
