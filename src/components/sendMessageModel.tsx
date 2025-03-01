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

import { FaF } from "react-icons/fa6";
import Message from "./message";



export default function SendMessageModel({product}:any) {


  return (
    <Dialog>
      <DialogTrigger asChild>
      <span>
          <Button>
       <FaFileAlt />
        Message
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>
        Send Message to Vendor
          </DialogDescription>
        </DialogHeader>
 
      <Message product={product} />
      </DialogContent>
    </Dialog>
  );
}
 