import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import CategoriesList from "./CategoriesList";
import { useRouter } from "next/router";

const BlogsAsideMenu = ({
  handleSearchBar,
  setSearchValue,
}: {
  handleSearchBar?: ChangeEventHandler<HTMLInputElement>;
  setSearchValue?: Dispatch<SetStateAction<string | null>>;
}) => {
  const [barContentQuery, setBarContentQuery] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRedirect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (router.pathname !== "/blog") {
      router.push(`/blog?barcontent=${encodeURIComponent(event.target.value)}`);
    } else if (handleSearchBar) {
      handleSearchBar(event);
    }
  };

  const { barcontent } = router.query;

  useEffect(() => {
    if (barcontent) {
      setBarContentQuery(barcontent as string);
      router.replace("/blog", undefined, { shallow: true });
      if (inputRef.current) {
        inputRef.current.focus();
        if (setSearchValue) {
          console.log("@BlogsASideMenu");
          setSearchValue(barcontent as string);
        }
      }
    }
  }, [barcontent, router, setSearchValue]);

  return (
    <div>
      <div className="w-full">
        <div className="relative">
          <div className="w-14 h-full absolute top-0 flex items-center justify-center">
            <span className="h-1/3 mx-1 w-full border-red-500 border-r text-center">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="pb-1 text-red-500"
              />
            </span>
          </div>
          <input
            ref={inputRef}
            placeholder="Buscar por categoría"
            className="bg-gray-100 pl-16 pr-4 py-5 rounded-sm w-full placeholder:text-gray-400 placeholder:text-lg "
            defaultValue={barContentQuery || ""}
            type="text"
            onChange={handleSearchBar || handleRedirect}
          />
        </div>
      </div>

      <div className="">
        <CategoriesList />
      </div>

      {/* <div className="border w-full h-96"></div>
      <div className="border w-full h-48"></div> */}
    </div>
  );
};

export default BlogsAsideMenu;
