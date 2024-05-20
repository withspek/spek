"use client";
import { useConn } from "@/hooks/useConn";
import { HomeIcon, InboxIcon, PlusIcon, SearchIcon } from "@/icons";
import { Modal } from "@/ui/modal";
import { Avatar, Tooltip } from "@spek/ui";
import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "./SearchBar";

export const LeftPanel: React.FC = () => {
  const { user } = useConn();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col justify-between border-r border-primary-200 px-3">
      <div className="flex flex-col items-end gap-5 mt-4">
        <Link href={"/home"}>
          <Tooltip content="Home" placement="right">
            <HomeIcon />
          </Tooltip>
        </Link>

        <Tooltip content={"Search"} placement="right">
          <SearchIcon onClick={() => setOpen(!open)} />
        </Tooltip>

        <Link href={"/direct"}>
          <Tooltip content={"Inbox"} placement="right">
            <InboxIcon />
          </Tooltip>
        </Link>
        <Link href={"/new/community"}>
          <Tooltip content={"New"} placement="right">
            <PlusIcon />
          </Tooltip>
        </Link>
      </div>
      <div className="flex flex-col mb-4">
        {user ? (
          <Avatar
            alt={user.username}
            href={`/u/${user.id}`}
            imageSrc={user.avatarUrl}
          />
        ) : null}
      </div>
      <Modal isOpen={open} onRequestClose={() => setOpen(!open)}>
        <SearchBar defaultValue="" />
      </Modal>
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
