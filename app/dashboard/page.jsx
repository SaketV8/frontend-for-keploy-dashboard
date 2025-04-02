"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { signIn } from "@/own-auth-client";
import useAuth from "@/own-auth-client/hooks/useAuth";
import useSession from "@/own-auth-client/hooks/useSession";
import {
  $persistStore,
  setPersist,
  setSession,
} from "@/own-auth-client/store/auth-atom";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import Link from "next/link";
import GithubProfileCard from "@/components/shadcn/GithubProfileCard";

export default function Dashboard() {
  const LOG_TITLE = "🦄 Dashboard\n";
  const [testData, setTestData] = useState(null);
  // const { persist } = useAuth();
  const { session, isChecking, error } = useSession();

  const apiClientWithAuth = useAxiosWithAuth();

  const router = useRouter();
  const pathname = usePathname();

  if (isChecking)
    return <p className="text-2xl font-bold p-6">Hold Tight, Its Loading...</p>;

  if (error)
    return (
      <p className="text-2xl font-bold p-6">
        Something went wrong {JSON.stringify(error)}{" "}
      </p>
    );

  const fetchTestData = async () => {
    try {
      const response = await apiClientWithAuth.get("/home");
      const data = response.data;
      setTestData(data);
      console.log(LOG_TITLE, { data });
    } catch (error) {
      console.error(LOG_TITLE, "ERROR fetching post:", error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await apiClientWithAuth.get("/auth/logout");
      // removing the saved access token
      setPersist(false);
      setSession({});
      router.push(`/auth/login?callback=${encodeURIComponent(pathname)}`);
      console.log("Logout started :)");
      console.log(LOG_TITLE, "LOGOUT DONE ☑️");
    } catch (error) {
      console.error(LOG_TITLE, "ERROR on logout:", error);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center  gap-6 bg-muted p-6 md:p-10">
      <h1 className=" mt-4 text-5xl font-bold">Dashboard</h1>
      <h1 className=" mt-4 text-xl font-bold text-slate-500">
        This is dev panel to check for internal api
      </h1>
      {/* <h1 className=" mt-4 text-[11px] font-base text-slate-600">
        Login Persist: {JSON.stringify(persist)}
      </h1> */}
      {/* <h1 className=" mt-4 text-[11px] font-base text-slate-600">
        Login Persist (get): {JSON.stringify(persist)}
      </h1> */}
      {session.user && <GithubProfileCard user={session.user} />}
      <Button type="submit" className="w-40" onClick={fetchTestData}>
        Check For API
      </Button>

      <Button type="submit" className="w-56">
        <Link href={"/github/dashboard"}>Go to Github Dashboard</Link>
      </Button>
      {/* <Button
        type="submit"
        className="w-40"
        onClick={() => {
          setPersist(!persist);
          console.log("Persist value change", $persistStore.get());
        }}
      >
        Persist Toggle
      </Button> */}
      {/* <Button
        type="submit"
        className="w-40"
        onClick={() => {
          console.log("started github oauth");
          signIn.oauth.github();
        }}
      >
        own-auth-client signIn
      </Button>
      <Button
        type="submit"
        className="w-40"
        onClick={() => {
          console.log("started email signIn");
          signIn.email("abc@gmail.com");
        }}
      >
        own-auth-client signIn email
      </Button> */}

      {/* <Button
        type="submit"
        className="w-40"
        onClick={() => {
          // console.log("started email signIn");
          // signIn.email("abc@gmail.com");
          setSession({ ...session, user: "Premchand" });
        }}
      >
        change user data
      </Button> */}

      {testData ? (
        <p className=" text-2xl text-slate-700">{JSON.stringify(testData)}</p>
      ) : (
        <p>No Test Data</p>
      )}
      <br />
      {/* <p className="p-4 text-blue-700 max-w-screen-md w-full min-h-20 border border-red-600 break-words overflow-auto">
        <span className="text-orange-800 font-bold">Auth state value: </span>
        {`${JSON.stringify(session)}`}
      </p> */}

      <Button
        type="submit"
        className=" mt-5 w-40 bg-red-500"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}
