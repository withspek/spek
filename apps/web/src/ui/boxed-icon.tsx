const variantStyles = {
  circle: "rounded-full p-3",
  square: "rounded p-3",
};

interface BoxedIconProps {
  variant?: keyof typeof variantStyles;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const BoxedIcon: React.FC<BoxedIconProps> = ({
  variant = "square",
  children,
  onClick,
}) => {
  return (
    <div
      className={`bg-alabaster-950 text-white h-12 w-12 ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
