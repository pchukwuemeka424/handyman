"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SearchBar({ value, onChange }) {
  const [skills, setSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    // Fetch skills from Supabase
    const fetchSkills = async () => {
      const { data: skills, error } = await supabase.from("skills").select();

      if (error) {
        console.error("Error fetching skills:", error);
        return;
      }

      setSkills(skills);
    };

    fetchSkills();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 1) {
      setSuggestions(
        skills.filter((item) =>
          item.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    } else {
      setSuggestions([]); // Clear suggestions if input is too short
    }
  };

  const handleSelect = (label) => {
    onChange(label);
    setSuggestions([]); // Clear suggestions when a selection is made
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        name="search"
        placeholder="What are you looking for?"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
          {suggestions.map((item) => (
            <li
              key={item.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(item.label)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
