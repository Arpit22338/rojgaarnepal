"use client";

import { getEmployerStats } from "@/app/actions";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, AlertTriangle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const jobSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  location: z.string().min(2, "Location is required"),
  salary: z.string().optional(),
  type: z.string().min(1, "Job type is required"),
  requiredSkills: z.string().optional(),
});

type JobForm = z.infer<typeof jobSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const [stats, setStats] = useState<{ isPremium: boolean; jobCount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
  });

  useEffect(() => {
    getEmployerStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const onSubmit = async (data: JobForm) => {
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to post job");
      }

      router.push("/jobs");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  const isLimitReached = stats && !stats.isPremium && stats.jobCount >= 1;

  if (isLimitReached) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-gray-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Posting Limit Reached</h1>
          <p className="text-gray-600 mb-8 text-lg">
            You have reached the limit of 1 free job post. To post more jobs and unlock premium features, please upgrade your account.
          </p>
          <Link 
            href="/premium" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-full hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-md"
          >
            <Crown className="mr-2" size={24} />
            Get Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
      
      {stats && !stats.isPremium && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You are not a premium user. Your listing will be removed after 24 hours.
              </p>
              <p className="mt-2 text-sm">
                <Link href="/premium" className="font-medium text-yellow-700 underline hover:text-yellow-600">
                  Buy Premium to remove limits &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            {...register("title")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Senior Frontend Developer"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description")}
            rows={5}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Job responsibilities, requirements, etc."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              {...register("location")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Kathmandu, Remote"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Type</label>
            <select
              {...register("type")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Salary Range (Optional)</label>
          <input
            {...register("salary")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. NRs. 50,000 - 80,000 / month"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Required Skills (comma separated)</label>
          <input
            {...register("requiredSkills")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="React, Node.js, TypeScript"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
