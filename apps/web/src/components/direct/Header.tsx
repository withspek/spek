import Link from "next/link";
import { UserPreview } from "@spek/client";
import { useRouter } from "next/navigation";
import { Icon } from "@spek/ui";

import { useConn } from "@/hooks/useConn";

interface HeaderProps {
  conversationId?: string;
  recipients?: UserPreview[];
}

export const Header: React.FC<HeaderProps> = ({
  recipients,
  conversationId,
}) => {
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
      <Link href={`/direct/${conversationId}/info`}>
        <Icon name="info" className="cursor-pointer" />
      </Link>
    </div>
  );
};
