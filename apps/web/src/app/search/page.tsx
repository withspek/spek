import { Header } from "@/components/Header";
import { Metadata } from "next";
import { SearchPageController } from "./controller";

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
    <>
      <SearchPageController query={searchParams.query} />
    </>
  );
}
