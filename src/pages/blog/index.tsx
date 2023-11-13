import CategoriesList from "@/components/CategoriesList";
import BlogPostCard from "../../components/BlogPostCard";
import dbConnect from "../../db/dbConnect";
import { TimeLineModel } from "../../db/models";
import { TimelineFormInputs } from "../../types";
import { getTimelines } from "../../utils/getTimelines";
import {
  QueryClient,
  dehydrate,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import PrimaryForm from "@/components/PrimaryForm";

interface BlogListProps {
  timelineData: TimelineFormInputs[];
}

const Blog: FunctionComponent<BlogListProps> = ({ timelineData }) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<TimelineFormInputs[]>(
    ["timelines"],
    ({ pageParam = 0 }) => getTimelines("timelines", pageParam),
    {
      initialData: {
        pages: [timelineData], // Wrapping timelineData in another array
        pageParams: [null],
      },
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return undefined;
        return allPages.length;
      },
    }
  );

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <section className="flex flex-col items-center w-full">
      <div className="my-4 flex w-full px-2 justify-center">
        <PrimaryForm />
      </div>
      <div className="min-h-screen flex justify-center mx-auto">
        <div className="h-full md:p-4 flex flex-col justify-center md:flex-row  ">
          <div className="h-fit p-2">
            <div className=" md:w-80 h-full">
              <CategoriesList />
            </div>
          </div>

          <div className="min-h-screen md:mx-2">
            <div className="grid grid-cols-1 xl:grid-cols-2 w-max">
              {data?.pages.map((page) =>
                page.map((e) => (
                  <div
                    key={e._id}
                    className="w-fit h-full md:px-2 flex-1"
                  >
                    <BlogPostCard
                      _id={e._id}
                      tags={Array.isArray(e.tags) ? e.tags : [e.tags]}
                      mainText={e.mainText}
                      length={e.length}
                      timeline={e.photo}
                      createdAt={e.createdAt}
                      authorId={e.authorId}
                      authorName={e.authorName}
                      links={e.links}
                      urlSlug={e.urlSlug}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;

export const getServerSideProps: GetServerSideProps<
  BlogListProps
> = async () => {
  const queryClient = new QueryClient();

  try {
    await dbConnect();

    const response = await TimeLineModel.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const timelineData = response.map((item) => ({
      _id: item._id,
      urlSlug: item.urlSlug || "",
      mainText: item.mainText,
      length: item.length,
      photo: item.photo,
      createdAt: item.createdAt.toISOString(),
      tags: item.tags || [],
      authorId: item.authorId || "",
      authorName: item.authorName || "",
      links: item.links,
    }));

    queryClient.setQueryData(["timelines"], {
      pages: [timelineData],
      pageParams: [null],
    });

    return {
      props: {
        timelineData,
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        timelineData: [],
        dehydratedState: dehydrate(queryClient),
      },
    };
  }
};
