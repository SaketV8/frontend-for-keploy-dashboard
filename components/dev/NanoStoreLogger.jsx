"use client";

import {
  $sessionStore,
  $persistStore,
  $sessionErrorStore,
  $isCheckingStore,
  $sessionSignalStore,
  $hasRunUseSessionHookStore,
  $isVerifyingAuthStore,
} from "@/own-auth-client/store/auth-atom";
import { logger } from "@nanostores/logger";
import { useEffect } from "react";

const NanoStoreLogger = () => {
  const nanoStoreAtom = {
    $sessionStore,
    $persistStore,
    $sessionErrorStore,
    $isCheckingStore,
    $sessionSignalStore,
    $hasRunUseSessionHookStore,
    $isVerifyingAuthStore,
  };
  useEffect(() => {
    // when this component mount
    const destroy = logger(nanoStoreAtom);
    return () => {
      // Cleanup on unmount, its built-in useEffect
      console.log("Destroying the Nanostore Logger on unmount");
      destroy();
    };
  }, []);

  return <></>;
};

export default NanoStoreLogger;
