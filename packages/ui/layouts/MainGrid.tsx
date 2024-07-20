import { useMediaQuery } from "../hooks";

interface DashboardGridProps {
  className?: string;
  children?: React.ReactNode;
}

export const MainInnerGrid: React.FC<DashboardGridProps> = ({
  children,
  className = "",
}) => {
  const { device } = useMediaQuery();

  let gridTemplateColumns = "200px 760px 300px";
  let myClassName = ``;

  if (device === "tablet") {
    gridTemplateColumns = "60px 640px 325px";
  } else if (device === "mobile") {
    myClassName = "w-full px-3";
    gridTemplateColumns = "1fr";
  }

  return (
    <div
      id="main"
      className={`relative ${myClassName} ${className}`}
      style={{
        display: device === "mobile" ? "flex" : "grid",
        gridTemplateColumns,
        columnGap: 60,
      }}
    >
      {children}
    </div>
  );
};

export const MainGrid: React.FC<DashboardGridProps> = ({ children }) => {
  return (
    <div
      className={`flex justify-center w-full min-h-screen bg-primary-950`}
      data-testid="main-grid"
    >
      <MainInnerGrid>{children}</MainInnerGrid>
    </div>
  );
};
