import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";

// Dynamically import React Select with SSR disabled
const Select = dynamic(() => import("react-select"), { ssr: false });

function MultiSelectCombobox({profile}) {
  const supabase = createClient();
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase.from("skills").select("*");
      if (error) {
        console.error("Error fetching skills:", error);
        return;
      }
      if (data) {
        setOptions(data.map((item) => ({ label: item.label, value: item.value })));
      }
    };

    fetchSkills();
  }, []);

  // Convert selected options to text separated by commas
  const selectedText = selectedOptions.map((option) => option.label).join(", ");

  return (
    <div className="w-full">
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={setSelectedOptions}
        placeholder="Select skills"
        className="react-select-container"
       
      />
      {/* Hidden input field for form submission */}
      <input type="hidden" name="category" value={selectedText} />
      <div className="mt-2 text-sm text-gray-500">
        eg: Plumber, Carpenter, Electrician,Teacher etc
      </div>
    </div>
  );
}

export default MultiSelectCombobox;
