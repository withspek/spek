import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
  topPanel?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  leftPanel = <div />,
}) => {
  return (
    <div
      className="grid w-full h-full justify-center"
      style={{ gridTemplateColumns: "minmax(60px, 200px) 760px 300px" }}
    >
      <div className="flex bg-primary-50 justify-center">{leftPanel}</div>
      {children}
    </div>
  );
};
