import { http } from "@spek/client";
import { useContext } from "react";

import DataFetchingContext from "@/contexts/DataFetchingContext";

export const useFetch = () => {
  return useContext(DataFetchingContext).conn!;
};

export const useWrappedFetch = () => {
  return http.wrap(useContext(DataFetchingContext).conn!);
};
