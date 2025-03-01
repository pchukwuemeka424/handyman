"use client";
import { useState } from "react";
import updatePassword from "@/actions/auth/updatePassword";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PasswordUpdate() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        token: "",
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter(); // For redirecting to login page

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const errors: Record<string, string> = {};

        // Validate fields
        if (!formData.password) {
            errors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters long.";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Confirmation password is required.";
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        if (!formData.token) {
            errors.token = "Invalid or missing reset token.";
        }

        if (!formData.email) {
            errors.email = "Email is required.";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Clear errors and reset success state
        setFormErrors({});
        setIsSuccess(false);
        setSuccessMessage(null);
        setIsPending(true);

        // Submit to the server
        try {
            const result = await updatePassword({ errors: {}, isSubmitting: false, isValid: true }, formData);

            if (result.isValid) {
                setSuccessMessage(result.successMessage);
                // Redirect to login page after a successful password update
                setTimeout(() => {
                    router.push("/login");
                }, 2000); // Wait 2 seconds before redirecting to allow user to see success message
            } else {
                setFormErrors(result.errors);
            }
        } catch (err) {
            console.error("Error updating password:", err);
            setFormErrors({ general: "An unexpected error occurred. Please try again later." });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="h-screen flex">
            <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-8">
                <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                    <h2 className="text-3xl font-bold text-center mb-6">Update Password</h2>

                    {/* Email Field */}
                    <div className="mb-4 relative">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4 relative">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="New Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {formErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4 relative">
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {formErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {formErrors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Hidden Token Field */}
                    <input type="hidden" name="token" value={formData.token} />

                    {/* Submit Button */}
                    <Button type="submit" disabled={isPending} className="w-full transition">
                        {isPending ? "Updating..." : "Update Password"}
                    </Button>

                    {/* General Error Message */}
                    {formErrors.general && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {formErrors.general}
                        </p>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <p className="text-green-500 text-sm mt-2 text-center">
                            {successMessage}
                        </p>
                    )}
                </form>
            </div>

            <div
                className="hidden md:block w-1/2 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url(/images/Xa.jpg)" }}
            ></div>
        </div>
    );
}
