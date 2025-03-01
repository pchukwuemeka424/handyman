import { Button } from "@/components/ui/button"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { LuList } from "react-icons/lu";
import CategoryList from "@/components/category";
import { FaTv, FaTshirt, FaHome, FaDumbbell, FaPaw, FaGem, FaBaby, FaGamepad, FaHeart } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function SheetMenu() {

  const supabase = createClient();
  const [categorys, setcategorys] = useState([]);
  
  useEffect(()=>{
  
    const fetchCategories = async () => {
      const { data: categories, error } = await supabase
      .from("category")
      .select("*");
      if (error) console.error("Error fetching categories:", error);
      else setcategorys(categories);
    };
  
    fetchCategories();
  
  },[])
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="sm:block md:hidden m-2 text-3xl" variant="outline"><LuList size={30} /></Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Products Categories</SheetTitle>
  
        </SheetHeader>

        <ul className="space-y-2 my-3 border-b shadow">
        {categorys.map((category) => (
          <li key={category.id}>
            <Link href={`/products/${category.id}`} className="flex items-center py-2 px-4 hover:bg-gray-100">
              <FaGem className="mr-2 text-rose-700" />
              {category.title}
            </Link>
          </li>
        ))}


        </ul>

      </SheetContent>
    </Sheet>
  )
}
