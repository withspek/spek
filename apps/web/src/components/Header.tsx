"use client";

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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchBar } from "./SearchBar";

export const Header: React.FC = () => {
  const { user } = useConn();
  const { push } = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex gap-4 justify-between py-3 w-full">
      <Link href={`/home`}>
        <HomeIcon />
      </Link>
      <Link href={`/direct`}>
        <InboxIcon />
      </Link>
      <button onClick={() => setOpen(!open)}>
        <SearchIcon />
      </button>
      {user ? (
        <>
          <Link href={`/u/${user.id}`}>
            <UserSharingIcon />
          </Link>
          <Link href={`/new/community`}>
            <PlusIcon />
          </Link>
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
