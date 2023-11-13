import BlogsAsideMenu from "@/components/BlogsAsideMenu";
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
  return (
    <section className="p-4 w-auto">
      <div className="lg:min-w-[1024px] max-w-[1700px] grid grid-cols-1 md:grid-rows-7 mx-auto">
        <div className="md:col-span-1 min-w-[180px] pr-4">
          <BlogsAsideMenu />
        </div>
        <div className="md:col-start-2 col-span-4 min-h-screen">
          {/* content */}
          <div className="">
            <div className="">
              {/* imagen */}
              {timelineData &&
                timelineData.photo &&
                timelineData.photo.length > 0 && (
                  <div className="w-full h-[400px] md:min-h-[800px] lg:min-w-[800px] xl:min-w-[1000px] lg:h-[1300px] relative overflow-hidden">
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
                </ul>
              </div>
              <div className="text-[#777]">
                <div
                  className="prose min-w-full break-normal text-md"
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
