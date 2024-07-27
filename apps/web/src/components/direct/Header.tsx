import { UserPreview } from "@spek/client";
import { useRouter } from "next/navigation";
import { Icon } from "@spek/ui";

import { useConn } from "@/hooks/useConn";

interface HeaderProps {
  recipients?: UserPreview[];
}

export const Header: React.FC<HeaderProps> = ({ recipients }) => {
  const { user } = useConn();
  const router = useRouter();

  return (
    <div className="flex justify-between items-center bg-primary-950 z-50 sticky top-0 py-3">
      <div className="flex gap-8 items-center">
        <Icon
          name="arrow-left"
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <p className="font-bold">
          {recipients
            ?.filter((p) => user.id !== p.id)
            .map((p) => p.displayName)
            .join(", ")}
        </p>
      </div>
      <Icon name="info" className="cursor-pointer" />
    </div>
  );
};
