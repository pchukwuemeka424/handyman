"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function ModalEdit({ product }: { product: any }) {
  // Initialize state with default values from the product
  const [formData, setFormData] = useState({
    username: product.username || "N/A",
    shopname: product.shopname || "N/A",
    phone: product.phone || "N/A",
    state: product.stat || "N/A",
    kyc_status: product.kyc_status || "Pending",
    sub_plan: product.sub_plan || "N/A",
    id: product.id
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("user_profile")
        .update({
          username: formData.username,
          shopname: formData.shopname,
          phone: formData.phone,
          stat: formData.state,
          kyc_status: formData.kyc_status,
          sub_plan: formData.sub_plan,
        })
        .eq("id", product.id);

      if (error) {
        console.log("Error updating user:", product.id);
      } else {
        alert("User updated successfully!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Wrap the button content in a <span> to avoid nesting */}
        <span>
          <Button>
            <FaEye className="mr-1" />
            View
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details and save the changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-2">
          
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
              />
            </div>
            <div>
              <Label htmlFor="shopname">Shop Name</Label>
              <Input
                id="shopname"
                name="shopname"
                value={formData.shopname}
                onChange={handleInputChange}
                placeholder="Enter shop name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
            </div>
            <div>
              <Label htmlFor="kyc_status">KYC Status</Label>
              <select
                id="kyc_status"
                name="kyc_status"
                value={formData.kyc_status}
                onChange={handleInputChange}
                className="border w-full border-gray-300 rounded p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <Label htmlFor="sub_plan">Plan</Label>
              <select
                id="sub_plan"
                name="sub_plan"
                value={formData.sub_plan}
                onChange={handleInputChange}
                className="border w-full border-gray-300 rounded p-2"
              >
                <option value="Free">Free</option>
                <option value="Standard">Standard</option>
                <option value="Vip">Vip</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
