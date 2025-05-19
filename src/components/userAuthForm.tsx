/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import InputBox from "@/components/InputBox";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MapPin, Globe, ShoppingBag } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { storeInSession } from "@/common/session";
import axios from "axios";

interface AuthProps {
  type: "sign-in" | "sign-up";
}

interface FeatureIconProps {
  icon: React.ReactNode;
  title?: string;
}

export default function UserAuth({ type }: AuthProps) {
  const [loading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const { userAuth, setUserAuth } = useAppContext();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate getting geolocation
    setTimeout(() => {
      setCurrentLocation("Nigeria, NG");
    }, 1000);
  }, []);

  useEffect(() => {
    // Check if user is already authenticated
    if (userAuth.data?.access_token) {
      router.push("/");
    }
  }, [userAuth.data?.access_token, router]);

  const userAuthThroughServer = async (
    serverRoute: string,
    formData: Record<string, unknown>
  ) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/api${serverRoute}`, formData);

      if (data.success) {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
        
        toast.success(data.message || "Authentication successful!");
        router.push("/"); 
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFunction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; 

    const serverRoute = type === "sign-in" ? "/signin" : "/signup";
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (formRef.current) {
      const form = new FormData(formRef.current);
      const formData: Record<string, any> = {};

      for (const [key, value] of form.entries()) {
        formData[key] = value;
      }

      const { fullname, state, password, email } = formData;

      if (type === "sign-up") {
        const trimmedFullname = fullname?.trim();
        const trimmedState = state?.trim();

        if (
          !trimmedFullname ||
          trimmedFullname.length < 3 ||
          trimmedFullname.length > 20
        ) {
          return toast.error("Fullname must be 3–20 characters long");
        }
        if (
          !trimmedState ||
          trimmedState.length < 5 ||
          trimmedState.length > 20
        ) {
          return toast.error("State must be 5–20 characters long");
        }
        formData.fullname = trimmedFullname;
        formData.state = trimmedState;
      }

      if (!email) {
        return toast.error("Email is required");
      }
      if (!emailRegex.test(email)) {
        return toast.error("Email is invalid");
      }
      if (!password) {
        return toast.error("Password is required");
      }
      if (!passwordRegex.test(password)) {
        return toast.error(
          "Password must be 6–20 characters with a number, one lowercase, and one uppercase letter"
        );
      }

      await userAuthThroughServer(serverRoute, formData);
    }
  };

  const handleGoogleAuth = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Placeholder for Google auth
    toast.error("Google authentication not implemented yet");
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-purple-50'>
      <main className='flex-1 flex items-center justify-center p-4'>
        <div
          className={`w-full max-w-md ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } transition-all duration-700 ease-out`}
        >
          <div className='flex items-center justify-center mb-5 gap-2 text-sm text-indigo-600'>
            <MapPin className='h-4 w-4' />
            {currentLocation ? currentLocation : "Detecting your location..."}
          </div>
          <div className='bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/70 overflow-hidden'>
            <div className='h-3 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-size-200'></div>
            <div className='p-8'>
              <div className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-gray-900'>
                  {type === "sign-in" ? "Welcome Back" : "Join Locify"}
                </h1>
                <p className='mt-2 text-gray-600'>
                  {type === "sign-in"
                    ? "Sign in to discover local products and stories"
                    : "Create an account to connect with local businesses"}
                </p>
              </div>
              <form
                ref={formRef}
                id='formElement'
                onSubmit={handleSubmitFunction}
                className='space-y-5'
              >
                {type === "sign-up" && (
                  <div className='space-y-5'>
                    <InputBox
                      name='fullname'
                      type='text'
                      placeholder='Full Name'
                      icon='fi fi-rr-user'
                    />
                    <div className='flex gap-4'>
                      <div className='w-full'>
                        <label className='text-xs font-medium text-gray-600 mb-1 block'>
                          State
                        </label>
                        <div className='relative'>
                          <input
                            name='state'
                            type='text'
                            placeholder='State'
                            className='w-full bg-gray-50 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-200'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className='text-xs font-medium text-gray-600 mb-1 block'>
                    Email
                  </label>
                  <div className='relative'>
                    <input
                      name='email'
                      type='email'
                      placeholder='name@example.com'
                      className='w-full bg-gray-50 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-200'
                    />
                  </div>
                </div>
                <div>
                  <label className='text-xs font-medium text-gray-600 mb-1 block'>
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      name='password'
                      type={showPassword ? "text" : "password"}
                      placeholder='At least 8 characters'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='w-full bg-gray-50 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-200'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-2.5 text-gray-500 hover:text-gray-700'
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5' />
                      ) : (
                        <Eye className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                </div>
                {type === "sign-in" && (
                  <div className='flex items-center justify-between'>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className='rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4'
                      />
                      <span className='ml-2 text-sm text-gray-600'>
                        Remember me
                      </span>
                    </label>
                    <Link
                      href='/forgot-password'
                      className='text-sm font-medium text-indigo-600 hover:text-indigo-800'
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-3 text-base font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center'
                >
                  {loading ? (
                    <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                  ) : null}
                  {loading
                    ? "Processing..."
                    : type === "sign-in"
                    ? "Sign In"
                    : "Create Account"}
                </button>
              </form>
              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='bg-white px-3 text-gray-500'>
                    or continue with
                  </span>
                </div>
              </div>
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className='w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-xl py-2.5 px-4 font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-60'
              >
                <Image src='/google.jpeg' alt='Google' width={20} height={20} />
                <span className='text-sm'>Google</span>
              </button>
              <p className='mt-6 text-center text-gray-600 text-sm'>
                {type === "sign-in"
                  ? "Don't have an account yet?"
                  : "Already have an account?"}
                <Link
                  href={type === "sign-in" ? "/signup" : "/signin"}
                  className='ml-1 font-semibold text-indigo-600 hover:text-indigo-800'
                >
                  {type === "sign-in" ? "Sign up" : "Sign in"}
                </Link>
              </p>
            </div>
          </div>
          <div className='mt-10 grid grid-cols-3 gap-4 text-center'>
            <FeatureIcon
              icon={<MapPin className='h-5 w-5 text-indigo-600 mx-auto' />}
              title='Local Discovery'
            />
            <FeatureIcon
              icon={<ShoppingBag className='h-5 w-5 text-indigo-600 mx-auto' />}
              title='Shop Local'
            />
            <FeatureIcon
              icon={<Globe className='h-5 w-5 text-indigo-600 mx-auto' />}
              title='Community'
            />
          </div>
        </div>
      </main>
      <footer className='bg-white/80 backdrop-blur-sm p-4 border-t border-gray-100 text-center text-sm text-gray-600'>
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center'>
          <p>© 2025 Zazzer. All rights reserved.</p>
          <div className='flex gap-6 mt-2 md:mt-0'>
            <Link href='/terms' className='hover:text-indigo-600'>
              Terms
            </Link>
            <Link href='/privacy' className='hover:text-indigo-600'>
              Privacy
            </Link>
            <Link href='/help' className='hover:text-indigo-600'>
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureIcon = ({ icon, title }: FeatureIconProps) => {
  return (
    <div>
      <div className='h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-2'>
        {icon}
      </div>
      <p className='text-xs font-medium text-gray-700'>{title}</p>
    </div>
  );
};