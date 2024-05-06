import { useTypeSafePrefetch } from "@/hooks/useTypeSafePrefetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Prefetch = ReturnType<typeof useTypeSafePrefetch>;

const handlers = {
  directs: () => ({
    href: "/direct",
    onClick: (prefetch: Prefetch) => prefetch("getUserDms"),
  }),
  profile: ({ id }: { id: string }) => ({
    href: `/u/${id}`,
    onClick: (prefetch: Prefetch) => prefetch("getUserProfile", [id]),
  }),
};

type Handler = typeof handlers;

type ValueOf<T> = T[keyof T];
type DifferentProps = {
  [K in keyof Handler]: {
    route: K;
    data?: Parameters<Handler[K]>[0];
  };
};

// the purpose of this component is to start the query to the api before navigating to the page
// this will result in less loading time for the user
export const ApiPreloadLink: React.FC<
  ValueOf<DifferentProps> & { children?: React.ReactNode }
> = ({ children, route, data, ...props }) => {
  const prefetch = useTypeSafePrefetch();

  const { href, onClick } = handlers[route](data as any);

  return (
    <Link href={href} onClick={() => onClick(prefetch)} {...props}>
      {children}
    </Link>
  );
};

export const usePreloadPush = () => {
  const { push } = useRouter();
  const prefetch = useTypeSafePrefetch();
  return ({ route, data }: ValueOf<DifferentProps>) => {
    const { href, onClick } = handlers[route](data as any);
    onClick(prefetch);
    push(href);
  };
};
