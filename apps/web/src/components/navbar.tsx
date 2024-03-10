import { CompassIcon, HomeIcon, InfinityIcon } from "@/icons";
import { BoxedIcon } from "@/ui/boxed-icon";
import React from "react";

export const Navbar: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col gap-4 px-2 py-3 items-end">
      <BoxedIcon>
        <InfinityIcon />
      </BoxedIcon>
      <BoxedIcon>
        <HomeIcon />
      </BoxedIcon>
    </div>
  );
};
