"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "@spek/client";
import { Avatar, Icon, Tooltip } from "@spek/ui";

import { useConn } from "@/hooks/useConn";
import { Modal } from "@/ui/modal";
import { SearchBar } from "./SearchBar";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

export const LeftPanel: React.FC = () => {
  const { user } = useConn();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: any) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex flex-col justify-between border-r border-primary-800 px-3">
      <div className="flex flex-col items-end gap-5 mt-4">
        <Link
          className={`${pathname == "/home" ? "text-accent" : ""}`}
          href={"/home"}
        >
          <Tooltip content="Feed" placement="right">
            <Icon name="rss" />
          </Tooltip>
        </Link>

        <Link
          className={`${pathname == "/discover" ? "text-accent" : ""}`}
          href={"/discover"}
          prefetch={true}
        >
          <Tooltip content={"Discover"} placement="right">
            <Icon name="compass" />
          </Tooltip>
        </Link>

        <Link
          className={`relative ${pathname == "/notifications" ? "text-accent" : ""}`}
          href={`/notifications`}
        >
          <Tooltip content={"Notifcations"} placement="right">
            <Icon name="bell" />
          </Tooltip>
          {user && user.unread_notifications > 0 ? (
            <span className="absolute h-2 w-2 bg-accent rounded-full left-0 -top-1"></span>
          ) : null}
        </Link>

        <Link
          className={`${pathname == "/direct" ? "text-accent" : ""}`}
          href={"/direct"}
        >
          <Tooltip content={"Inbox"} placement="right">
            <Icon name="inbox" />
          </Tooltip>
        </Link>

        <Link
          className={`${pathname == "/new/community" ? "text-accent" : ""}`}
          href={"/new/community"}
        >
          <Tooltip content={"New"} placement="right">
            <Icon name="plus" />
          </Tooltip>
        </Link>
        {user ? <UserCommunitiesList user={user} /> : null}
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
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(!open)}
        variant="search"
      >
        <SearchBar defaultValue="" />
      </Modal>
    </div>
  );
};

const UserCommunitiesList: React.FC<{ user: User }> = () => {
  const { data, isLoading } = useTypeSafeQuery(["getUserCommunities", 0], {}, [
    0,
  ]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex items-end  gap-3 flex-col w-full">
      {data?.communities?.map((c) => (
        <Tooltip content={c.name} key={c.id} placement="right">
          <Link href={`/c/${c.slug}`}>
            <Image
              alt={c.name}
              src={`https://avatar.vercel.sh/${c.slug}?text=${c.name}&size=36`}
              className="h-9 w-9 rounded-lg"
              width={40}
              height={40}
            />
          </Link>
        </Tooltip>
      ))}
    </div>
  );
};
