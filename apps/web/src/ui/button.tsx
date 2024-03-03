import { HTMLAttributes } from "react";

const buttonColorStyles = {
  default: "bg-alabaster-500 text-white",
  primary: "bg-alabaster-950 text-alabaster-50",
};

const sizeStyles = {
  lg: "",
  md: "px-4 py-2 rounded w-56",
  sm: "",
  xs: "",
};

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  color?: keyof typeof buttonColorStyles;
  size?: keyof typeof sizeStyles;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  color = "default",
  size = "md",
  ...props
}) => {
  return (
    <button
      className={`flex justify-center items-center gap-4 ${buttonColorStyles[color]} ${sizeStyles[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
