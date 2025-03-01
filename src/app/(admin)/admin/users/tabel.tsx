"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import DeleteButton from "./deleteButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ModalEdit from "@/components/modal";

const supabase = createClient();

export default function TableComponent() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
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
        .from("user_profile")
        .select("*", { count: "exact" });

      if (dataError) {
        setError("Error fetching user profiles.");
        return;
      }

      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
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
        product.username?.toLowerCase().includes(query.toLowerCase()) ||
        product.shopname?.toLowerCase().includes(query.toLowerCase())
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
          placeholder="Search by username or shop name"
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

              <TableHead>Username</TableHead>
              <TableHead>Shop Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>State</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.map((product) => (
              <TableRow key={product.id}>
            
                <TableCell className="font-medium">{product.username || "N/A"}</TableCell>
                <TableCell className="font-medium">{product.shopname || "N/A"}</TableCell>
                <TableCell className="font-medium">{product.phone || "N/A"}</TableCell>
                <TableCell className="font-medium">{product.stat || "N/A"}</TableCell>
                <TableCell className="font-medium">{product.kyc_status || "Pending"}</TableCell>
                <TableCell className="font-medium">{new Date(product.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{product.sub_plan || "N/A"}</TableCell>
                <TableCell className="font-medium">
                  {/* <DeleteButton productId={product.user_id} imagePath={product.avatar} /> */}
                  <ModalEdit product={product}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="pagination mt-4">
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
