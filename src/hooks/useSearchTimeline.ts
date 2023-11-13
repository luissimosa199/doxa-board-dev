import { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import { TimelineFormInputs } from "@/types";

const useSearchTimeline = () => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<TimelineFormInputs[] | null>(
    null
  );

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearchValue(value);
    }, 300)
  );

  const handleSearch = useCallback(async (value: string) => {
    const url = new URL("/api/timeline", window.location.origin);
    const valuesArray = value.split(" ");

    valuesArray.forEach((e) => url.searchParams.append("tags", e));

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSearchBar: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => {
      event.preventDefault();
      debouncedSearch.current(event.target.value);
    }, []);

  useEffect(() => {
    if (searchValue) {
      handleSearch(searchValue);
    }
  }, [searchValue, handleSearch]);

  useEffect(() => {
    const currentDebouncedSearch = debouncedSearch.current;
    return () => {
      currentDebouncedSearch.cancel();
    };
  }, []);

  return { handleSearchBar, setSearchValue, searchValue, searchResult };
};

export default useSearchTimeline;
