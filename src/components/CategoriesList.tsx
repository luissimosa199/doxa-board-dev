import { fetchCategories } from "@/utils/getCategories";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";

type DataType = string | { value: string };

const CategoriesList = () => {
  const visibleItems = 20;
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, error } = useQuery<string[] | Error>({
    queryFn: fetchCategories,
    queryKey: ["categories"],
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 2,
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className="">
        <h2 className="text-3xl mb-4">Categorías</h2>
        <ul className="mb-8 flex flex-col gap-1">
          <li>
            <p>Cargando...</p>
          </li>
        </ul>
      </div>
    );
  }

  if (error || data instanceof Error) {
    return (
      <div className="">
        <h2 className="text-3xl mb-4">Categorías</h2>
        <ul className="mb-8 flex flex-col gap-1">
          <li>
            <p>Error {JSON.stringify(error)}</p>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Categorías</h2>
      <ul className="mb-4 flex flex-col justify-around gap-2 px-2 transition-all duration-500">
        {(data as DataType[]).map((e, idx: number) => {
          const displayValue = typeof e === "string" ? e : e.value;

          return (
            <li
              key={idx}
              className={`transform transition-all duration-500 w-full border-b border-gray-300 py-2`}
            >
              <Link
                className="capitalize py-1 px-2 hover:underline hover:text-gray-600 "
                href={`/nota/search?tags=${displayValue}`}
              >
                <FontAwesomeIcon
                  icon={faGreaterThan}
                  className="mr-2"
                  size="xs"
                />{" "}
                <span className="capitalize">{displayValue}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoriesList;
