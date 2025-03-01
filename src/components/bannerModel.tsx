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
import BanM from "./banM";
import { FaF } from "react-icons/fa6";



export default function BannwerModalLogo() {


  return (
    <Dialog>
      <DialogTrigger asChild>
      <span>
          <Button>
       <FaFileAlt />
         Change Banner
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chnage Banner</DialogTitle>
          <DialogDescription>
         Chnage Banner
          </DialogDescription>
        </DialogHeader>
 
        <BanM />
      </DialogContent>
    </Dialog>
  );
}
