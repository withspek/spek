"use client";
import { HomeIcon, InboxIcon, SearchIcon } from "@/icons";
import { Avatar, Tooltip } from "@spek/ui";
import Link from "next/link";

export const LeftPanel: React.FC = () => {
  return (
    <div className="flex flex-col justify-between border-r border-primary-200 px-3">
      <div className="flex flex-col items-end gap-5 mt-4">
        <Link href={"/home"}>
          <Tooltip content="Home" placement="right">
            <HomeIcon />
          </Tooltip>
        </Link>
        <Link href={"/home"}>
          <Tooltip content={"Search"} placement="right">
            <SearchIcon />
          </Tooltip>
        </Link>
        <Link href={"/directs"}>
          <Tooltip content={"Inbox"} placement="right">
            <InboxIcon />
          </Tooltip>
        </Link>
      </div>
      <div className="flex flex-col mb-4">
        <Avatar
          alt=""
          imageSrc={
            "https://en.wikipedia.org/wiki/File:Elon_Musk_Colorado_2022_(cropped2).jpg"
          }
        />
      </div>
    </div>
  );
};

export const TopPanel: React.FC = () => {
  return (
    <div>
      <p>hello world</p>
    </div>
  );
};
