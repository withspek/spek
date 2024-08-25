import { Input } from "@/ui/input";
import { Icon, Spinner } from "@spek/ui";
import React from "react";

export interface SearchBarProps
  extends React.ComponentPropsWithoutRef<"input"> {
  inputClassName?: string;
  mobile?: boolean;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = "",
  inputClassName = "",
  mobile = false,
  loading = false,
  ...props
}) => {
  return (
    <div
      className={`flex w-full items-center bg-primary-800 text-primary-100 transition duration-200 ease-in-out
        focus-within:text-primary-100 rounded ${mobile ? "px-4" : ""} ${className}`}
    >
      {!mobile && (
        <div className="h-full mx-4 flex items-center pointer-events-none">
          <Icon name="search" />
        </div>
      )}
      <Input className={`${inputClassName} pl-0`} {...props} />
      {loading && (
        <div className="h-full mx-4 flex items-center pointer-events-none">
          <Spinner className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};
