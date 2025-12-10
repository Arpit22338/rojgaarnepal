"use client";
import { useState } from "react";

export default function TeacherLoginToggle({ initialValue }: { initialValue: boolean }) {
  const [enabled, setEnabled] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleToggle() {
    setLoading(true);
    // Call server API to update setting (avoid importing server-only prisma in client)
    try {
      const res = await fetch(`/api/settings/teacher-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });
      if (!res.ok) throw new Error("Failed to update setting");
      setEnabled(!enabled);
      setMessage(`Teacher login is now ${!enabled ? "enabled" : "disabled"}`);
    } catch (err) {
      setMessage("Failed to update setting");
      console.error(err);
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 2000);
  }

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex items-center gap-4">
        <label className="font-semibold text-gray-700">Enable Teacher Login</label>
        <button
          className={`px-4 py-2 rounded transition-colors duration-200 ${enabled ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}
          onClick={handleToggle}
          disabled={loading}
        >
          {enabled ? "ON" : "OFF"}
        </button>
      </div>
      {message && (
        <div className="text-sm text-green-600 font-semibold">{message}</div>
      )}
    </div>
  );
}
