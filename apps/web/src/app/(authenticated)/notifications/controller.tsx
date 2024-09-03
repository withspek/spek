"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { Icon } from "@spek/ui";
import { classNames } from "@spek/lib";
import { formatDistance } from "date-fns";

import { CenterLoader } from "@/components/CenterLoader";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import WebSocketContext from "@/contexts/WebSocketContext";

interface Props {}

export const NotificationsController: React.FC<Props> = () => {
  const { data, isLoading } = useTypeSafeQuery("getUserNotifications");
  const { conn, setUser } = useContext(WebSocketContext);
  const { mutateAsync: markAsRead } = useTypeSafeMutation(
    "markNotificationAsRead"
  );

  if (isLoading) {
    return <CenterLoader />;
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="py-2">Notifications</h2>
      {data?.notifications.map((no) =>
        no.type === 1 ? (
          <Link
            href={`/direct/${no.parent_id}`}
            key={no.id}
            className={classNames(
              "flex items-start gap-4 px-4 py-2 rounded-md",
              !no.read
                ? "bg-primary-900 border border-primary-700"
                : "bg-transparent"
            )}
            onClick={async () => {
              if (conn && !no.read) {
                setUser({
                  ...conn.user,
                  unread_notifications: conn.user.unread_notifications - 1,
                });

                await markAsRead([no.id]);
              }
            }}
          >
            <Icon name="mail-plus" />
            <div className="flex flex-col">
              <p>{no.message}</p>
              <p className="text-primary-300 text-sm">
                {formatDistance(no.inserted_at, new Date())}
              </p>
            </div>
          </Link>
        ) : null
      )}
      {data?.notifications.length! < 1 && (
        <div className="flex my-4 justify-center items-center">
          <p>Sorry but you have any empty inbox 😔</p>
        </div>
      )}
    </div>
  );
};
