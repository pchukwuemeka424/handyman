import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

interface DeletCatProps {
  record: any;
  refreshData: () => void; // Function to refresh category list
}

export default function DeletCat({ record, refreshData }: DeletCatProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("category").delete().eq("id", id);
      if (error) {
        console.error("Error deleting category:", error);
      } else {
        console.log("Category deleted successfully!");
        refreshData(); // Refresh the category list
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      className="bg-red-600 hover:bg-red-700"
      onClick={() => handleDelete(record.id)}
      disabled={loading}
    >
      {loading ? "Deleting..." : <FaTrash />}
    </Button>
  );
}
