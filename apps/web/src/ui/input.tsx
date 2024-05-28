import { forwardRef } from "react";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  rows?: number;
  textarea?: boolean;
  error?: string;
  transparent?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ textarea, error, transparent, className, ...props }, ref) => {
    const bg = transparent ? `bg-transparent` : `bg-primary-700`;
    const ring = error ? `ring-1 ring-primary-400` : "";
    const cn = `w-full py-2 px-4 rounded text-primary-300 placeholder-primary-900 focus:outline-none ${bg} ${ring} ${className} `;

    return textarea ? (
      <textarea ref={ref as any} className={cn} {...(props as any)} />
    ) : (
      <input ref={ref} className={cn} {...props} />
    );
  }
);

Input.displayName = "Input";
