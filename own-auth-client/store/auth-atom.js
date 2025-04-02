import { atom } from "nanostores";

export const $sessionStore = atom({});
export const $sessionErrorStore = atom(null);
export const $isCheckingStore = atom(true); // used for showing loader
// export const $isCheckingStore = atom(false); // used for showing loader

///////////////////////////////////////////////////////
// TODO:
// export const $persistStore = atom(true);
export const $persistStore = atom(
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("persist")) || false
    : false
);
///////////////////////////////////////////////////////

// Session signal to notify subscribers
export const $sessionSignalStore = atom(false);

// export const $redirectToLoginSignalStore = atom(false);

export const $hasRunUseSessionHookStore = atom(false);
export const $isVerifyingAuthStore = atom(false);

///////////////////////////////////////////////////////
// Update persist state in localStorage
// this will be triggered when persist value changes
///////////////////////////////////////////////////////
// TODO:
$persistStore.subscribe((value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("persist", JSON.stringify(value));
  }
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
// Setter function for the var
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const setSession = (newSession) => {
  const currentSession = $sessionStore.get();
  // so that the we always set the new token
  // this setSession will trigger the sessionSignal
  // so we must change it carefully
  if (JSON.stringify(currentSession) !== JSON.stringify(newSession)) {
    // set is the method already defined in nanostore
    $sessionStore.set(newSession);
    // this will change the sessionSignalStore
    // which will trigger the subscribe method
    // defined over the sessionSignalStore
    // ex: sessionSignalStore.subscribe(()=> {})
    // sessionSignalStore.set(!sessionSignalStore.get());
  }
};
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const setPersist = (newPersist) => {
  $persistStore.set(newPersist);
};
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const setSessionError = (newSessionError) => {
  $sessionErrorStore.set(newSessionError);
};
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const setIsCheckingStore = (newIsCheckingStore) => {
  $isCheckingStore.set(newIsCheckingStore);
};
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const setHasRunUseSessionHookStore = (newHasRunUseSessionHookStore) => {
  $hasRunUseSessionHookStore.set(newHasRunUseSessionHookStore);
};
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const setIsVerifyingAuthStore = (newIsVerifyingAuthStore) => {
  $isVerifyingAuthStore.set(newIsVerifyingAuthStore);
};
///////////////////////////////////////////////////////
