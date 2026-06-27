"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WorkflowStatus from "@/components/WorkflowStatus";
import Dashboard from "@/components/Dashboard";
import Watchlist from "@/components/Watchlist";
import History from "@/components/History";
import FloatingAssistant from "@/components/FloatingAssistant";
import Footer from "@/components/Footer";

export default function Home() {
  const { activeTab, isAnalyzing, darkMode } = useStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Core View Area */}
      <main className="flex-1 flex flex-col justify-start w-full max-w-7xl mx-auto py-8">
        {activeTab === "research" && (
          isAnalyzing ? <WorkflowStatus /> : <Hero />
        )}
        
        {activeTab === "dashboard" && <Dashboard />}
        
        {activeTab === "watchlist" && <Watchlist />}
        
        {activeTab === "history" && <History />}
      </main>

      {/* Floating Chatbot Assistant */}
      <FloatingAssistant />

      {/* Footnote branding */}
      <Footer />
    </div>
  );
}
