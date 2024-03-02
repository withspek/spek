import { HTMLAttributes } from "react";

const buttonColorStyles = {
  default: "bg-alabaster-500 text-white",
  primary: "",
};

const sizeStyles = {
  lg: "",
  md: "px-4 py-2 rounded",
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
      className={`flex justify-center items-center ${buttonColorStyles[color]} ${sizeStyles[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
