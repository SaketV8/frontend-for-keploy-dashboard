import { useStore } from "@nanostores/react";
import {
  $sessionStore,
  $persistStore,
  $sessionErrorStore,
  $isCheckingStore,
  $hasRunUseSessionHookStore,
  $isVerifyingAuthStore,
} from "../store/auth-atom";

const useAuth = () => {
  //////////////////////////////////////////////////
  // These useStore can be used in jsx
  // as they are reactive
  //////////////////////////////////////////////////
  const session = useStore($sessionStore); // for saving session detail like token and user details
  const persist = useStore($persistStore); // for saving the login info even if the page reload, and user visit the page later
  const sessionError = useStore($sessionErrorStore); // as name suggest
  const isChecking = useStore($isCheckingStore); // for showing loading :)
  const hasRunUseSessionHook = useStore($hasRunUseSessionHookStore);
  const isVerifyingAuth = useStore($isVerifyingAuthStore);

  return {
    session,
    persist,
    sessionError,
    isChecking,
    hasRunUseSessionHook,
    isVerifyingAuth,
  };
};

export default useAuth;
