import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ChangeEventHandler, Dispatch, SetStateAction, useMemo } from "react";
import useTrackUserAgent from "../hooks/useTrackUserAgent";
import Navbar from "@/components/NavBar";
import useSearchTimeline from "@/hooks/useSearchTimeline";
import useSearchBar from "@/hooks/useSearchBar";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useTrackUserAgent();
  const { searchValue, searchResult, handleSearchBar, setSearchValue } =
    useSearchTimeline();

  const { barContentQuery, handleRedirect, inputRef, setBarContentQuery } =
    useSearchBar(
      handleSearchBar as ChangeEventHandler<HTMLInputElement>,
      setSearchValue as Dispatch<SetStateAction<string | null>>
    );

  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Navbar
            handleSearchBar={handleSearchBar}
            setSearchValue={setSearchValue}
            barContentQuery={barContentQuery}
            handleRedirect={handleRedirect}
            inputRef={inputRef}
            setBarContentQuery={setBarContentQuery}
          />
          <Component
            {...pageProps}
            searchResult={searchResult}
            searchValue={searchValue}
            handleSearchBar={handleSearchBar}
            setSearchValue={setSearchValue}
            barContentQuery={barContentQuery}
            inputRef={inputRef}
          />
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
