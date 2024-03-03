import { CompassIcon, InfinityIcon } from "@/icons";
import { BoxedIcon } from "@/ui/boxed-icon";
import React from "react";

export const Navbar: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 px-2 py-3 grow-[1] w-80 items-end">
      <BoxedIcon>
        <InfinityIcon />
      </BoxedIcon>
      <BoxedIcon>
        <CompassIcon />
      </BoxedIcon>
    </div>
  );
};
