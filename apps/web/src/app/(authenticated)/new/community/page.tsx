import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Community",
};

export default function NewCommunityPage() {
  return (
    <div className="flex w-full h-full flex-1 justify-center items-center">
      <div>
        <h2 className="text-xl font-bold">Create a new community</h2>
        <p>A community is a place for you to talk and share ideas as a whole</p>
      </div>
    </div>
  );
}
