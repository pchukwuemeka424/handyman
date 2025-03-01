"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import DeleteButton from "./deleteButton";

const supabase = createClient();

export default function TableComponent() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userDetail, error: userError } = await supabase.auth.getUser();
      if (userError || !userDetail?.user) {
        setError("User authentication failed.");
        return;
      }

      const { data, error: dataError, count } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("id", userDetail.user.id);

      if (dataError) {
        setError("Error fetching products.");
        return;
      }

      setTotalPages(Math.ceil(count / itemsPerPage));
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or category"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.map((product) => (
              <TableRow key={product.user_id}>
                <TableCell className="font-medium">
    
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`} 
                    alt={product.title} 
                    width={50} 
                    height={50} 
                   
                  />
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell className="font-medium">{product.price}</TableCell>
                <TableCell className="font-medium">{product.category}</TableCell>
                <TableCell className="font-medium">{product.stock}</TableCell>
                <TableCell className="font-medium">
                  <DeleteButton productId={product.user_id} imagePath={product.image} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded mr-2"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
