import { createClient } from "@/utils/supabase/client"; // Adjust import based on your project structure

// Initialize the Supabase client
const supabase = createClient();

const DeleteButton = ({ productId, imagePath }: { productId: string; imagePath: string }) => {
  const handleDelete = async () => {
    try {
      // Delete the product from the "products" table by productId
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("user_id", productId);
      if (deleteError) {
        console.error("Error deleting product:", deleteError);
        alert("Failed to delete the product from the database.");
        return;
      }

      // Delete the image from the Supabase bucket
      const { error: storageError } = await supabase
        .storage
        .from("products_image")
        .remove([imagePath.replace(/.*\/public\//, "")]);
      if (storageError) {
        console.error("Error deleting image from bucket:", storageError);
        alert("Failed to delete the image from the storage bucket.");
        return;
      }

      console.log("Product and associated image deleted successfully!");
      alert("Product and associated image deleted successfully!");
    //  Refresh page automatically
    window.location.reload();
     
    } catch (err) {
      console.error("Error during deletion process:", err);
      alert("An unexpected error occurred while deleting.");
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
      Delete
    </button>
  );
};

export default DeleteButton;
