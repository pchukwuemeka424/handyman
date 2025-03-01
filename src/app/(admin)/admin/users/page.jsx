"use client";

import React, { useState, useEffect } from "react";
import Userdashboard from "@/components/userdashboard";
import Topbar from "@/components/topbar";
import Link from "next/link";
import TableComponent from "@/app/(admin)/admin/users/tabel";

export default function UserList() {

  return (
    <div className="flex flex-col md:flex-row h-screen">
   

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-50 space-y-6 overflow-y-auto">
        {/* Topbar */}
    

        <TableComponent/>
      </div>
    </div>
  );
}
