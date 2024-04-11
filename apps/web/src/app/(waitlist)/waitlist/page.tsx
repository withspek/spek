import { SearchIcon } from "@/icons";

export const WaitListHeader: React.FC = () => {
  return (
    <header className="flex gap-3 self-center mt-3 items-center border border-[#504F57] px-4 py-2 rounded-full">
      <p className="bg-[#F4F5F8] text-[#222326] rounded-full px-4 py-2">Home</p>
      <p>About</p>
      <p>Changelog</p>
    </header>
  );
};

export default function WaitlistPage() {
  return (
    <main className="flex h-full w-full flex-col">
      <WaitListHeader />
      <div className="flex flex-col flex-1 mt-10">
        <div className="flex justify-center flex-col text-center">
          <h1 className="text-[#F4F5F8] text-6xl text-balance">
            Join our waitlist
          </h1>
          <h1 className="text-[#F4F5F8] text-2xl text-balance">
            Real-time conversation with value
          </h1>
          <p className="text-[#888]">
            Meet the new standard for modern public community communication.
            Text chat, Threads, and Open source.
          </p>
        </div>
        <div className="flex flex-col items-center gap-5 justify-center mt-7 w-full">
          <div className="flex gap-3 border px-4 py-2 rounded-md border-[#504F57] w-1/2">
            <SearchIcon color="#504F57" />
            <input
              type="text"
              name="email"
              className="border-none outline-none bg-transparent"
              placeholder="Email address"
              autoComplete="off"
            />
          </div>
          <button
            type="button"
            className="bg-[#6EE7B7] px-4 py-2 text-[#222326] rounded-md"
          >
            Join waitlist
          </button>
        </div>
      </div>
      <div className="border-t border-r border-l px-3 py-4 rounded-t-lg border-[#504F57]">
        <h2 className="text-[#F4F5F8] ">Spek</h2>
      </div>
    </main>
  );
}
