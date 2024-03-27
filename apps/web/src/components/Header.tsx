"use client";

import { useConn } from "@/hooks/useConn";
import {
  HomeIcon,
  InboxIcon,
  NotificationIcon,
  UserSharingIcon,
} from "@/icons";
import Link from "next/link";

export const Header: React.FC = () => {
  const { user } = useConn();

  return (
    <header className="flex gap-4 justify-between py-3 w-full">
      <Link href={`/home`}>
        <HomeIcon />
      </Link>
      <Link href={`/direct`}>
        <InboxIcon />
      </Link>
      <Link href={`/u/${user.id}`}>
        <UserSharingIcon />
      </Link>
      <Link href={`/u/${user.id}`}>
        <NotificationIcon />
      </Link>
    </header>
  );
};
