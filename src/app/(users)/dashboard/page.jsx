"use client";
import { redirect } from "next/navigation";

import Dashboard from "@/components/dashboard";
import { Alert } from "@/components/ui/alert"; // ShadCN Alert
import { User } from "lucide-react";
import UserDashboard from "@/components/userdashboard";
import { useUser } from "@/context/userContext";
import Link from "next/link";

export default function DashboardPage() {

  const profile = useUser();

  return (
    <div>
      {/* Show error message if KYC status is "Pending" */}
      {profile?.kyc_status === "Pending" && (
        <Alert variant="destructive" className="text-center">
          Your KYC verification is pending. Please <Link href="/dashboard/kyc" className="underline text-blue-500">complete the verification</Link> to access all features.
        </Alert>
      )}
      <Dashboard />
    </div>
  );
}
