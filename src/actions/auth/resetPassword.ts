"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

interface FormData {
    get: (key: string) => string | null;
}

interface ResetState {
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
    email?: string;
}

export default async function resetPassword(
    prev: ResetState,
    formData: FormData
): Promise<ResetState> {
    // Define the schema for email validation
    const resetSchema = z.object({
        email: z.string().email("Invalid email format"),
    });

    // Extract and validate form data
    const email = formData.get("email") || ""; // Default to an empty string if null
    const validation = resetSchema.safeParse({ email });

    if (!validation.success) {
        // Validation failed: return errors
        const errors = Object.fromEntries(
            Object.entries(validation.error.flatten().fieldErrors).map(([key, value]) => [
                key,
                value.join(", "),
            ])
        );

        return {
            ...prev,
            errors,
            email,
            isSubmitting: false,
            isValid: false,
        };
    }

    const supabase = await createClient();

    // Attempt to send the reset email
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(validation.data.email);

        if (error) {
            // Supabase-specific error occurred
            return {
                ...prev,
                errors: { general: error.message || "Unable to send reset email." },
                email,
                isSubmitting: false,
                isValid: false,
            };
        }

        // Reset email sent successfully
        return {
            ...prev,
            errors: {},
            email,
            isSubmitting: false,
            isValid: true,
        };
    } catch (err) {
        // Handle unexpected errors
        return {
            ...prev,
            errors: { general: "An unexpected error occurred. Please try again later." },
            email,
            isSubmitting: false,
            isValid: false,
        };
    }
}
