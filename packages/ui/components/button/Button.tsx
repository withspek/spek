import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { VariantProps, cva } from "class-variance-authority";

import { classNames } from "@spek/lib";

const buttonClasses = cva("rounded-md flex gap-2 items-center", {
  variants: {
    color: {
      primary: [
        "bg-primary-900",
        "text-primary-100",
        "hover:bg-primary-800 disabled:bg-primary-700",
        "focus:ring-2 focus:ring-primary-600",
      ],
      secondary: [
        "bg-transparent hover:bg-primary-100",
        "text-primary-100",
        "focus:ring-2",
        "focus:ring-primary-600",
      ],
      minimal: ["bg-transparent", "text-primary-200 hover:text-primary-900"],
      destructive: ["bg-transparent", "text-red-600"],
    },
    size: {
      small: ["text-sm", "py-1", "px-2"],
      medium: ["text-base", "py-2", "px-4"],
      large: ["text-base", "py-4", "px-8"],
    },
  },
  defaultVariants: {
    color: "primary",
    size: "medium",
  },
});

type InferredVariantProps = VariantProps<typeof buttonClasses>;

export type ButtonBaseProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type ButtonColor = NonNullable<InferredVariantProps["color"]>;
type ButtonSize = NonNullable<InferredVariantProps["size"]>;

export type ButtonProps = ButtonBaseProps & {
  size?: ButtonSize;
  color?: ButtonColor;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  transition?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  color = "primary",
  size = "medium",
  endIcon,
  startIcon,
  loading,
  ...props
}) => {
  return (
    <button
      disabled={loading}
      className={classNames(buttonClasses({ color }))}
      {...props}
    >
      {startIcon ? <span>{startIcon}</span> : null}
      {children}
      {endIcon ? <span>{endIcon}</span> : null}
    </button>
  );
};
