"use client"; // Ensure this runs only on the client side
import { useEffect } from "react";

export default function TawkToScript() {
  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById("tawk-script")) return;

    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = "https://embed.tawk.to/67b87470c3759e190c785cd7/1ikk8dmbs";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, []);

  return null; // This component does not render anything visible
}
