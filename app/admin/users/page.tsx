"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  isPremium: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? "unban" : "ban"} this user?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}/ban`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: !currentStatus }),
      });
      
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Action failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error performing action");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading users...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Joined</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">{user.role}</span>
                  {user.isPremium && <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Premium</span>}
                </td>
                <td className="p-4">
                  {user.isBanned ? (
                    <span className="text-red-600 font-bold text-sm">Banned</span>
                  ) : (
                    <span className="text-green-600 text-sm">Active</span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleBan(user.id, user.isBanned)}
                    className={`px-3 py-1 rounded text-xs text-white transition-colors ${
                      user.isBanned ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {user.isBanned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
