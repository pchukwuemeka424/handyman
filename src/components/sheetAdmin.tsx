"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { LuList } from "react-icons/lu";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import LogoutButton from "./logoutButton";

export function SheetAdmin() {
  const supabase = createClient();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    async function fetchMenus() {
      const { data, error } = await supabase.from("menu").select("*");
      if (error) {
        console.error("Error fetching menus:", error.message);
      } else {
        setMenus(data);
      }
    }

    fetchMenus();
  }, [supabase]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="sm:block m-2 text-3xl" variant="outline">
          <LuList size={30} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menus</SheetTitle>
        </SheetHeader>

        <ul className="space-y-2 my-3 border-b shadow">
          {menus.map((menu) => (
            <Link key={menu.id} href={menu.url}>
              <li className="cursor-pointer border-b p-2">
                {menu.title}
              </li>
            </Link>
          ))}
          <LogoutButton />
        </ul>
      </SheetContent>
    </Sheet>
  );
}
