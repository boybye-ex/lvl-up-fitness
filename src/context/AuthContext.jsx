import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import {
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const login = async () => {
    try {
      setAuthError(null);
      
      // Force browser to remember this login until explicit logout
      await setPersistence(auth, browserLocalPersistence);
      
      // Check if mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      console.log("Login attempt - isMobile:", isMobile);
      
      if (isMobile) {
        // Mobile: Use redirect (popups are blocked on most mobile browsers)
        console.log("Using redirect auth for mobile...");
        await signInWithRedirect(auth, googleProvider);
        // This won't return - page will redirect to Google
      } else {
        // Desktop: Use popup
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Login successful (popup):", result.user.uid);
        return result;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      setAuthError(error.message);
    }
  };

  useEffect(() => {
    // Handle redirect result for mobile auth
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Redirect login successful:", result.user.uid);
        }
      })
      .catch((error) => {
        console.error("Redirect result error:", error);
        setAuthError(error.message);
        setLoading(false); // Release UI on redirect error
      });

    // The Auth Observer - stays active and detects when Firebase confirms login
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          console.log("Auth Observer: User verified -", currentUser.uid);
        } else {
          console.log("Auth Observer: No user session");
        }
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        // Handle auth state observer errors
        console.error("Auth observer error:", error);
        setAuthError(error.message);
        setLoading(false); // ALWAYS release UI on error
      }
    );

    // SAFETY NET: If Firebase takes > 5 seconds, release the screen anyway
    const timeoutTimer = setTimeout(() => {
      if (loading) {
        console.warn("Auth timeout - releasing UI after 5 seconds");
        setLoading(false);
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeoutTimer);
    };
  }, []);

  const value = { 
    user, 
    login, 
    logout, 
    loading, 
    authError,
    isAuthenticated: !!user,
  };

  // Don't block render - let children handle loading state
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
