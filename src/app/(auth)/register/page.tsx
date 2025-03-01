"use client";

import { useActionState, useEffect } from "react";
import register from "@/actions/auth/register";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AiOutlineArrowLeft } from "react-icons/ai";
import SelectedState from "@/components/selectedState";
import MultiSelect from "@/components/MultiSelectCombobox";

export default function Register() {
  const initialState = {
    errors: undefined,
    isSubmitting: false,
    isValid: false,
    successMessage: undefined,
  };

  const [prev, action, isPending] = useActionState(register, initialState);
  
  useEffect(() => {
    if (prev?.successMessage) {
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    }
  }, [prev?.successMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Link href="/">
            <AiOutlineArrowLeft className="text-xl cursor-pointer" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mx-auto">Join as a Handyman</h2>
        </div>
        <p className="text-center text-gray-600 mb-4">
          Sign up as a skilled professional to connect with clients and offer handyman services.
        </p>
        {prev?.successMessage && (
          <div className="text-green-600 text-center font-semibold mb-4">
            {prev.successMessage}
          </div>
        )}
        
        <form className="space-y-4" action={action}>
          <Input type="text" name="fname" placeholder="First Name" defaultValue={prev?.fname || ""} />
          {prev?.errors?.fname && <span className="text-red-500 text-sm">{prev.errors.fname}</span>}

          <Input type="text" name="lname" placeholder="Last Name" defaultValue={prev?.lname || ""} />
          {prev?.errors?.lname && <span className="text-red-500 text-sm">{prev.errors.lname}</span>}

          <Input type="text" name="serviceType" placeholder="Service Type (e.g. Plumber, Electrician)" defaultValue={prev?.serviceType || ""} />
          {prev?.errors?.serviceType && <span className="text-red-500 text-sm">{prev.errors.serviceType}</span>}
          
          <Input type="tel" name="phone" placeholder="Phone Number" defaultValue={prev?.phone || ""} />
          {prev?.errors?.phone && <span className="text-red-500 text-sm">{prev.errors.phone}</span>}
          
          <Input type="email" name="email" placeholder="Email" defaultValue={prev?.email || ""} />
          {prev?.errors?.email && <span className="text-red-500 text-sm">{prev.errors.email}</span>}
          
          <Input type="password" name="password" placeholder="Password" defaultValue={prev?.password || ""} />
          {prev?.errors?.password && <span className="text-red-500 text-sm">{prev.errors.password}</span>}
          
          <SelectedState />
          <MultiSelect />
          
          <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
            {isPending ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
