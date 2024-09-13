import Image from "next/image";
import { FleakForm } from "./fleakForm";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <FleakForm />
      </main>
      <footer className="row-start-3 space-y-2">
        <div className="flex items-center gap-2">
          Made with{" "}
          <a href="https://nextjs.org/" target="_blank">
            <div>
              <Image
                className="dark:invert"
                src="https://nextjs.org/icons/next.svg"
                alt="Next.js logo"
                width={50}
                height={38}
                priority
              />
            </div>
          </a>
          and ❤️
        </div>
        <div className="flex gap-2 items-center justify-center">
          by{" "}
          <a className="" href="https://fleak.ai" target="_blank">
            <Image
              src="/fleak-logo-title.svg"
              alt="Fleak Logo"
              className="bg-violet-500 rounded-md shadow-xl"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </footer>
    </div>
  );
}
