"use client";

import { useState } from "react";
import { Crown } from "lucide-react";

export default function GetPremiumButton() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Something went wrong", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 rounded-md hover:from-yellow-600 hover:to-amber-700 transition-all shadow-md"
    >
      <Crown size={18} />
      {loading ? "Processing..." : "Get Premium"}
    </button>
  );
}
