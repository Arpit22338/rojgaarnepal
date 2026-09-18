"use client";

import { addNextjsError } from "@datadog/browser-rum-nextjs";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    addNextjsError(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Something went wrong</p>
      <h1 className="font-display mt-3 text-4xl font-bold">This page could not load.</h1>
      <p className="mt-4 text-muted-foreground">Try again. If the problem continues, contact our team.</p>
      <button onClick={reset} className="mt-7 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Try again</button>
    </section>
  );
}
