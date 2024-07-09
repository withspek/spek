import { Icon } from "@spek/ui";
import { useRouter } from "next/navigation";

interface HeaderProps {
  heading: string;
}

export const Header: React.FC<HeaderProps> = ({ heading }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between py-3 items-center">
      <h2>{heading}</h2>
      <div
        className="h-10 w-10 hover:bg-primary-800 hover:ring-2 cursor-pointer transition-all border border-primary-800 ring-primary-400 flex justify-center items-center rounded-full"
        onClick={() => router.back()}
      >
        <Icon name="plus" className="rotate-45" />
      </div>
    </div>
  );
};
