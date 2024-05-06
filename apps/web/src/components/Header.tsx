"use client";

import { Tooltip } from "@spek/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useConn } from "@/hooks/useConn";
import {
  HomeIcon,
  InboxIcon,
  PlusIcon,
  SearchIcon,
  UserSharingIcon,
} from "@/icons";
import { Button } from "@/ui/button";
import { Modal } from "@/ui/modal";
import { SearchBar } from "./SearchBar";
import Link from "next/link";
import { ApiPreloadLink } from "./ApiPreloadLink";

export const Header: React.FC = () => {
  const { user } = useConn();
  const { push } = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex gap-4 justify-between py-3 w-full">
      <Tooltip content="Home">
        <Link href={`/home`}>
          <HomeIcon />
        </Link>
      </Tooltip>
      <Tooltip content="Inbox">
        <ApiPreloadLink route="directs">
          <InboxIcon />
        </ApiPreloadLink>
      </Tooltip>
      <Tooltip content="Search">
        <SearchIcon onClick={() => setOpen(!open)} />
      </Tooltip>
      {user ? (
        <>
          <Tooltip content="Profile">
            <ApiPreloadLink route="profile" data={{ id: user.id }}>
              <UserSharingIcon />
            </ApiPreloadLink>
          </Tooltip>
          <Tooltip content="Create">
            <Link href={`/new/community`}>
              <PlusIcon />
            </Link>
          </Tooltip>
        </>
      ) : (
        <>
          <Button
            size="sm"
            onClick={() => {
              push("/");
            }}
          >
            Login
          </Button>
        </>
      )}
      <Modal isOpen={open} onRequestClose={() => setOpen(!open)}>
        <SearchBar defaultValue="" />
      </Modal>
    </header>
  );
};
