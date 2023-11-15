import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
} from "react";
import CategoriesList from "./CategoriesList";
import { useRouter } from "next/router";

const BlogsAsideMenu = ({
  handleSearchBar,
  setSearchValue,
  barContentQuery,
  handleRedirect,
  inputRef,
  setShowNavBar,
}: {
  handleSearchBar?: ChangeEventHandler<HTMLInputElement>;
  setSearchValue?: Dispatch<SetStateAction<string | null>>;
  barContentQuery?: string | null;
  handleRedirect?: (event: ChangeEvent<HTMLInputElement>) => void;
  inputRef?: RefObject<HTMLInputElement> | null;
  setShowNavBar: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (router.asPath !== "/") {
      router.push(`/?barcontent=${encodeURIComponent(event.target.value)}`);
    } else if (handleSearchBar) {
      handleSearchBar(event);
    }
  };

  useEffect(() => {
    if (inputRef?.current && barContentQuery !== undefined) {
      inputRef.current.value = barContentQuery as string;
    }
  }, [barContentQuery, inputRef]);

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
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="">
        <CategoriesList setShowNavBar={setShowNavBar} />
      </div>
    </div>
  );
};

export default BlogsAsideMenu;
