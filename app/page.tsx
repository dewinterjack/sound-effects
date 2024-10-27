import AudioEditor from "@/components/AudioEditor";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 ">
        <AudioEditor />
      </main>
    </div>
  );
}
