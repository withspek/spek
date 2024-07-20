import { useTypeSafePrefetch } from "@/hooks/useTypeSafePrefetch";
import { SearchIcon } from "@/icons";
import { Input } from "@/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SearchBar: React.FC<{ defaultValue: string }> = ({
  defaultValue,
}) => {
  const [query, setQuery] = useState(defaultValue);
  const { push } = useRouter();
  const prefetch = useTypeSafePrefetch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!!query) {
      prefetch(["search", query], [query]);
      push(`/search?query=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="flex bg-primary-800 border border-primary-700 items-center px-3 rounded-md">
        <SearchIcon height={20} width={20} className="text-primary-300" />
        <Input
          placeholder="Search communities, threads and users"
          value={query}
          transparent
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
};
