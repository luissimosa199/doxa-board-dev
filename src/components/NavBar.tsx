import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import BlogsAsideMenu from "./BlogsAsideMenu";

const Navbar = ({
  handleSearchBar,
  setSearchValue,
  barContentQuery,
  handleRedirect,
  inputRef,
  setBarContentQuery,
}: {
  handleSearchBar?: ChangeEventHandler<HTMLInputElement>;
  setSearchValue?: Dispatch<SetStateAction<string | null>>;
  setBarContentQuery?: Dispatch<SetStateAction<string | null>>;
  barContentQuery: string | null;
  handleRedirect: (event: ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement> | null;
}) => {
  const [showNavBar, setShowNavBar] = useState<boolean>(false);

  useEffect(() => {
    if (setBarContentQuery) {
      setBarContentQuery(null);
    }
  }, [setBarContentQuery, showNavBar]);

  const handleOpenNavBar = (e: any) => {
    e.preventDefault();
    setShowNavBar(!showNavBar);
  };

  return (
    <header className="flex justify-between p-2 bg-base-100 shadow-sm">
      <div className="relative md:hidden">
        <button
          className="cursor-pointer"
          onClick={handleOpenNavBar}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        {showNavBar && (
          <div className="w-96 mt-3 -ml-2 p-2 bg-white shadow rounded bg-base-100 z-40 absolute">
            <div className="mb-4 font-semibold">
              <span>
                <Link
                  href="/"
                  className="text-center"
                >
                  Homepage
                </Link>
              </span>
            </div>
            <BlogsAsideMenu
              handleSearchBar={handleSearchBar}
              setSearchValue={setSearchValue}
              barContentQuery={barContentQuery}
              handleRedirect={handleRedirect}
              inputRef={inputRef}
              setShowNavBar={setShowNavBar}
            />
          </div>
        )}
      </div>

      <div className="w-full text-center"></div>

      <div className="flex">
        <Link href="/perfil">
          <div className="p-4 bg-gray-300 w-8 h-8 flex justify-center items-center ">
            <FontAwesomeIcon
              icon={faUser}
              className="w-3 h-3"
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
