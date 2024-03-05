import { QueryClient } from "react-query";
import { defaultQueryFn } from "./defaultQueryFn";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        console.log(error);
      },
    },
    queries: {
      onError: (error) => {
        console.log(error);
      },
      queryFn: defaultQueryFn as any,
    },
  },
});
