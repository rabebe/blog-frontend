"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [message, setMessage] = useState(
    token ? "Verifying your email…" : "Verification token is missing or invalid."
  );

  useEffect(() => {
    if (!token) return;

    let active = true;

    const verify = async () => {
      try {
        await apiFetch(`/verify-email?token=${encodeURIComponent(token)}`);
        if (!active) return;

        setStatus("success");
        setMessage("Your email has been verified! Redirecting to login...");

        setTimeout(() => router.push("/login"), 2000);
      } catch (err: unknown) {
        if (!active) return;

        setStatus("error");
        const errorMessage =
          err instanceof Error ? err.message : "Verification failed";
        setMessage(errorMessage);
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Email Verification</h1>

        {status === "loading" && <p className="text-gray-600">{message}</p>}

        {status === "success" && (
          <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            {message}
          </p>
        )}

        {status === "error" && (
          <>
            <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
              {message}
            </p>
            <button
              onClick={() => router.push("/resend-verification")}
              className="text-sm text-black underline hover:opacity-80"
            >
              Resend verification email
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={<p className="text-center py-8">Loading verification...</p>}>
      <VerifyContent />
    </Suspense>
  );
}