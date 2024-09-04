import { format } from "date-fns";
import { useMemo } from "react";
import { UserAvatar } from "@spek/ui";
import { LodgeMessage } from "@spek/client";

import { markdown } from "@/utils/markdown";

interface Props {
  message: LodgeMessage;
}

export const Message: React.FC<Props> = ({ message }) => {
  const dt = useMemo(
    () => new Date(message.inserted_at),
    [message.inserted_at]
  );

  return (
    <div className={`flex flex-1 items-start px-3 rounded-md py-4 gap-3`}>
      <UserAvatar
        user={{
          avatarUrl: message.user.avatarUrl,
          displayName: message.user.displayName,
          username: message.user.username,
        }}
        size={"md"}
        alt={message.user.displayName}
      />
      <div className="flex flex-col gap-1">
        <p className="font-bold text-sm">
          {message.user.displayName}
          <span className="font-normal ml-3 text-sm">
            {format(dt, "MMM dd HH:mm")}
          </span>
        </p>
        {markdown(message.text)}
      </div>
    </div>
  );
};
