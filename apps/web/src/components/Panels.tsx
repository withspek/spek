"use client";
import { useConn } from "@/hooks/useConn";
import {
  HomeIcon,
  InboxIcon,
  NotificationIcon,
  PlusIcon,
  SearchIcon,
} from "@/icons";
import { Modal } from "@/ui/modal";
import { Avatar, Tooltip } from "@spek/ui";
import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { usePathname } from "next/navigation";

export const LeftPanel: React.FC = () => {
  const { user } = useConn();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between border-r border-primary-800 px-3">
      <div className="flex flex-col items-end gap-5 mt-4">
        <Link
          className={`${pathname == "/home" ? "text-accent" : ""}`}
          href={"/home"}
        >
          <Tooltip content="Home" placement="right">
            <HomeIcon />
          </Tooltip>
        </Link>

        <Tooltip content={"Search"} placement="right">
          <SearchIcon onClick={() => setOpen(!open)} />
        </Tooltip>

        <Link
          className={`${pathname == "/direct" ? "text-accent" : ""}`}
          href={"/direct"}
        >
          <Tooltip content={"Inbox"} placement="right">
            <InboxIcon />
          </Tooltip>
        </Link>

        <Link
          className={`${pathname == "/notifications" ? "text-accent" : ""}`}
          href={"/notifications"}
        >
          <Tooltip content={"Notifications"} placement="right">
            <NotificationIcon />
          </Tooltip>
        </Link>
        <Link
          className={`${pathname == "/new/community" ? "text-accent" : ""}`}
          href={"/new/community"}
        >
          <Tooltip content={"New"} placement="right">
            <PlusIcon />
          </Tooltip>
        </Link>
      </div>
      <div className="flex flex-col mb-4">
        {user ? (
          <Tooltip content="Profile" placement="right">
            <Avatar
              alt={user.username}
              href={`/u/${user.id}`}
              imageSrc={user.avatarUrl}
            />
          </Tooltip>
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
