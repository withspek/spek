"use client";

import Downshift from "downshift";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Community, Thread, User } from "@spek/client";
import { UserAvatar } from "@spek/ui";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { SearchOverlay } from "./SearchOverlay";
import { SearchBar } from "./SearchBar";

export const DiscoverSearchController: React.FC = () => {
  const [rawText, setText] = useState("");
  const [text] = useDebounce(rawText, 200);
  let enabled = false;
  const isUsernameSearch = text.startsWith("@");

  if (text && isUsernameSearch && text.trim().length > 2) {
    enabled = true;
  }

  if (text && !isUsernameSearch && text.trim().length > 1) {
    enabled = true;
  }

  const { data } = useTypeSafeQuery(["search", text], { enabled }, [text]);

  const { push } = useRouter();

  return (
    <Downshift<Community | User | Thread>
      onChange={(selection) => {
        if (!selection) {
          return;
        }
        if ("username" in selection) {
          push(`/u/${selection.id}`);
          return;
        } else if ("slug" in selection) {
          push(`/c/${selection.slug}`);
          return;
        }

        push(`/c/${selection.id}`);
      }}
      onInputValueChange={(v) => {
        setText(v);
      }}
      itemToString={(item) => {
        if (!item) {
          return "";
        } else if ("name" in item) {
          return item.name;
        }

        return item.username;
      }}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectItem,
        getRootProps,
      }) => (
        <SearchOverlay
          {...getRootProps({ refKey: "ref" }, { suppressRefError: true })}
        >
          <SearchBar
            {...getInputProps()}
            placeholder="Search communities, users and threads.."
          />
          <ul
            className="absolute w-full bg-primary-800 rounded-b-md overflow-y-auto"
            {...getMenuProps({ style: { top: 42, maxHeight: "50vh" } })}
          >
            {isOpen && data?.items.length === 0 ? (
              <div>No results found.</div>
            ) : null}
            {isOpen
              ? data?.items.map((item, index) =>
                  "username" in item ? (
                    <li
                      className={`flex cursor-pointer p-3 ${highlightedIndex === index ? "bg-primary-700" : "bg-primary-800"} ${data.items.length - 1 === index ? "rounded-b-md" : ""}`}
                      {...getItemProps({
                        key: item.id,
                        index,
                        item,
                      })}
                    >
                      <UserAvatar user={item} size="mdLg" />
                      <div className="ml-2">
                        <div className="text-primary-100">
                          {item.displayName}
                        </div>
                        <div className="text-primary-300">{item.username}</div>
                      </div>
                    </li>
                  ) : "memberCount" in item ? (
                    <li
                      className={`flex flex-col cursor-pointer gap-2 p-3 ${highlightedIndex === index ? "bg-primary-700" : "bg-primary-800"} ${data.items.length - 1 === index ? "rounded-b-md" : ""}`}
                      {...getItemProps({
                        key: item.id,
                        index,
                        item,
                      })}
                    >
                      <div className="text-primary-100">{item.name}</div>
                      <div className="text-primary-300">{item.description}</div>
                    </li>
                  ) : (
                    <li
                      className={`flex p-3 ${highlightedIndex === index ? "bg-primary-700" : "bg-primary-800"} ${data.items.length - 1 === index ? "rounded-b-md" : ""}`}
                      {...getItemProps({
                        key: item.id,
                        index,
                        item,
                      })}
                    >
                      <div className="text-primary-100">{item.name}</div>
                      <div className="text-primary-300">
                        {item.peoplePreviewList.join(",")}
                      </div>
                    </li>
                  )
                )
              : null}
          </ul>
        </SearchOverlay>
      )}
    </Downshift>
  );
};
