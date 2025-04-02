"use client";

import { auth, persist, sessionSignal } from "@/auth/stores/authStore";
import { createContext } from "react";

const AuthContext = createContext({});

// for wrapping at layout.jsx instead of <AuthContext.Provider>
export const AuthProvider = ({ children }) => {
  // 🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧
  // this all useEffect will handled by nanostore :)

  // const [auth, setAuth] = useState({});

  // for using using refresh token if no access token found
  // const [persist, setPersist] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     return JSON.parse(localStorage.getItem("persist")) || false;
  //   }
  //   return false;
  // });

  /*
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("persist");
      setPersist(storedValue ? JSON.parse(storedValue) : persist);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("persist", JSON.stringify(persist));
    }
  }, [persist]);
  */

  return (
    <AuthContext.Provider value={{ auth, persist, sessionSignal }}>
      {/* <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}> */}
      {children}
    </AuthContext.Provider>
  );
};

// exporting it to use in useAuth hook
export default AuthContext;
