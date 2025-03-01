"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import SiteLogoModel from "@/components/siteLogoModel";
import Image from "next/image";
import AddMenu from "@/actions/auth/addMenu";
import AddCat from "@/actions/auth/addCat";
import { useActionState } from "react";
import MenuTabel from "@/components/MenuTabel";
import CatTabel from "@/app/(admin)/admin/category/CatTabel";
export default function SettingsPage({ userDetails, siteInfo }) {
  const [state, action, isPending] = useActionState(AddMenu, undefined);
  const[state1, action1, isPending1] = useActionState(AddCat, undefined);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card>
        <CardHeader>Site Logo</CardHeader>
        <CardContent className="flex items-center justify-center">
          <div>
            <Image
              src={siteInfo?.logo}
              alt="Site Logo"
              width={100}
              height={100}
              className="rounded-full my-2 border-s-orange-800"
            />
            <SiteLogoModel />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Menus</CardHeader>
        <CardContent>
          <div className="space-y-2">
            <form action={action}>
              <Input
                placeholder="Enter Menu Name"
                name="menu_name"
                type="text"
              />
              <Input
                placeholder="Enter Menu Link"
                name="menu_link"
                type="text"
              />
              <Button className="mt-2" type="submit" disabled={isPending}>
                <Plus className="w-4 h-4 mr-2" /> Add Menu
              </Button>
            </form>
          </div>
          <div className="mt-4">
          <MenuTabel />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Add Category</CardHeader>
        <CardContent>
          <div className="space-y-4">
          <form action={action1}>
              <Input
                placeholder="Enter Category Name"
                name="title"
                type="text"
              />
              <Button className="mt-2" type="submit" disabled={isPending1}>
                <Plus className="w-4 h-4 mr-2" /> Add Category
              </Button>
            </form>
          </div>
          <CatTabel />
        </CardContent>
      </Card>
    </div>
  );
}
