"use client";

import { useEffect } from "react";
import { addNextjsError } from "@datadog/browser-rum-nextjs";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error:", error);
        addNextjsError(error);
    }, [error]);

    return (
        <html>
            <body className="bg-[#101114]">
                <main className="flex min-h-screen flex-col items-center justify-center space-y-6 px-6 text-center">
                    <div className="text-6xl mb-2">⚠️</div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-white">Something went wrong</h1>
                        <p className="max-w-md text-gray-400">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => { window.location.href = "/"; }}
                            className="rounded-lg border border-gray-600 px-6 py-2.5 text-gray-300 transition-colors hover:bg-gray-800"
                        >
                            Go Home
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-500"
                        >
                            Try again
                        </button>
                    </div>
                </main>
            </body>
        </html>
    );
}
