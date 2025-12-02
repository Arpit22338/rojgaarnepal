"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle } from "lucide-react";

export default function PremiumPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"20_UPLOADS" | "30_DAYS" | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const plans = [
    {
      id: "20_UPLOADS",
      title: "20 Uploads Pack",
      price: 500,
      description: "Post up to 20 jobs or talents. Valid until used.",
    },
    {
      id: "30_DAYS",
      title: "30 Days Premium",
      price: 1000,
      description: "Unlimited visibility, verified badge, and priority support for 30 days.",
    },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("File size too large. Max 4MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setScreenshot(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan || !screenshot) return;

    setLoading(true);
    try {
      const plan = plans.find((p) => p.id === selectedPlan);
      const res = await fetch("/api/premium/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: selectedPlan,
          amount: plan?.price,
          screenshotUrl: screenshot,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit request");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Your premium application has been received. It usually gets accepted within 24 hours.
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Upgrade to Premium</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Plans */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">1. Select a Plan</h2>
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as "20_UPLOADS" | "30_DAYS")}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{plan.title}</h3>
                <span className="text-blue-600 font-bold">Rs. {plan.price}</span>
              </div>
              <p className="text-gray-600 text-sm">{plan.description}</p>
            </div>
          ))}
        </div>

        {/* Payment & Upload */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">2. Pay & Upload Screenshot</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="mb-4 text-sm text-gray-600">Scan QR to pay via eSewa or Khalti</p>
            <div className="flex gap-4 justify-center mb-6">
              <div className="text-center">
                <div className="w-32 h-32 relative rounded-lg overflow-hidden mb-2 border">
                  <Image 
                    src="/esewa-qr.jpg" 
                    alt="eSewa QR" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium">eSewa</span>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 relative rounded-lg overflow-hidden mb-2 border">
                  <Image 
                    src="/khalti-qr.jpg" 
                    alt="Khalti QR" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium">Khalti</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Payment Screenshot
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {screenshot ? (
                      <div className="text-green-600 flex items-center gap-2">
                        <CheckCircle size={24} />
                        <span className="text-sm">Screenshot Uploaded</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to upload</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedPlan || !screenshot || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
