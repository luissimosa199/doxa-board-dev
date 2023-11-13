import { TimeLineProps } from "@/types";
import { stripHtml } from "@/utils/stripHtml";
import Image from "next/image";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { getDayAndMonth } from "./getDayAndMonth";

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
  const { day, month } = getDayAndMonth(createdAt);

  return (
    <div className="border h-full w-full md:w-fit">
      <div className="flex flex-col h-full">
        <div className="relative">
          <div className="relative overflow-hidden w-full md:w-[375px] lg:w-[475px] h-[315px]">
            <Link href={`/blog/${urlSlug}`}>
              <Image
                src={
                  timeline && timeline.length > 0
                    ? (timeline[0].url as string)
                    : "/assets/1.jpg"
                }
                className="absolute object-cover"
                alt=""
                fill
              />
            </Link>
          </div>
          <div className="absolute bottom-8 left-8 px-2 py-3 bg-white shadow-md">
            <div className="flex flex-col justify-center items-center">
              <h3 className="font-semibold text-lg">{day}</h3>
              <h6 className="capitalize">{month}</h6>
            </div>
          </div>
        </div>
        <div className="p-5 w-full md:w-[375px] lg:max-w-[475px]">
          <div className="min-h-[100px]">
            <h6 className="text-[#9a9a9a] font-semibold capitalize">
              <i className=""></i>
              {tags && tags.map((e) => `${e} `)}
            </h6>
            <Link href={`/blog/${urlSlug}`}>
              <h5 className="text-[#333333] font-semibold text-lg">
                {`${mainText && stripHtml(mainText).slice(0, 15)}${
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
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
