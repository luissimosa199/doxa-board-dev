import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";

const CategoriesModal = ({
  categories,
  setShowCategoriesModal,
  setShowNavBar,
}: {
  categories: string[];
  setShowCategoriesModal: Dispatch<SetStateAction<boolean>>;
  setShowNavBar?: Dispatch<SetStateAction<boolean>>;
}) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShowCategoriesModal(false);
        }
      },
      { threshold: 1.0 }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [setShowCategoriesModal]);

  return (
    <div className="w-full h-72 bg-white top-0 left-0 z-40 overflow-y-scroll">
      <ul className="relative">
        {categories.map((e, idx) => {
          return (
            <li
              key={`${idx}${e}`}
              className="capitalize text-lg text-center border-b border-gray-300"
            >
              <Link
                onClick={() => {
                  setShowCategoriesModal(false);
                  if (setShowNavBar) {
                    setShowNavBar(false);
                  }
                }}
                href={`/blog/search?tags=${e}`}
              >
                {e}
              </Link>
            </li>
          );
        })}
        <li className="bg-transparent h-0">
          <div
            ref={sentinelRef}
            className="mt-12"
          />
        </li>
      </ul>
    </div>
  );
};

export default CategoriesModal;
