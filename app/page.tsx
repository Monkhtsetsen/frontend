"use client";
import {useEffect, useState} from "react";
export default function HomePage(){
  const [backendStatus, setBackendStatus] = useState("Checking backend... ");
  useEffect(()=>{
    fetch("http://localhost:8000/api/health")
    .then((res) => res.json())
    .then((data)=>{
      setBackendStatus(`${data.app} backend status: ${data.status}`);
    })
    .catch(()=>{
      setBackendStatus("Backend is not connected");
    });
  }, []);
  return(
    <main className="min-h-screen bg-[#FFF7F2] text[#3B2F2F] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-sm border border-[#F2D8C9] ">
        <p className="text-sm text-[#8B7470] mb-2">GlowUp AI</p>
        <h1 className="text-4xl font-bold mb-4">
          Your personal growth app is starting 
        </h1>
        <p className="text-lg text-[#6F5C58] mb-6">
          Mood tracking, habbits, goals, and AI support - all in one soft little system.
        </p>
        <div className="rounded-2xl bg-[#FFF1EA] border border-[#F2D8C9] p-4">
          <p className="font-medium">Backend connection</p>
          <p className="text-[#8B7470] mt-1">{backendStatus}</p>
        </div>
      </div>
    </main>
  )
}