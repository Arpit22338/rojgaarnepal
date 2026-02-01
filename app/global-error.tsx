"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error:", error);
    }, [error]);

    return (
        <html>
            <body className="bg-[#0A0E27]">
                <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center space-y-6">
                    <div className="text-6xl mb-2">⚠️</div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-white">Something went wrong</h2>
                        <p className="text-gray-400 max-w-md">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Go Home
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors font-semibold"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
