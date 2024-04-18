"use client";

import { SearchBar } from "@/components/SearchBar";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SearchPageController: React.FC<{ query: string }> = ({
  query,
}) => {
  const { push } = useRouter();
  const { data, isLoading } = useTypeSafeQuery(["search", query], {}, [query]);
  if (isLoading && data) {
    return null;
  }

  if (!query) {
    push("/home");
  }

  const results = data
    ? [...data.threads, ...data.communities, ...data.users]
    : [];
  return (
    <div className="flex flex-col gap-4 mt-4">
      <SearchBar defaultValue={query} />
      <div className="flex flex-col gap-3">
        {results.length == 0 && <p>No results found</p>}
        {results.map((item) =>
          "username" in item ? (
            <Link href={`/u/${item.id}`} key={item.id}>
              <p>User: {item.username}</p>
              <p>{item.bio}</p>
            </Link>
          ) : "memberCount" in item ? (
            <Link href={`/c/${item.id}`} key={item.id}>
              <p>Community: {item.name}</p>
              <p>{item.description}</p>
            </Link>
          ) : (
            <Link href={`/thread/${item.id}`} key={item.id}>
              <p>Thread: {item.name}</p>
            </Link>
          )
        )}
      </div>
    </div>
  );
};
