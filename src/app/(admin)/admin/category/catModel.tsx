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
import CatForm from "./catForm";



export default function BannwerModalLogo({record}) {


  return (
    <Dialog>
      <DialogTrigger asChild>
      <span>
          <Button>
       <FaFileAlt />
      
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
         Update Category
          </DialogDescription>
        </DialogHeader>
 
    <CatForm record={record} />
      </DialogContent>
    </Dialog>
  );
}
