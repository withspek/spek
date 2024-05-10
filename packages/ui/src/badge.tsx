import cn from "./utils/classNames";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "max-w-fit rounded-full border px-2 py-px text-xs font-medium capitalize whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-primary-400 bg-primary-900 text-gray-500",
        primary: "border-primary-600 bg-primary-600 text-white",
        rainbow:
          "bg-gradient-to-r from-violet-600 to-pink-600 text-white border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
