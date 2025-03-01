"use server";

import { createClient } from '@/utils/supabase/server';
import { z } from "zod";
import { Resend } from 'resend';

interface FormData {
  get: (key: string) => string | null;
}

interface AgentState {
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  successMessage?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function agentRegister(prev: AgentState, formData: FormData) {
  const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    agentId: z.string(),
    fname: z.string(),
    lname: z.string(),
    state: z.string(),
  });

  const validated = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    agentId: formData.get("agentId"),
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    state: formData.get("state"),
  });

  if (!validated.success) {
    return {
      ...prev,
      errors: validated.error.flatten().fieldErrors,
      isSubmitting: false,
      isValid: false,
    };
  }

  const supabase = await createClient();

  // Check if the email already exists in the agents table
  const { data: emailCheck, error: emailCheckError } = await supabase
    .from("agents")
    .select("email")
    .eq("email", validated.data.email)
    .single();

  if (emailCheck) {
    return {
      ...prev,
      errors: { email: "Email already exists" },
      isSubmitting: false,
      isValid: false,
    };
  }

  // Proceed with user authentication registration
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (authError) {
    console.error("Error registering user:", authError.message);
    return {
      ...prev,
      errors: { general: "Error registering user. Please try again." },
      isSubmitting: false,
      isValid: false,
    };
  }

  // Insert additional agent details into the "agents" table
  const { error: agentInsertError } = await supabase.from('agents').insert({
    user_id: authData?.user?.id,
    email: validated.data.email,
    fname: validated.data.fname,
    lname: validated.data.lname,
    state: validated.data.state,
    agentId: validated.data.agentId,
  
  });

  if (agentInsertError) {
    console.error("Error creating agent profile:", agentInsertError.message);
    return {
      ...prev,
      errors: { general: "Error creating profile. Please try again." },
      isSubmitting: false,
      isValid: false,
    };
  }

  // Send welcome email
  // try {
  //   await resend.emails.send({
  //     from: `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`,
  //     to: validated.data.email,
  //     subject: `🎉 Welcome to ${process.env.APP_NAME}`,
  //     html: `
  //       <div style="font-family: Arial, sans-serif; color: #333;">
  //         <h1 style="color: #007bff;">Welcome to ${process.env.APP_NAME}! 🎉</h1>
  //         <p>Hi <strong>${validated.data.fname} ${validated.data.lname}</strong>,</p>
  //         <p>Thanks for registering with <strong>${process.env.APP_NAME}</strong>.</p>
  //         <p>We're excited to have you on board! If you have any questions, feel free to reach out.</p>
  //         <p>Best Regards,</p>
  //         <p><strong>The ${process.env.APP_NAME} Team</strong></p>
  //       </div>
  //     `,
  //   });
  // } catch (emailError) {
  //   console.error('Error sending email:', emailError);
  // }

  return {
    ...prev,
    errors: {},
    isSubmitting: false,
    isValid: true,
    successMessage: "Registration successful! Redirecting to login...",
  };
}