"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import TeacherLoginToggle from "@/app/admin/settings/TeacherLoginToggle";
import { getSetting } from "@/lib/settings";

export default function AdminDashboard() {
  const [teacherLoginEnabled, setTeacherLoginEnabled] = useState(true);
  useEffect(() => {
    getSetting("teacher_login_enabled").then((val) => {
      setTeacherLoginEnabled(val !== "false");
    });
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <TeacherLoginToggle initialValue={teacherLoginEnabled} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/admin/teacher-activation" className="block p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Teacher Activations</h3>
          <p className="text-sm text-gray-500">Approve teacher payments</p>
        </Link>
      </div>
    </div>
  );
}
// ...existing code ends above. Remove broken server-side code below this line.

