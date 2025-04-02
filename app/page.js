// import Image from "next/image";
// "use client";

// import { persistStore } from "@/auth/stores/authStore";
// import { Button } from "@/components/shadcn/ui/button";
// import useAuth from "@/hooks/useAuth";

// import { authClient, useSession } from "@/lib/auth-client";


export default function Home() {
  // const { persist, setPersist } = useAuth();
  // const persist = useStore(persistStore);

  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col">
          <a
            className="p-10 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-3xl"
            // href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            href="/dashboard"
            // target="_blank"
            rel="noopener noreferrer"
          >
            Open Dashboard
          </a>

          {/* <Button
            type="submit"
            className="w-60 p-4 h-16"
            onClick={() => {
              setPersist(!persist);
              console.log("Persist value change(get): ", persistStore.get());
              console.log("Persist value change (store): ", persist);
            }}
          >
            Persist Toggle get ({JSON.stringify(persistStore.get())})
            <br/>
            Persist Toggle ({JSON.stringify(persist)})
          </Button> */}
        </div>
      </main>
    </div>
  );
}
