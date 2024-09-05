"use client";

import { useMediaQuery } from "@spek/ui";

export const MaintainceMode: React.FC = () => {
  const { isMobile } = useMediaQuery();

  return (
    <>
      {isMobile && (
        <div className="absolute w-full h-full flex flex-col justify-center items-center bg-primary-800 z-50">
          <p className="text-3xl">😓😓</p>
          <p className="text-xl text-center px-3">
            The mobile version of spek is still underdevelopment but you can use
            a Laptop...
          </p>
        </div>
      )}
    </>
  );
};
