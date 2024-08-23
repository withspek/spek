import React, { forwardRef, ReactElement } from "react";

export interface SearchOverlayProps {
  children: ReactElement;
  className?: string;
}

export const SearchOverlay = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative flex flex-col w-full rounded-md bg-primary-900 border border-primary-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

SearchOverlay.displayName = "SearchOverlay";
