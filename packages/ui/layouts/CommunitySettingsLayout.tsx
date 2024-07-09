"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface CommunitySettingsLayoutProps {
  children: React.ReactNode;
  communitySlug: string;
}

export const CommunitySettingsLayout: React.FC<
  CommunitySettingsLayoutProps
> = ({ children, communitySlug }) => {
  const pathname = usePathname();

  return (
    <div
      className="grid w-full h-full min-h-screen overflow-y-auto"
      style={{
        gridTemplateColumns: "minmax(60px, 400px) 760px",
        columnGap: 20,
      }}
    >
      <div className="flex justify-center sticky top-0 h-screen">
        <div className="pt-2">
          <p className="uppercase text-primary-400">Settings</p>
          <ul className="flex flex-col gap-2 mt-4 text-primary-200">
            <Link
              className={`${pathname == `/c/${communitySlug}/settings` ? "px-3 py-1 bg-primary-800 rounded-md" : ""}`}
              href={`/c/${communitySlug}/settings`}
            >
              <li>Overview</li>
            </Link>
            <Link
              className={`${pathname == `/c/${communitySlug}/settings/channels` ? "px-3 py-1 bg-primary-800 rounded-md" : ""}`}
              href={`/c/${communitySlug}/settings/channels`}
            >
              <li>Channels</li>
            </Link>
            <Link
              className={`${pathname == `/c/${communitySlug}/settings/members` ? "px-3 py-1 bg-primary-800 rounded-md" : ""}`}
              href={`/c/${communitySlug}/settings/members`}
            >
              <li>Members</li>
            </Link>
          </ul>
        </div>
      </div>
      {children}
    </div>
  );
};
