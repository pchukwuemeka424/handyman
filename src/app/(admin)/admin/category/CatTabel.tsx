"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import CatModel from "./catModel";
import { Button } from "@/components/ui/button";
import DeletCat from "./DeletCat";

const supabase = createClient();

export default function MenuUpdateTable() {
  const [kycRecords, setKycRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchKycRecords = async () => {
    setLoading(true);
    setError(null);

    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error: fetchError, count } = await supabase
        .from("category") // Ensure correct table name
        .select("*", { count: "exact" })
        .range(from, to); // Pagination applied at DB level

      if (fetchError) {
        setError("Error fetching records.");
        return;
      }

      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      setKycRecords(data || []);
      setFilteredRecords(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycRecords();
  }, [currentPage]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = kycRecords.filter((record) =>
      record.title?.toLowerCase().includes(query) // Use `title` field for filtering
    );

    setFilteredRecords(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search by category name"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded w-full max-w-md"
        />
        <CatModel />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.title || "N/A"}</TableCell>
                <TableCell>
                  {record.banner ? (
                    <Image
                      src={record.banner}
                      alt="Banner"
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <CatModel record={record} />
                  <DeletCat record={record} refreshData={fetchKycRecords} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="pagination mt-4 flex justify-center items-center gap-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
