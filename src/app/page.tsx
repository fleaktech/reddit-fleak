import Image from "next/image";
import { FleakForm } from "./fleakForm";

export default function Home() {
  return (
    <div className="grid grid-rows-[13rem_1fr_60px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="space-y-2">
        <div className="text-5xl flex flex-col items-center">
          <div className="flex items-start">
            Discover your
            <Image
              src="/reddit-logo.svg"
              alt="Reddit Logo"
              className="mx-2"
              width={56}
              height={56}
            />
          </div>
          reddit personality
        </div>
        <p className="flex justify-center items-center text-center">
          Type in reddit username that you are curious about. <br />
          See how others see you <br /> or get a glance of someone else&apos;s
          <br />
          reddit personality.
        </p>
      </div>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <FleakForm />
      </main>
      <footer className="flex row-start-3 space-x-1 border-surface-300 border p-4 rounded-md shadow-md">
        <div>Built with ❤️</div>
        <a className="flex" href="https://fleak.ai" target="_blank">
          using{" "}
          <Image
            src="/fleak-logo-title.svg"
            alt="Fleak Logo"
            className="ml-2"
            width={60}
            height={12}
            priority
          />
        </a>
      </footer>
    </div>
  );
}
