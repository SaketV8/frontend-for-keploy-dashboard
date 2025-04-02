import { atom } from "nanostores";

// Centralized auth state
// Inspired by better-auth :)

// similar to useState var
export const authStore = atom({});
export const persistStore = atom(
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("persist")) || false
    : false
);

// Session signal to notify subscribers
export const sessionSignalStore = atom(false);

// Update persist state in localStorage
// this will be triggered when persist value changes
persistStore.subscribe((value) => {
  // persist.subscribe((value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("persist", JSON.stringify(value));
  }
});
