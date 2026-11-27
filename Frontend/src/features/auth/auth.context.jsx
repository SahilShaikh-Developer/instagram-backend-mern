import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const response = await getMe();
        if (!cancelled) {
          setuser(response.user);
        }
      } catch {
        // 401 is expected when logged out; leave user untouched
      } finally {
        if (!cancelled) {
          setAuthChecked(true);
        }
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setuser, loading, setloading, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
};
