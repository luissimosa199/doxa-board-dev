import React, { FunctionComponent, PropsWithChildren } from "react";

const BlogPostCardAdContainer: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="w-full md:w-fit h-full lg:ml-2 md:px-2 flex-1">
      <div className="h-full w-full md:w-fit overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="relative">
            <div className="relative overflow-hidden w-full md:w-[375px] lg:w-[460px] h-[315px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCardAdContainer;
