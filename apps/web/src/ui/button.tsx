import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

const buttonColorStyles = {
  default: "bg-alabaster-500 text-white",
  primary: "bg-alabaster-950 text-alabaster-50",
};

const sizeStyles = {
  lg: "",
  md: "px-4 py-2 rounded w-56",
  sm: "px-3 py-2 rounded",
  xs: "",
};
export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: keyof typeof sizeStyles;
  color?: keyof typeof buttonColorStyles;
  loading?: boolean;
  icon?: React.ReactNode;
  transition?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  color = "default",
  size = "md",
  loading,
  ...props
}) => {
  return (
    <button
      disabled={loading}
      className={`flex justify-center items-center gap-4 ${buttonColorStyles[color]} ${sizeStyles[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
