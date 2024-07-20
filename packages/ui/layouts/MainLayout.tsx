"use client";

import React from "react";
import { useMediaQuery } from "../hooks";
import { MainInnerGrid } from "./MainGrid";

interface MainLayoutProps {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  topPanel?: React.ReactNode;
}

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex justify-center sticky top-0 h-screen">{children}</div>
  );
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  leftPanel = <div />,
  rightPanel = <div />,
}) => {
  const { device } = useMediaQuery();

  let middle = null;

  switch (device) {
    case "desktop":
      middle = (
        <>
          <Panel>{leftPanel}</Panel>
          {children}
          <Panel>{rightPanel}</Panel>
        </>
      );
      break;
    case "tablet":
      middle = (
        <>
          {leftPanel}
          {children}
        </>
      );
      break;
    case "mobile":
      middle = <>{children}</>;
      break;
  }
  return (
    <div
      className={`flex flex-col items-center w-full scrollbar-thin scrollbar-thumb-primary-700`}
    >
      <MainInnerGrid>{middle}</MainInnerGrid>
    </div>
  );
};
