import { Icon } from "@spek/ui";
import Link from "next/link";

interface HeaderProps {
  heading: string;
  communitySlug: string;
}

export const Header: React.FC<HeaderProps> = ({ heading, communitySlug }) => {
  return (
    <div className="flex justify-between py-3 items-center">
      <h2>{heading}</h2>
      <Link
        className="h-10 w-10 hover:bg-primary-800 hover:ring-2 cursor-pointer transition-all border border-primary-800 ring-primary-400 flex justify-center items-center rounded-full"
        href={`/c/${communitySlug}`}
      >
        <Icon name="plus" className="rotate-45" />
      </Link>
    </div>
  );
};
