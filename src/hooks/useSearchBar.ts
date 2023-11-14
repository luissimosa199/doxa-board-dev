import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  ChangeEventHandler,
} from "react";
import { useRouter } from "next/router";

const useSearchBar = (
  handleSearchBar: ChangeEventHandler<HTMLInputElement>,
  setSearchValue: Dispatch<SetStateAction<string | null>>
) => {
  const [barContentQuery, setBarContentQuery] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRedirect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (router.asPath !== "/") {
      router.push(`/?barcontent=${encodeURIComponent(event.target.value)}`);
    } else if (handleSearchBar) {
      handleSearchBar(event);
    }
  };

  const { barcontent } = router.query;

  useEffect(() => {
    if (barcontent) {
      setBarContentQuery(barcontent as string);
      router.replace("/", undefined, { shallow: true });
      if (inputRef.current) {
        inputRef.current.focus();
        if (setSearchValue) {
          setSearchValue(barcontent as string);
        }
      }
    }
  }, [barcontent, router, setSearchValue]);

  return { barContentQuery, handleRedirect, inputRef, setBarContentQuery };
};

export default useSearchBar;
