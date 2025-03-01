"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { createClient } from "@/utils/supabase/client";
import DeleteButton from "./deleteButton";
import { CheckCircle } from "lucide-react";

const supabase = createClient();

export default function TableComponent() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchUsersWithProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userDetail, error: userError } = await supabase.auth.getUser();
      if (userError || !userDetail?.user) {
        setError("User authentication failed.");
        return;
      }

      const { data: agentSession, error: agentError } = await supabase
        .from("agents")
        .select("agentId")
        .eq("user_id", userDetail.user.id)
        .single();

      if (agentError || !agentSession) {
        setError("Error fetching agent session.");
        return;
      }

      // Fetch users and their products
      const { data, error: dataError } = await supabase
        .from("user_profile")
        .select("*, products(id)")
        .eq("agentId", agentSession.agentId);

      if (dataError) {
        setError("Error fetching users.");
        return;
      }

      // Calculate product count per user
      const userProductCounts = data.map((user) => ({
        ...user,
        productCount: user.products ? user.products.length : 0,
      }));

      // Calculate total products
      const totalProductCount = userProductCounts.reduce((sum, user) => sum + user.productCount, 0);

      setUsers(userProductCounts);
      setFilteredUsers(userProductCounts);
      setTotalProducts(totalProductCount);
      setTotalPages(Math.ceil(userProductCounts.length / itemsPerPage));
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithProducts();
  }, [currentPage]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      <div className="my-4">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      <p>Total Products: {totalProducts}</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Product Count</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell className="font-medium">{user.productCount}</TableCell>
                <TableCell className="font-medium flex items-center gap-2">
 ({Math.min((user.productCount / 10) * 100, 100).toFixed(0)}%)
  {user.productCount >= 10 && <CheckCircle className="text-green-500" />}
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
