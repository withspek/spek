import { Metadata } from "next";
import { SearchPageController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";

type Props = {
  searchParams: { query: string };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: searchParams.query,
  };
}

export default function SearchPage({ searchParams }: Props) {
  return (
    <MainLayout leftPanel={<LeftPanel />}>
      <SearchPageController query={searchParams.query} />
      <div />
    </MainLayout>
  );
}
