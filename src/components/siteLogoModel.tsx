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
import { FaEye, FaFileAlt } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import SiteLogo from "./siteLogo";
import { FaF } from "react-icons/fa6";



export default function siteLogoModel() {


  return (
    <Dialog>
      <DialogTrigger asChild>
      <span>
          <Button className="mx-2">
       <FaFileAlt />
           Upload Logo
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upadate Logo </DialogTitle>
          <DialogDescription>
            Upload Site Logo
          </DialogDescription>
        </DialogHeader>
 
        <SiteLogo/>
      </DialogContent>
    </Dialog>
  );
}
