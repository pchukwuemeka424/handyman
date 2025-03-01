"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function MarketAutocomplete({ value, onChange }) {
  const supabase = createClient();
  const [markets, setMarkets] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const { data, error } = await supabase.from("markettable").select("marketname");
        if (error) {
          console.error("Supabase Error:", error.message);
        } else if (data) {
          setMarkets(data.map((market) => market.marketname));
        }
      } catch (err) {
        console.error("Fetch Markets Error:", err);
      }
    };

    fetchMarkets();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 1) {
      setSuggestions(
        markets.filter((market) =>
          market.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (market) => {
    onChange(market);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <label htmlFor="marketname" className="block mb-1">Market Name</label>
      <input
        type="text"
        name="marketname"
        placeholder="Enter market name"
        className="w-full px-4 py-2 border rounded-lg"
        value={value}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
          {suggestions.map((market, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(market)}
            >
              {market}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
