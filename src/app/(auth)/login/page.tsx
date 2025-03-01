"use client";

import { useActionState } from "react";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import login from "@/actions/auth/login";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image"; // Import Image component

interface FormData {
  email: string;
  password: string;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

export default function Login() {
  const [prev, action, isPending] = useActionState<FormData>(
    login,
    {
      email: "",
      password: "",
      errors: {},
      isSubmitting: false,
      isValid: true,
    },
    null
  );

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Section (Form) */}
      <div className="flex flex-1 justify-center items-center p-6">
        <form
          action={action}
          className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md shadow-2xl p-8 rounded-2xl"
        >
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo.png" // Replace with your logo path
              alt="Handyman Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
            Welcome Back
          </h2>

          {/* Email Field */}
          <div className="relative mb-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              defaultValue={prev?.email}
              className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <AiOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl" />
            {prev?.errors.email && (
              <p className="text-red-500 text-sm mt-2">{prev.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative mb-5">
            <input
              type="password"
              name="password"
              placeholder="Password"
              defaultValue={prev?.password}
              className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <AiOutlineLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl" />
            {prev?.errors.password && (
              <p className="text-red-500 text-sm mt-2">{prev.errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-4">
            <Link href="/forgot" className="text-blue-600 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-3 text-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg transition-all flex justify-center items-center"
          >
            {isPending ? (
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></span>
            ) : (
              "Login"
            )}
          </Button>

          {/* Register Link */}
          <div className="text-center mt-5">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {prev?.errors.general && (
            <p className="text-red-500 text-center text-sm mt-2">
              {prev.errors.general}
            </p>
          )}
        </form>
      </div>

      {/* Right Section (Background Image) */}
      <div className="hidden md:block w-1/2 relative">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/Xa.jpg')" }}
        ></div>
      </div>
    </div>
  );
}
