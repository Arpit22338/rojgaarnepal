"use client";
import { useState } from "react";

export default function TeacherLoginToggle({ initialValue }: { initialValue: boolean }) {
  const [enabled, setEnabled] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/settings/teacher-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: (!enabled).toString() }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      setEnabled(data.value === "true");
      setMessage(`Teacher login is now ${data.value === "true" ? "enabled" : "disabled"}`);
    } catch {
      setMessage("Failed to update setting");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 2000);
    }
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
