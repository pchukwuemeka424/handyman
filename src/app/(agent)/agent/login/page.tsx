"use client";

import { useActionState } from 'react';
import { AiOutlineLock, AiOutlineMail, AiOutlineArrowLeft } from 'react-icons/ai';
import login from '@/actions/auth/agentLogin';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FormData {
    email: string;
    password: string;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
}

export default function AgentLogin() {
    const [prev, action, isPending] = useActionState<FormData>(login, {
        email: "",
        password: "",
        errors: {},
        isSubmitting: false,
        isValid: true,
    }, null);

    return (
        <div className="h-screen flex flex-col md:flex-row bg-gray-100">
            {/* Return Home Button */}
            <Link href="/">
                <Button className="absolute top-6 left-6 flex items-center bg-blue-600 text-white hover:bg-blue-700 transition-all focus:ring-4 focus:ring-blue-300 rounded-lg shadow-lg px-6 py-3">
                    <AiOutlineArrowLeft className="mr-2 text-lg" /> Return to Home
                </Button>
            </Link>

            {/* Left Section - Form */}
            <div className="flex flex-1 justify-center items-center p-8">
                <form action={action} className="w-full max-w-md bg-white rounded-xl shadow-xl p-10 space-y-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Agent Login</h2>

                    {/* Email Input */}
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            defaultValue={prev?.email}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        />
                        <AiOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                        {prev?.errors.email && <p className="text-red-500 text-sm mt-2">{prev.errors.email}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            defaultValue={prev?.password}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        />
                        <AiOutlineLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                        {prev?.errors.password && <p className="text-red-500 text-sm mt-2">{prev.errors.password}</p>}
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <Link href="/forgot" className="text-blue-600 hover:underline text-sm">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg transition-all shadow-md"
                    >
                        {isPending ? 'Processing...' : 'Login'}
                    </Button>

                    {/* Register Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-blue-600 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>

                    {/* General Error Message */}
                    {prev?.errors.general && <p className="text-red-500 text-sm mt-2 text-center">{prev.errors.general}</p>}
                </form>
            </div>

            {/* Right Section - Background Image */}
            <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/images/Xa.jpg)' }}></div>
        </div>
    );
}
