import { apiClientWithAuth } from "@/lib/axios";
import { useEffect } from "react";
// import useAuth from "./useAuth";
import {
  $hasRunUseSessionHookStore,
  $isVerifyingAuthStore,
  $persistStore,
  $sessionStore,
  setHasRunUseSessionHookStore,
  setIsCheckingStore,
  setIsVerifyingAuthStore,
  setSession,
  setSessionError,
} from "../store/auth-atom";
import { usePathname, useRouter } from "next/navigation";
// import { persistStore } from "@/auth/stores/authStore";
import useAuth from "./useAuth";

const useSession = () => {
  console.log("🐸 Starting of  useSession() hook 🐸");
  // const [error, setError] = useState(true);

  // its for preventing calling useEffect twice after mount
  // const hasRunUseSessionHook = useRef(false);

  // ensures that fetchSession() doesn’t get called twice due to state updates during the verification process
  // const isVerifyingAuth = useRef(false);

  const { session, sessionError, isChecking, persist } = useAuth();
  // const { session, sessionError, isChecking } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // if (hasRunUseSessionHook.current || isVerifyingAuth.current) return;
    // if (hasRunUseSessionHook.current) return;
    // hasRunUseSessionHook.current = true;
    if ($hasRunUseSessionHookStore.get() || $isVerifyingAuthStore.get()) return;
    setHasRunUseSessionHookStore(true);
    /////////////////////////////////////////////////
    // Utility function
    /////////////////////////////////////////////////

    /////////////////////////////////////////////////
    const refreshToken = async () => {
      try {
        console.log(
          "Attempting to get new access token using refresh token..."
        );
        const refreshResponse = await apiClientWithAuth.get(
          "/auth/refreshtoken"
        );
        const newAccessToken = refreshResponse.data.accessToken;

        if ($sessionStore.get()?.token !== newAccessToken) {
          // if (authStore.get()?.token !== newAccessToken) {
          console.log("New Access token acquired:", newAccessToken);
          // setAuth({ ...authStore.get(), token: newAccessToken });
          setSession({ ...$sessionStore.get(), token: newAccessToken });
          // setSession({ ...sessionStore.get(), token: newAccessToken });
        }

        return newAccessToken;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        setSession({});
        setSessionError(error);
        router.push(`/auth/login?callback=${encodeURIComponent(pathname)}`);
        throw error;
      }
    };
    /////////////////////////////////////////////////

    /////////////////////////////////////////////////
    const fetchSession = async () => {
      // if (isVerifyingAuth.current) {
      if ($isVerifyingAuthStore.get()) {
        console.log("🦉 Alraedy verifying so skipped this fetch-session");
        return;
      }
      setIsVerifyingAuthStore(true);

      try {
        console.log("Fetching user session...");
        const sessionResponse = await apiClientWithAuth.get("/fetch-session");
        const sessionData = sessionResponse.data;

        console.log("Fetched session:", JSON.stringify(sessionData));
        setSession({
          token: $sessionStore.get()?.token,
          user: sessionData,
          // token: sessionStore.get()?.token,
          // user: sessionData.user,
        });
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setSession({});
        setSessionError(error);
        console.log("💅 Redirecting user to login...")
        router.push(`/auth/login?callback=${encodeURIComponent(pathname)}`);
      } finally {
        setIsVerifyingAuthStore(false);
        // isVerifyingAuth.current = false;
      }
    };
    /////////////////////////////////////////////////

    /////////////////////////////////////////////////
    const verifyAuth = async () => {
      console.log("🦜 Verifying authentication state...");

      if (!$sessionStore.get()?.token && $persistStore.get()) {
        // if (!sessionStore.get()?.token && persist) {
        try {
          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            await fetchSession();
          }
        } catch {
          console.log("Failed to refresh or fetch session, redirecting...");
        }
      } else if (!$sessionStore.get()?.token) {
        // } else if (!sessionStore.get()?.token) {
        console.log("No token found, redirecting to login...");
        router.push(`/auth/login?callback=${encodeURIComponent(pathname)}`);
      } else if (!$sessionStore.get()?.user) {
        // } else if (!sessionStore.get()?.user) {
        // ✅ If token exists but user data is missing, fetch session
        await fetchSession();
      }

      setIsCheckingStore(false);
      // setIsChecking(false);
    };
    /////////////////////////////////////////////////

    verifyAuth();
    // if (isChecking && !$sessionStore.get()?.user) {
    //   verifyAuth();
    // }

    return () => {
      // cleanup on unmount :)
      console.log("🧹 Cleaning up session check...");
      setHasRunUseSessionHookStore(false);
      setIsVerifyingAuthStore(false);
      // hasRunUseSessionHook.current = false;
      // isVerifyingAuth.current = false;
      // TODO:
      // Abort any pending requests
      setIsCheckingStore(false);
    };
    // });
  }, [router, pathname]);
  // }, [router, pathname, isChecking]);
  // }, [router, pathname, session, isChecking]);
  // }, [router, pathname, session, persist]);
  // }, [router, pathname, persist, setSession]);

  // return isChecking ? null : authStore.get(); // ✅ Return session data
  // });

  return { session: session, isChecking: isChecking, error: sessionError };
};

export default useSession;
