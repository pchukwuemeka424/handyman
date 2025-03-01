"use client";

import { useActionState } from "react";
import { AiOutlineArrowLeft, AiOutlineMail } from "react-icons/ai";
import resetPassword from "@/actions/auth/resetPassword";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FormData {
    email: string;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
}

export default function PasswordReset() {
    const [prev, action, isPending] = useActionState<FormData>(
        resetPassword,
        {
            email: "",
            errors: {},
            isSubmitting: false,
            isValid: true,
        },
        null
    );

    return (
        <div className="h-screen flex">
                      {/* Button with Arrow to Return Home */}
                      <Link href="/">
                <Button className="absolute top-4 left-4 flex items-center text-white bg-blue-500 hover:bg-blue-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-800">
                    <AiOutlineArrowLeft className="mr-2" /> Return to Home
                </Button>
            </Link>
            <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-8">
                <form className="w-full max-w-sm" action={action}>
                    <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>

                    {/* Email Field */}
                    <div className="mb-4 relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            defaultValue={prev?.email}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        {prev?.errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {prev.errors.email}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full transition"
                    >
                        {isPending ? "Sending..." : "Send Reset Email"}
                    </Button>

                    {/* General Error Message */}
                    {prev?.errors.general && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {prev.errors.general}
                        </p>
                    )}

                    {/* Success Message */}
                    {prev?.isValid && !isPending && prev?.email && (
                        <p className="text-green-500 text-sm mt-2 text-center">
                            Check your email for reset instructions.
                        </p>
                    )}

                    {/* Additional Links */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Remember your password?{" "}
                            <Link
                                className="text-blue-800 text-primary underline-offset-4 hover:underline"
                                href="/login"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            <div
                className="hidden md:block w-1/2 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url(/images/Xa.jpg)" }}
            ></div>
        </div>
    );
}
