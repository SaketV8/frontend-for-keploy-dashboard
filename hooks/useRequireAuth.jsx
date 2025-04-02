// import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import useAuth from "@/hooks/useAuth";
// import { apiClientWithAuth } from "@/lib/axios";
// import { authStore, sessionSignalStore } from "@/auth/stores/authStore";
// // import { useStore } from "@nanostores/react";
// // import { auth, persist } from "@/auth/stores/authStore";

// const useRequireAuth = () => {
//   const LOG_TITLE =
//     "================\n 🦉 useRequireAuth Hooks\n================\n";
//   const { setAuth, persist } = useAuth();
//   // const { auth, setAuth, persist } = useAuth();
//   const auth = authStore.get();
//   const router = useRouter();
//   const pathname = usePathname();

//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     const verifyAuth = async () => {
//       // if (!auth?.token && persist) {
//       const auth = authStore.get();
//       console.log(LOG_TITLE, "Token (get direct):\n", JSON.stringify(auth));
//       if (!auth?.token && persist) {
//         try {
//           // console.log(
//           //   "Attempting to get new access token using refresh token..."
//           // );
//           console.log(
//             LOG_TITLE,
//             "Attempting to get new access token using refresh token..."
//           );
//           const refreshResponse = await apiClientWithAuth.get(
//             "/auth/refreshtoken"
//           );

//           const newAccessToken = refreshResponse.data.accessToken;
//           // setAuth((auth) => ({ ...auth, token: newAccessToken }));
//           // setAuth((auth) => {
//           //   const updatedToken = { ...auth, token: newAccessToken };
//           //   setSessionSignal(!sessionSignal);
//           //   return updatedToken;
//           // });
//           // ((auth) => ({ ...auth, token: newAccessToken }));
//           // console.log("Token refreshed successfully!", getAuth()?.token);
//           // console.log("Token refreshed successfully!", auth.token);
//           if (auth?.token !== newAccessToken) {
//             setAuth({ ...authStore.get(), token: newAccessToken });
//             // console.log("New Access token aquired !!!");
//             console.log(LOG_TITLE, "New Access token aquired !!!");
//           }
//         } catch (error) {
//           console.error(LOG_TITLE, "Failed to refresh token:", error);
//           // setAuth(null);
//           setAuth({});
//           router.push(`/auth/login?callback=${encodeURIComponent(pathname)}`);
//         }
//         // } else if (!auth?.token) {
//       } else if (!auth?.token) {
//         console.log(LOG_TITLE, "No auth token, redirecting to login...");
//         router.push(`/auth/login?callback=${encodeURIComponent(pathname)}`);
//       }

//       setIsChecking(false);
//     };
//     // verifyAuth();

//     // ✅ Use subscribe() instead of dependency array
//     const unsubscribe = sessionSignalStore.subscribe(() => {
//       console.log(LOG_TITLE, "🔄 sessionSignal changed, running verifyAuth...");
//       // verifyAuth(); // ✅ Trigger state check only when the signal changes
//       if (!authStore.get()?.token) {
//         console.log(LOG_TITLE, "🔄 verifyAuth...");
//         verifyAuth(); // ✅ Trigger state check only when necessary
//       }
//     });

//     verifyAuth(); // ✅ Initial check

//     return () => unsubscribe(); // ✅ Cleanup on unmount
//   }, [router, pathname]);
//   // }, [router, pathname, persist]);
//   // }, [router, pathname, persist]);
//   // }, [router, pathname, persist]);
//   // }, [sessionSignal.get(), router, pathname, persist]);
//   // }, [auth, setAuth, router, pathname, persist]);

//   // return auth;
//   // return isChecking ? null : auth;
//   return isChecking ? null : auth;
// };

// export default useRequireAuth;

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { apiClientWithAuth } from "@/lib/axios";
import { authStore, sessionSignalStore } from "@/auth/stores/authStore";

const useRequireAuth = () => {
  const LOG_TITLE =
    "================\n 🦉 useRequireAuth Hooks\n================\n";

  const { setAuth, persist } = useAuth();
  const auth = authStore.get();
  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);

  // ✅ To skip the first signal update after mount
  const isInitialSignal = useRef(true);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const verifyAuth = async () => {
      console.log(
        LOG_TITLE,
        "Token (get direct):\n",
        JSON.stringify(authStore.get())
      );

      if (!authStore.get()?.token && persist) {
        try {
          console.log(
            LOG_TITLE,
            "Attempting to get new access token using refresh token..."
          );
          const refreshResponse = await apiClientWithAuth.get(
            "/auth/refreshtoken"
          );
          const newAccessToken = refreshResponse.data.accessToken;

          if (authStore.get()?.token !== newAccessToken) {
            setAuth({ ...authStore.get(), token: newAccessToken });
            console.log(LOG_TITLE, "New Access token acquired !!!", {
              newAccessToken,
            });
          }
        } catch (error) {
          console.error(LOG_TITLE, "Failed to refresh token:", error);
          setAuth({});
          router.push(`/auth/login?callback=${encodeURIComponent(pathname)}`);
        }
      } else if (!authStore.get()?.token) {
        console.log(LOG_TITLE, "No auth token, redirecting to login...");
        router.push(`/auth/login?callback=${encodeURIComponent(pathname)}`);
      }

      setIsChecking(false);
    };

    // ✅ Handle sessionSignal changes
    const unsubscribe = sessionSignalStore.subscribe(() => {
      // we are checking this because subscribe will run once just after the nanostore mount
      if (isInitialSignal.current) {
        // ✅ Skip the first signal update
        isInitialSignal.current = false;
        return;
      }

      console.log(LOG_TITLE, "🔄 sessionSignal changed, running verifyAuth...");
      if (!authStore.get()?.token) {
        console.log(LOG_TITLE, "🔄 verifyAuth...");
        verifyAuth();
      }
    });

    verifyAuth(); // ✅ Initial check on mount

    return () => {
      unsubscribe(); // ✅ Cleanup on unmount
      hasRun.current = false;
      isInitialSignal.current = true; // ✅ Reset after unmount
    };
  }, [router, pathname, persist]);

  return isChecking ? null : auth;
};

export default useRequireAuth;
