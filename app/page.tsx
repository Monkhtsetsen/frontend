// server deer bish browser deer ene component run hiine
"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  // stores data that can change
  const [backendStatus, setBackendStatus] = useState("Checking backend... ");

  // runs once when component loads, checks backend status
  useEffect(() => {
    // call backend
    fetch("http://localhost:8080/api/health")
      // convert response to json
      .then((res) => res.json())
      // use data to update backend status
      .then((data) => {
        setBackendStatus(`${data.app} backend status: ${data.status}`);
      })
      .catch(() => {
        setBackendStatus("Backend is not connected");
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF7F2] text-[#3B2F2F] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-sm border border-[#F2D8C9]">
        <p className="text-sm text-[#8B7470] mb-2">GlowUp AI</p>

        <h1 className="text-4xl font-bold mb-4">
          Your personal growth app is starting ✨
        </h1>

        <p className="text-lg text-[#6F5C58] mb-6">
          Mood tracking, habits, goals, and AI support - all in one soft little
          system.
        </p>

        <div className="rounded-2xl bg-[#FFF1EA] border border-[#F2D8C9] p-4">
          <p className="font-medium">Backend connection</p>
          <p className="text-[#8B7470] mt-1">{backendStatus}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/tracker"
            className="rounded-2xl bg-[#D99A8B] px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            Track mood
          </a>

          <a
            href="/dashboard"
            className="rounded-2xl border border-[#D99A8B] px-5 py-3 font-semibold text-[#3B2F2F] hover:bg-[#FFF1EA]"
          >
            Dashboard
          </a>
<a
  href="/period"
  className="rounded-2xl border border-[#D99A8B] px-5 py-3 font-semibold text-[#3B2F2F] hover:bg-[#FFF1EA]"
>
  Cycle Tracker
</a>
          <a
            href="/chat"
            className="rounded-2xl border border-[#D99A8B] px-5 py-3 font-semibold text-[#3B2F2F] hover:bg-[#FFF1EA]"
          >
            AI Chat
          </a>
        </div>
      </div>
    </main>
  );
}

// useState - store changing data
// useEffect - run code when component loads
// map() - iterate over an array and return a new array