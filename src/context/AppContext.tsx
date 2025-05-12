// AppContext.tsx or similar
"use client";

import { lookInSession } from "@/common/session";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define the shape of the user
type UserAuth = {
  access_token?: string;
};

// Define the shape of the context
type AppContextType = {
  userAuth: UserAuth;
  setUserAuth: React.Dispatch<React.SetStateAction<UserAuth>>;
};

// Create the context with correct type
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
    try {
      const userInSession = lookInSession("user");
      if (userInSession) {
        setUserAuth(JSON.parse(userInSession));
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
