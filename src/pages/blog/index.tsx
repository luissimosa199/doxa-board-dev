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
import useSearchTimeline from "@/hooks/useSearchTimeline";
import BlogsAsideMenu from "@/components/BlogsAsideMenu";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

interface BlogListProps {
  timelineData: TimelineFormInputs[];
}

const Blog: FunctionComponent<BlogListProps> = ({ timelineData }) => {
  const { searchValue, searchResult, handleSearchBar, setSearchValue } =
    useSearchTimeline();

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

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const sentinelRef = useInfiniteScroll({
    onIntersect: loadMore,
    canFetch: hasNextPage ?? false,
  });

  const renderPosts = (posts: TimelineFormInputs[]) => {
    return posts.map((e) => (
      <div
        key={e._id}
        className="w-full md:w-fit h-full md:px-2 flex-1"
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
    ));
  };

  const renderLoading = () => {
    return <p>Cargando...</p>;
  };

  const renderError = () => {
    return <p>Error: {JSON.stringify(error)}</p>;
  };

  if (isLoading) {
    return renderLoading();
  }

  if (isError) {
    return renderError();
  }

  return (
    <section className="flex flex-col items-center w-full">
      <div className="my-4 flex w-full px-2 justify-center"></div>
      <div className="min-h-screen flex justify-center w-full md:w-auto mx-auto">
        <div className="h-full md:p-4 flex flex-col justify-center md:flex-row w-full ">
          <div className="h-fit p-2">
            <BlogsAsideMenu
              handleSearchBar={handleSearchBar}
              setSearchValue={setSearchValue}
            />
          </div>

          <div className="min-h-screen md:mx-2">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-4 w-full md:w-max">
              {searchValue && searchResult
                ? renderPosts(searchResult)
                : renderPosts(data?.pages.flat())}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div
          ref={sentinelRef}
          className="absolute bottom-0 h-[600px]"
        />
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
