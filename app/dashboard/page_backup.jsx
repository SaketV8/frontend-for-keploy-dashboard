"use client";

import { useEffect, useState } from "react";
// import { apiClient } from "@/lib/axios";
import { Button } from "@/components/shadcn/ui/button";
import useAuth from "@/hooks/useAuth";
import useRequireAuth from "@/hooks/useRequireAuth";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { usePathname, useRouter } from "next/navigation";
import { persistStore } from "@/auth/stores/authStore";
import { signIn, useSession } from "@/own-auth-client";
// import { useSession } from "@/lib/auth-client";
// import { signIn } from "@/own-auth-client";
// import { signIn } from "@/own-auth-client/hooks/useSignIn";

export default function Dashboard() {
  const LOG_TITLE = "🦄 Dashboard\n";
  const [testData, setTestData] = useState(null);

  const { setAuth, persist, setPersist, getPersist } = useAuth();
  const auth = useRequireAuth(); // Ensures only authenticated users can access this page
  // const { auth } = useRequireAuth(); // Ensures only authenticated users can access this page
  const apiClientWithAuth = useAxiosWithAuth();

  const router = useRouter();
  const pathname = usePathname();

  ////////////////////////////////////////////
  // useEffect(() => {
  //   const { session } = useSession();
  //   console.log("Mounted");
  //   console.log("Session Data", JSON.stringify(session));
  //   console.log("Session Data", JSON.stringify(session.user));
  // }, []); // ✅ Logs only on initial render
  ////////////////////////////////////////////
  // ✅ Handle loading state
  if (!auth) {
    return <p className="text-2xl font-bold p-6">Hold Tight, Its Loading...</p>;
  }

  // console.log(LOG_TITLE, { persist });
  // console.log("In Dashboard", JSON.stringify(persist));

  const fetchTestData = async () => {
    try {
      const response = await apiClientWithAuth.get("/home");
      // const response = await apiClient.get("/test-api");
      const data = response.data;
      setTestData(data);
      // console.log(data);
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
      setAuth({});
      // setAuth(null);
      console.log("Logout started :)");
      router.push(`/auth/login?callback=${encodeURIComponent(pathname)}`);
      // console.log("Logout Done :)");
      console.log(LOG_TITLE, "LOGOUT DONE ☑️");
    } catch (error) {
      console.error(LOG_TITLE, "ERROR on logout:", error);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center  gap-6 bg-muted p-6 md:p-10">
      <h1 className=" mt-4 text-5xl font-bold">Dashboard</h1>
      <h1 className=" mt-4 text-[11px] font-base text-slate-600">
        Login Persist: {JSON.stringify(persist)}
      </h1>
      <h1 className=" mt-4 text-[11px] font-base text-slate-600">
        Login Persist (get): {JSON.stringify(persistStore.get())}
      </h1>
      <h1 className=" mt-4 text-[11px] font-base text-slate-600">
        Login Persist (getPersist): {JSON.stringify(getPersist)}
      </h1>

      <Button type="submit" className="w-40" onClick={fetchTestData}>
        Check For API
      </Button>
      <Button
        type="submit"
        className="w-40"
        onClick={() => {
          setPersist(!persist);
          console.log("Persist value change", persistStore.get());
        }}
      >
        Persist Toggle
      </Button>
      <Button
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
      </Button>

      {testData ? (
        <p className=" text-2xl text-slate-700">{JSON.stringify(testData)}</p>
      ) : (
        <p>No Test Data</p>
      )}
      <br />
      <p className="p-4 text-blue-700 max-w-screen-md w-full min-h-20 border border-red-600 break-words overflow-auto">
        <span className="text-orange-800 font-bold">Auth state value: </span>
        {`${JSON.stringify(auth)}`}
      </p>

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
