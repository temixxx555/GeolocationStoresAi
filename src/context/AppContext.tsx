"use client";
import { lookInSession } from "@/common/session";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define the shape of the user data
type UserAuthData = {
  access_token: string;
  profile_img?: string;
  username?: string;
  fullname?: string;
  state?: string;
};

// Define the shape of the full user auth object
type UserAuth = {
  success?: boolean;
  message?: string;
  data?: UserAuthData;
};

// Define the shape of the context
type AppContextType = {
  userAuth: UserAuth;
  setUserAuth: React.Dispatch<React.SetStateAction<UserAuth>>;
};

// Create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

// Provider component
export default function AppContextProvider({ children }: { children: ReactNode }) {
  const [userAuth, setUserAuth] = useState<UserAuth>({});

  useEffect(() => {
    // Only run on client-side to avoid SSR issues
    if (typeof window === "undefined") return;

    try {
      const userInSession = lookInSession("user");
      if (userInSession) {
        const parsedUser = JSON.parse(userInSession);
        setUserAuth(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing session data:", error);
    }
  }, []);

  const value = {
    userAuth,
    setUserAuth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}