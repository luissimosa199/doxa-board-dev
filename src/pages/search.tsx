import BlogPostCard from "@/components/BlogPostCard";
import BlogsAsideMenu from "@/components/BlogsAsideMenu";
import dbConnect from "@/db/dbConnect";
import { TimeLineModel } from "@/db/models";
import { TimelineFormInputs } from "@/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { FunctionComponent } from "react";

interface SearchProps {
  timelineData: TimelineFormInputs[];
}

const Search: FunctionComponent<SearchProps> = ({ timelineData }) => {
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

  return (
    <section className="flex flex-col items-center w-full">
      <div className="my-4 flex w-full px-2 justify-center"></div>
      <div className="min-h-screen flex justify-center w-full md:w-auto mx-auto">
        <div className="h-full md:p-4 flex flex-col justify-center md:flex-row w-full ">
          <div className="h-fit p-2 hidden md:block">
            <BlogsAsideMenu />
          </div>

          <div className="min-h-screen md:mx-2">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-4 w-full md:w-max">
              {renderPosts(timelineData)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  context: GetServerSidePropsContext
) => {
  try {
    await dbConnect();

    const { tags } = context.query;

    const tagsArray = Array.isArray(tags) ? tags : [tags];

    const response = await TimeLineModel.find({ tags: { $all: tagsArray } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const timelineData = response.map((item) => ({
      _id: item._id,
      mainText: item.mainText,
      length: item.length,
      photo: item.photo,
      createdAt: item.createdAt.toISOString(),
      tags: item.tags || [],
      authorId: item.authorId || "",
      authorName: item.authorName || "",
      links: item.links || [],
    }));

    return {
      props: {
        timelineData,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        timelineData: [],
      },
    };
  }
};
