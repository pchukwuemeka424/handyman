"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ModelKyc from "./modal";
const supabase = createClient();

export default function KYCUpdateTable() {
  const [kycRecords, setKycRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchKycRecords = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError, count } = await supabase
        .from("kyc") // Replace with your actual KYC table name
        .select(
          "*",
          { count: "exact" }
        );

      if (fetchError) {
        setError("Error fetching KYC records.");
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

    const filtered = kycRecords.filter(
      (record) =>
        record.first_name?.toLowerCase().includes(query) ||
        record.last_name?.toLowerCase().includes(query) ||
        record.id_number?.toLowerCase().includes(query)
    );

    setFilteredRecords(filtered);
    setCurrentPage(1);
  };

  const currentRecords = filteredRecords.slice(
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
          placeholder="Search by name or ID number"
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

              <TableHead>User ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Verification Type</TableHead>
              <TableHead>ID Number</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.user_id}</TableCell>
              
                <TableCell>{record.first_name || "N/A"}</TableCell>
                <TableCell>{record.last_name || "N/A"}</TableCell>
                <TableCell>{record.verification_type || "N/A"}</TableCell>
                <TableCell>{record.id_number || "N/A"}</TableCell>
                <TableCell>{record.kyc_status || "Pending"}</TableCell>
                <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                <ModelKyc product={record} />
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
