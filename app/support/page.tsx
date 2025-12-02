"use client";

import { useState, useEffect } from "react";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  reply: string | null;
  status: string;
  createdAt: string;
}

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/support");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      if (res.ok) {
        alert("Ticket submitted successfully! We will get back to you soon.");
        setSubject("");
        setMessage("");
        fetchTickets(); // Refresh list
      } else {
        const data = await res.json();
        alert(data.message || "Failed to submit ticket");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Premium Customer Support</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-600 mb-8">
            As a premium member, you have access to our priority support channel. 
            Please describe your issue below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Brief summary of the issue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-md px-4 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Describe your problem in detail..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Your Tickets</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {tickets.length === 0 ? (
              <p className="text-gray-500 italic">No tickets submitted yet.</p>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white p-4 rounded-lg shadow border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      ticket.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                  <div className="bg-gray-50 p-3 rounded mb-3 text-sm text-gray-700">
                    {ticket.message}
                  </div>
                  
                  {ticket.reply && (
                    <div className="bg-blue-50 p-3 rounded border border-blue-100">
                      <p className="text-xs font-bold text-blue-800 mb-1">Admin Reply:</p>
                      <p className="text-sm text-gray-800">{ticket.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
