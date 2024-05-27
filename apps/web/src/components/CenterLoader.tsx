import { Spinner } from "@spek/ui";

export const CenterLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <Spinner className="h-6 w-6 text-primary-100" />
    </div>
  );
};
