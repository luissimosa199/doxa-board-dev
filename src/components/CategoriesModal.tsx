import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";

const CategoriesModal = ({
  categories,
  setShowCategoriesModal,
}: {
  categories: string[];
  setShowCategoriesModal: Dispatch<SetStateAction<boolean>>;
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
    <div className="w-screen h-screen bg-white absolute top-0 left-0 z-40 overflow-y-scroll">
      <ul className="relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowCategoriesModal(false);
          }}
          className="border w-12 h-12 rounded-full bg-black text-white fixed top-0 right-0 flex justify-center items-center z-50"
        >
          <FontAwesomeIcon icon={faX} />
        </button>
        {categories.map((e, idx) => {
          return (
            <li
              key={`${idx}${e}`}
              className="capitalize text-lg text-center py-4 border-b border-gray-300"
            >
              <Link href={`/blog/search?tags=${e}`}>{e}</Link>
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
