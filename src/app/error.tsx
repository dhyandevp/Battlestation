"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard caught error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 text-zinc-900 p-4">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200 max-w-md w-full text-center">
                <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
                <p className="text-sm text-zinc-500 mb-6">
                    A critical error occurred while rendering the dashboard.
                </p>
                <button
                    onClick={() => reset()}
                    className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 outline-none"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
