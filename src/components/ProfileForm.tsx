

import { Link } from "lucide-react";
import { Input } from "@/components/ui/input"
import React, { useState } from "react";
import { useActionState } from "react"; // Ensure this is a valid import or replace with a correct hook
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaStore, FaUser, FaAddressCard, FaPhone, FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import SelectedState from "./selectedState";
import { Button } from "./ui/button";
import MultiSelect from "./MultiSelectCombobox"




export default function ProfileForm({ handler, profile }) {
  const [prev, action, isPending] = useActionState(handler, undefined);

  return (
    <div className="w-full sm:w-2/4">
   

      <form className="w-full my-2 max-w-sm" action={action}>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              name="fname"
              placeholder="First Name"
              defaultValue={profile?.fname}

            />

          </div>

          <div>
            <Input
              type="text"
              name="lname"
              placeholder="Last Name"
              defaultValue={profile?.lname}

            />

          </div>
        </div>

        {/* Username, Business Name, and Phone Inputs */}


        <div className="mt-4">
          <Input
            type="text"
            name="busName"
            placeholder="Business Name"
            defaultValue={profile?.busName}
          />

        </div>

        <div className="mt-4">
          <Input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            defaultValue={profile?.phone}

          />

        </div>

        {/* Email and Password Inputs */}
        <div className="mt-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={profile?.email}
          />

        </div>



        {/* Submit Button */}
        <Button type="submit" disabled={isPending} className="w-full transition mt-4">
          {isPending ? "Updating..." : "Update"}
        </Button>


      </form>
      {/* show successMessage */}


    </div>
  );
}
