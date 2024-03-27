import React from "react";

import { Avatar } from "./avatar";

export interface AvatarProps {
  srcArray: string[];
  className?: string;
}

export const AvatarGroup: React.FC<AvatarProps> = ({
  srcArray,
  className = "",
}) => {
  return (
    <div className={`flex ${className}`}>
      {srcArray.slice(0, 3).map((s, i) => (
        <span
          key={s + i}
          className="rounded-full bg-primary-800 border-alabaster-950 shadow-sm"
          style={{
            zIndex: srcArray.length - i,
            marginLeft: i > 0 ? -5 : 0,
            height: 20,
            width: 20,
            overflow: "hidden",
          }}
        >
          <Avatar src={s} size="xs" />
        </span>
      ))}
    </div>
  );
};
