import { useEffect, useRef } from "react";
// import useAuth from "@/hooks/useAuth";
import { apiClientWithAuth } from "@/lib/axios";
// import { authStore } from "@/auth/stores/authStore";
import {
  $sessionStore,
  // sessionStore,
  setSession,
} from "@/own-auth-client/store/auth-atom";
// import useAuth from "@/own-auth-client/hooks/useAuth";

const useAxiosWithAuth = () => {
  const LOG_TITLE =
    "================\n🎀 useAxiosWithAuth Hooks\n================\n";

  // ✅ Logger with count tracking
  const createLogger = () => {
    let count = 0;
    return (msg) => {
      count++;
      console.log(LOG_TITLE, `${msg}\n----\ncount: ${count}`);
    };
  };
  const log = createLogger();

  // const { session, setSession } = useAuth();
  // const { auth, setAuth } = useAuth();
  // const { persist } = useAuth();
  const requestInterceptorRef = useRef(null);
  const responseInterceptorRef = useRef(null);

  // const auth = authStore.get();

  // ✅ Cleanup existing interceptors if they exist
  if (requestInterceptorRef.current !== null) {
    apiClientWithAuth.interceptors.request.eject(requestInterceptorRef.current);
  }
  if (responseInterceptorRef.current !== null) {
    apiClientWithAuth.interceptors.response.eject(
      responseInterceptorRef.current
    );
  }

  // ✅ Request Interceptor: Attach Access Token (Skip refresh token request)
  requestInterceptorRef.current = apiClientWithAuth.interceptors.request.use(
    (config) => {
      const token = $sessionStore.get()?.token;
      // const token = sessionStore.get()?.token;
      // const token = authStore.get()?.token;
      if (token && config.url !== "/auth/refreshtoken") {
        if (!config.headers.Authorization) {
          // log(`🔥 Bearer ${token}`);
        }
        log(`🔥 Bearer ${token}`);
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error(LOG_TITLE, "❌ Request Error:", error.message);
      return Promise.reject(error);
      // return Promise.reject(
      //   new Error(LOG_TITLE, "Session expired. Please log in again.")
      // );
    }
  );

  // ✅ Response Interceptor: Handle Token Expiry Gracefully
  responseInterceptorRef.current = apiClientWithAuth.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.warn(LOG_TITLE, "🔄 Token expired, attempting to refresh...");

        // ✅ Avoid retry loop for refresh token request
        if (error.config.url === "/auth/refreshtoken") {
          console.error(LOG_TITLE, "❌ Refresh token request failed");
          // setAuth({});
          setSession({});
          // setSession({});

          return Promise.reject(
            new Error("Session expired. Please log in again.")
          );
        }

        try {
          // ✅ Attempt to refresh token
          const refreshResponse = await apiClientWithAuth.get(
            "/auth/refreshtoken"
          );
          const newAccessToken = refreshResponse.data.accessToken;

          log(`✅ New token acquired: ${newAccessToken}`);

          // ✅ Update token in store (triggers reactive update)
          // This will trigger the event from useAuthHook
          // setAuth({ ...authStore.get(), token: newAccessToken });
          setSession({ ...$sessionStore.get(), token: newAccessToken });
          // setSession({ ...sessionStore.get(), token: newAccessToken });

          // ✅ Retry original request with new token
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log(LOG_TITLE, "Trying the request again with new token");
          return apiClientWithAuth(error.config);
        } catch (refreshError) {
          console.error(LOG_TITLE, "❌ Failed to refresh token:", refreshError);

          // ✅ Clear auth state on refresh failure
          setSession({});
          // setAuth({});

          return Promise.reject(
            new Error("Session expired. Please log in again.")
          );
        }
      } else if (error.response) {
        // ✅ Handle other HTTP errors gracefully
        console.error(
          LOG_TITLE,
          `❌ HTTP Error ${error.response.status}:`,
          error.response.data?.message || "Unknown error"
        );
        return Promise.reject(
          new Error(
            error.response.data?.message || "An unexpected error occurred"
          )
        );
      } else {
        // ✅ Handle network or other unknown errors
        console.error(LOG_TITLE, "❌ Network Error:", error.message);
        return Promise.reject(
          new Error("Network error. Please try again later.")
        );
      }
    }
  );

  useEffect(() => {
    // ✅ Cleanup on unmount (remove interceptors)
    return () => {
      if (requestInterceptorRef.current !== null) {
        apiClientWithAuth.interceptors.request.eject(
          requestInterceptorRef.current
        );
      }
      if (responseInterceptorRef.current !== null) {
        apiClientWithAuth.interceptors.response.eject(
          responseInterceptorRef.current
        );
      }
    };
  }, []); // ✅ Depend only on setAuth to avoid re-runs

  return apiClientWithAuth;
};

export default useAxiosWithAuth;
