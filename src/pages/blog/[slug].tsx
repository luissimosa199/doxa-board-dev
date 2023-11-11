import CategoriesList from "@/components/CategoriesList";
import dbConnect from "@/db/dbConnect";
import { TimeLineModel } from "@/db/models";
import { TimelineFormInputs } from "@/types";
import formatDateString from "@/utils/formatDateString";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import React, { FunctionComponent } from "react";

interface TimelinePageProps {
  timelineData: TimelineFormInputs | null;
}

const BlogPost: FunctionComponent<TimelinePageProps> = ({ timelineData }) => {
  console.log(timelineData);

  return (
    <section className="p-4">
      <div className="min-w-[1024px] max-w-[1700px] grid grid-rows-7 mx-auto">
        <div className="col-span-1 min-h-screen min-w-[180px] pr-4">
          <div className=" h-full w-full">
            <CategoriesList />
          </div>
        </div>
        <div className="col-start-2 col-span-4 min-h-screen">
          {/* content */}
          <div className="">
            <div className="">
              {/* imagen */}
              {timelineData &&
                timelineData.photo &&
                timelineData.photo.length > 0 && (
                  <div className="w-full h-[1300px] relative overflow-hidden">
                    <Image
                      fill
                      src={timelineData?.photo[0].url}
                      alt=""
                      className="absolute object-cover"
                    />
                  </div>
                )}
              {/* imagen */}

              <div className="">
                <ul className="mt-4 flex font-semibold text-sm text-[#777777]">
                  <li className="capitalize">
                    {formatDateString(timelineData?.createdAt as string)}{" "}
                  </li>
                  <li className="border-l border-l-gray-400 pl-4 ml-4">
                    Publicado por : {timelineData?.authorName}
                  </li>
                  {/* <li className="border-l border-l-gray-400 pl-4 ml-4">
                    <i className="fa fa-heart"></i>5 Hits
                  </li>
                  <li className="border-l border-l-gray-400 pl-4 ml-4">
                    <i className="fa fa-comments"></i>
                    10 Comment
                  </li> */}
                </ul>
              </div>
              <div className="text-[#777]">
                <div
                  className="prose min-w-full break-normal text-base"
                  dangerouslySetInnerHTML={{
                    __html: timelineData?.mainText || "",
                  }}
                ></div>
              </div>
            </div>
          </div>
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
      links: timeline.links.map((link) =>
        typeof link === "string" ? { value: link } : link
      ),
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
