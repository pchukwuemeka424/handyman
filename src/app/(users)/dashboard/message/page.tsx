"use client";
import React, { useState, useEffect } from "react";
import { FaEnvelope, FaEnvelopeOpen, FaUser, FaTrash } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function MessageInbox() {
  const [messages, setMessages] = useState([]);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const messagesPerPage = 5;

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user data:", userError);
        return;
      }
      setUserId(userData.user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) fetchMessages();
  }, [userId, currentPage]);

  const fetchMessages = async () => {
    if (!userId) return;
    const { data, error, count } = await supabase
      .from("message")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .eq("user_id", userId)
      .range((currentPage - 1) * messagesPerPage, currentPage * messagesPerPage - 1);

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
      if (count) setTotalPages(Math.ceil(count / messagesPerPage));
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("message").delete().eq("id", id);
    if (error) {
      console.error("Error deleting message:", error);
    } else {
      setMessages(messages.filter((msg) => msg.id !== id));
      if (expandedMessage?.id === id) setExpandedMessage(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Inbox</h2>
      <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
        {/* Message List */}
        {messages.map((msg) => (
          <div key={msg.id} className="border-b border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition duration-200">
            {/* Message Header */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedMessage(expandedMessage?.id === msg.id ? null : msg)}
            >
              <div className="flex items-center gap-4">
                <FaUser className="text-gray-500 text-xl" />
                <div>
                  <div className="font-semibold text-gray-900">{msg.name}</div>
                  <div className="text-sm text-gray-600">{msg.subject}</div>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {expandedMessage?.id === msg.id ? (
                  <FaEnvelopeOpen className="text-blue-500 text-lg" />
                ) : (
                  <FaEnvelope className="text-gray-500 text-lg" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg.id);
                  }}
                  className="text-red-500 ml-4 hover:text-red-700 transition"
                  aria-label="Delete message"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Expanded Message Content */}
            {expandedMessage?.id === msg.id && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-gray-700 text-sm">
                <p><strong>From:</strong> {msg.name}</p>
                <p><strong>Phone:</strong> 
                  <Link href={`tel:${msg.phone}`} className="text-blue-600 hover:underline ml-1">
                    {msg.phone}
                  </Link>
                </p>
                <p className="mt-2">{msg.message}</p>
                {msg.image && (
                  <div className="mt-4 flex justify-center">
                    <Image src={msg.image} width={150} height={150} alt="Message Image" className="rounded-lg shadow-sm h-40 w-48" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
