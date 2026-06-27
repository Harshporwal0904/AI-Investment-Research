"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Search } from "lucide-react";

export default function Hero() {
  const { 
    query, 
    setQuery, 
    setIsAnalyzing, 
    setWorkflowStep, 
    setActiveReport, 
    addToHistory, 
    setActiveTab 
  } = useStore();
  
  const [error, setError] = useState<string | null>(null);

  const examples = [
    { name: "Apple", ticker: "AAPL" },
    { name: "Microsoft", ticker: "MSFT" },
    { name: "Tesla", ticker: "TSLA" },
    { name: "NVIDIA", ticker: "NVDA" },
    { name: "Amazon", ticker: "AMZN" }
  ];

  const handleResearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setError(null);
    setIsAnalyzing(true);
    setWorkflowStep(0);

    // Timeline of steps to animate the workflow
    // 0: User Query
    // 1: Collecting Financial Data
    // 2: Reading News
    // 3: Checking SEC Filings
    // 4: Analyzing Financial Ratios
    // 5: Evaluating Risks
    // 6: Making Decision
    // 7: Generating Report
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < 7) {
        currentStep += 1;
        setWorkflowStep(currentStep);
      } else {
        clearInterval(interval);
      }
    }, 1100);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Failed to compile research report.");
      }

      const report = await response.json();
      
      // Wait for the workflow animations to complete minimum steps
      const remainingStepsTime = Math.max(0, (7 - currentStep) * 1100);
      
      setTimeout(() => {
        clearInterval(interval);
        setActiveReport(report);
        addToHistory(report);
        setIsAnalyzing(false);
        setActiveTab("dashboard");
      }, remainingStepsTime + 600);

    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-4xl mx-auto flex-1">
      
      {/* Small Badge */}
      <div className="bg-bright-yellow text-black border-[3.5px] border-black font-space font-extrabold text-xs uppercase px-4 py-1.5 mb-6 tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
        Powered by Gemini 2.5 Flash & LangGraph
      </div>

      {/* Main Title */}
      <h1 className="font-space font-extrabold text-4xl sm:text-6xl md:text-7xl text-black dark:text-white leading-none tracking-tight mb-6">
        AI INVESTMENT <br />
        <span className="bg-electric-green text-black px-4 py-1 inline-block border-[4px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transform -rotate-1">
          RESEARCH AGENT
        </span>
      </h1>

      {/* Subtitle */}
      <p className="font-mono text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed">
        Research any company using AI and receive an <strong className="text-black dark:text-white underline decoration-hot-pink decoration-4">INVEST</strong> or <strong className="text-black dark:text-white underline decoration-purple decoration-4">PASS</strong> recommendation backed by deep financial analysis, market sentiment, valuation, risks, and reasoning.
      </p>

      {/* Big Search Bar Area */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 items-stretch mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-black dark:text-white">
            <Search size={22} />
          </div>
          <input
            type="text"
            placeholder="Search company or ticker... (e.g. Apple, TSLA)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleResearch(query)}
            className="w-full pl-12 pr-4 py-4 sm:py-5 bg-white dark:bg-[#1e1e1e] text-black dark:text-white border-[3.5px] border-black dark:border-white font-mono font-bold text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[7px_7px_0px_0px_rgba(255,255,255,1)] transition-all"
          />
        </div>
        
        <button
          onClick={() => handleResearch(query)}
          className="neo-btn font-space font-extrabold text-sm sm:text-base py-4 sm:py-5 px-8 flex items-center justify-center gap-2 hover:rotate-1 transform"
        >
          RESEARCH →
        </button>
      </div>

      {error && (
        <div className="bg-hot-pink text-white border-[3px] border-black p-3 mb-6 font-mono font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          ❌ {error}
        </div>
      )}

      {/* Examples Badges */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 font-bold">Try searching:</span>
        {examples.map((item) => (
          <button
            key={item.ticker}
            onClick={() => {
              setQuery(item.ticker);
              handleResearch(item.ticker);
            }}
            className="px-3 py-1 bg-white dark:bg-[#1e1e1e] hover:bg-sky-blue dark:hover:bg-sky-blue hover:text-black text-black dark:text-white border-[2.5px] border-black dark:border-white font-mono text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer select-none"
          >
            {item.name} ({item.ticker})
          </button>
        ))}
      </div>

    </section>
  );
}
