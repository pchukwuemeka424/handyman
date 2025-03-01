"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

export default function Catlist({ product }) {
    const supabase = createClient();
    const [kycRecords, setKycRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase.from("category").select("*");
                if (error) throw error;
                setKycRecords(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [supabase]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <select
            id="category"
            name="category"
            defaultValue={product?.category || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
            required
        >
            <option value="">Select Category</option>
            {kycRecords?.map((record) => (
                <option key={record.id} value={record.id}>
                    {record.title}
                </option>
            ))}
        </select>
    );
}
