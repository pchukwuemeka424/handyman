"use server";

import { createClient } from '@/utils/supabase/server';
import { z } from "zod";
import { Resend } from 'resend';

interface FormData {
  get: (key: string) => string | null;
}

interface RegisterState {
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  successMessage?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function register(prev: RegisterState, formData: FormData) {
  const registerSchema = z.object({
    fname: z.string().min(3, { message: "First name is required" }),
    lname: z.string().min(3, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    busName: z.string().min(3, { message: "Business name is required" }),
    phone: z.string().regex(/^\+?\d+$/, { message: "Invalid phone number format" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    state: z.string().min(2, { message: "State is required" }),
    city: z.string().min(3, { message: "City is required" }),
    category: z.string().min(3, { message: "Category is required" }),
  });

  const validated = registerSchema.safeParse({
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    email: formData.get("email"),
    username: formData.get("username"),
    busName: formData.get("busName"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    state: formData.get("state"),
    city: formData.get("city"),
    category: formData.get("category"),
  });

  if (!validated.success) {
    return {
      ...prev,
      errors: validated.error.flatten().fieldErrors,
      email: formData.get("email"),
      password: formData.get("password"),
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      busName: formData.get("busName"),
      phone: formData.get("phone"),
      state: formData.get("state"),
      city: formData.get("city"),
      category: formData.get("category"),
      isSubmitting: false,
    };
  }

  const supabase = await createClient();

  // Check for existing user
  const [emailCheck, usernameCheck, phoneCheck] = await Promise.all([
    supabase.from('user_profile').select('user_id').eq('email', validated.data.email).maybeSingle(),
    supabase.from('user_profile').select('user_id').eq('username', validated.data.username).maybeSingle(),
    supabase.from('user_profile').select('user_id').eq('phone', validated.data.phone).maybeSingle(),
  ]);

  if (emailCheck.data || usernameCheck.data || phoneCheck.data) {
    return {
      ...prev,
      errors: {
        email: emailCheck.data ? "Email already exists" : undefined,
        username: usernameCheck.data ? "Username already exists" : undefined,
        phone: phoneCheck.data ? "Phone number already exists" : undefined,
        
      },
      isSubmitting: false,
    };
  }

  // Register user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    console.error("Auth Sign Up Error:", error);
    return {
      ...prev,
      errors: { general: error.message },
      isSubmitting: false,
    };
  }

  // Insert into user_profile table
  const response = await supabase.from('user_profile').insert({
    user_id: data.user?.id,
    fname: validated.data.fname,
    lname: validated.data.lname,
    busName: validated.data.busName,
    phone: validated.data.phone,
    email: validated.data.email,
    kyc_status: "Pending",
    state: validated.data.state,
    city: validated.data.city,
    skills: validated.data.category,
  });

  if (response.error) {
    console.error("Supabase Insert Error:", response.error);
    return {
      ...prev,
      errors: { general: response.error.message },

      isSubmitting: false,
    };
  }

  return {
    ...prev,
    errors: {},
    isSubmitting: false,
    isValid: true,
    successMessage: "Registration successful! Redirecting to login...",
  };
}
