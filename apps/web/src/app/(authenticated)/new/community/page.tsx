import { Metadata } from "next";
import { CreateCommunityForm } from "./form";

export const metadata: Metadata = {
  title: "New Community",
};

export default function NewCommunityPage() {
  return (
    <div className="flex w-full h-full flex-1 justify-center items-center">
      <div>
        <h2 className="text-xl font-bold">Create a new community</h2>
        <p className="text-primary-300">
          A community is a place for you to talk and share ideas as a whole
        </p>
        <CreateCommunityForm />
      </div>
    </div>
  );
}
