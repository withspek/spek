"use client";

import { useConn } from "@/hooks/useConn";
import {
  HomeIcon,
  InboxIcon,
  NotificationIcon,
  PlusIcon,
  UserSharingIcon,
} from "@/icons";
import { Button } from "@/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Header: React.FC = () => {
  const { user } = useConn();
  const { push } = useRouter();

  return (
    <header className="flex gap-4 justify-between py-3 w-full">
      <Link href={`/home`}>
        <HomeIcon />
      </Link>
      <Link href={`/direct`}>
        <InboxIcon />
      </Link>
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
    </header>
  );
};
