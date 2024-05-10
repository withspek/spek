import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import React from "react";

import classNames from "./utils/classNames";

import Icon from "./icon/Icon";
import type { IconName } from "./icon/dynamicIconImports";

export const badgeStyles = cva(
  "font-medium inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-accent",
        success: "",
        secondary: "",
      },
      size: {
        sm: "px-1 py-0.5 text-xs leading-3",
        md: "py-1 px-1.5 text-xs leading-3",
        lg: "py-1 px-2 text-sm leading-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type InferredBadgeStyles = VariantProps<typeof badgeStyles>;

type IconOrDot =
  | {
      startIcon?: IconName;
      withDot?: never;
    }
  | {
      startIcon?: never;
      withDot?: true;
    };

export type BadgeBaseProps = InferredBadgeStyles & {
  children: React.ReactNode;
  rounded?: boolean;
  customStartIcon?: React.ReactNode;
} & IconOrDot;

export type BadgeProps =
  /**
   * This union type helps TypeScript understand that there's two options for this component:
   * Either it's a div element on which the onClick prop is not allowed, or it's a button element
   * on which the onClick prop is required. This is because the onClick prop is used to determine
   * whether the component should be a button or a div.
   */
  | (BadgeBaseProps &
      Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> & {
        onClick?: never;
      })
  | (BadgeBaseProps &
      Omit<React.HTMLAttributes<HTMLButtonElement>, "onClick"> & {
        onClick: () => void;
      });

export const Badge = function Badge(props: BadgeProps) {
  const {
    customStartIcon,
    variant,
    className,
    size,
    startIcon,
    withDot,
    children,
    rounded,
    ...passThroghProps
  } = props;

  const isButton =
    "onClick" in passThroghProps && passThroghProps.onClick !== undefined;
  const StartIcon = startIcon;

  const classes = classNames(
    badgeStyles({ variant, size }),
    rounded && "h-5 w-5 rounded-full p-0",
    className
  );

  const Children = () => (
    <>
      {withDot ? <Icon name="dot" className="h-3 w-3 stroke-[3px]" /> : null}
      {customStartIcon ||
        (StartIcon ? (
          <Icon name={startIcon} className="h-3 w-3 stroke-[3px]" />
        ) : null)}

      {children}
    </>
  );

  const Wrapper = isButton ? "button" : "div";

  return React.createElement(
    Wrapper,
    {
      ...passThroghProps,
      className: classes,
    },
    <Children />
  );
};
