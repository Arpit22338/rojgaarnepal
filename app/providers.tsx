"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProfileCompletionCheck from "@/components/ProfileCompletionCheck";
import { ToastProvider } from "@/components/Toast";
import { PushNotificationManager } from "@/components/PushNotificationManager";

// Loading spinner component for auth state
function AuthLoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Safe wrapper for components that need session
function SafeSessionComponents({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading while session is loading or not mounted
  if (!mounted || status === "loading") {
    return (
      <>
        <AuthLoadingSpinner />
        {children}
      </>
    );
  }

  return (
    <>
      <OnlineStatusTracker />
      <ProfileCompletionCheck />
      <PushNotificationManager />
      {children}
    </>
  );
}

function OnlineStatusTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    const updateOnlineStatus = async () => {
      try {
        await fetch("/api/users/online", { method: "POST" });
      } catch (error) {
        // Silently fail - don't break app for online status
        console.error("Failed to update online status", error);
      }
    };

    // Update immediately
    updateOnlineStatus();

    // Update every 2 minutes
    const interval = setInterval(updateOnlineStatus, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [session]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <SafeSessionComponents>
          {children}
        </SafeSessionComponents>
      </ToastProvider>
    </SessionProvider>
  );
}

