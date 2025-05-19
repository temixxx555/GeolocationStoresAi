"use client";

import { removeFromSession } from "@/common/session";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { userAuth, setUserAuth } = useAppContext();
  const router = useRouter();
  
  // Safely access username if it exists
  const username = userAuth?.data?.username;
  
  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({}); // Reset the entire auth state
    router.push("/signin"); // Redirect to sign-in page after logout
  };

  // If no access token, user is not logged in
  if (!userAuth?.data?.access_token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
        <button 
          onClick={() => router.push("/signin")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {username || "User"}</h1>
        <button 
          onClick={signOutUser}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
      
      {/* Your home page content goes here */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-md p-6">
        <p className="text-gray-700">You are successfully logged in! @{username}</p>
      </div>
    </div>
  );
}