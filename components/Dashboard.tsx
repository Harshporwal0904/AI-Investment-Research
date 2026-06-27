"use client";

import { useEffect, useState } from "react";
import { useStore, CompanyReport } from "@/store/useStore";
import { 
  Star, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Building2, 
  Users, 
  Award,
  ChevronRight,
  TrendingDown,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from "recharts";

export default function Dashboard() {
  const { activeReport, watchlist, addToWatchlist, removeFromWatchlist } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeReasoningTab, setActiveReasoningTab] = useState<string>("strengths");

  // Prevent SSR issues with Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!activeReport) {
    return (
      <div className="text-center py-20">
        <p className="font-mono text-lg font-bold">No report loaded. Go back to research.</p>
      </div>
    );
  }

  const isSaved = watchlist.some(
    (item) => item.companyOverview.ticker === activeReport.companyOverview.ticker
  );

  const toggleWatchlist = () => {
    if (isSaved) {
      removeFromWatchlist(activeReport.companyOverview.ticker);
    } else {
      addToWatchlist(activeReport);
    }
  };

  // Convert risk level to needle rotation degree
  const getRiskNeedleRotation = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low": return -60;
      case "medium": return 0;
      case "high": return 60;
      default: return 0;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low": return "text-[#7CFF5B]";
      case "medium": return "text-[#FFD43B]";
      case "high": return "text-[#FF4D8D]";
      default: return "text-[#FFD43B]";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-[slideUp_0.4s_ease-out]">
      
      {/* Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
        <div>
          <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">RESEARCH REPORT FOR</span>
          <h1 className="font-space font-extrabold text-2xl sm:text-3xl tracking-tight text-black dark:text-white uppercase flex items-center gap-2">
            {activeReport.companyOverview.name} ({activeReport.companyOverview.ticker})
          </h1>
        </div>
        <button
          onClick={toggleWatchlist}
          className={`
            px-5 py-2.5 font-space font-extrabold text-xs sm:text-sm uppercase flex items-center gap-2 transition-all cursor-pointer border-[3.5px] border-black dark:border-white shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3.5px_3.5px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]
            ${isSaved 
              ? "bg-hot-pink text-white" 
              : "bg-bright-yellow text-black hover:bg-bright-yellow"
            }
          `}
        >
          <Star size={16} fill={isSaved ? "white" : "none"} />
          {isSaved ? "Saved in Watchlist" : "Add to Watchlist"}
        </button>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Decision Card */}
        <div className={`
          col-span-1 md:col-span-6 p-6 border-[3.5px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between
          ${activeReport.decision === "INVEST" 
            ? "bg-[#7CFF5B] text-black" 
            : "bg-[#FF4D8D] text-white"
          }
        `}>
          <div>
            <div className="flex justify-between items-start">
              <span className="font-space font-extrabold text-xs uppercase tracking-wider border-[2.5px] border-black px-2 py-0.5 bg-white text-black">
                AI Recommendation
              </span>
              <span className="font-space font-extrabold text-3xl sm:text-4xl">
                {activeReport.confidenceScore}% CONFIDENCE
              </span>
            </div>
            
            <h2 className="font-space font-extrabold text-5xl sm:text-6xl tracking-tighter mt-4 mb-4 select-none flex items-center gap-3">
              {activeReport.decision === "INVEST" ? "INVEST ✅" : "PASS ❌"}
            </h2>

            <div className="space-y-2 mt-4">
              <span className="font-mono text-xs font-bold uppercase underline">Key Rationale:</span>
              <ul className="list-none space-y-1.5 font-mono text-xs sm:text-sm">
                {activeReport.reason.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-extrabold select-none">→</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Investment Score Card */}
        <div className="col-span-1 sm:col-span-6 md:col-span-3 p-6 bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col items-center justify-between">
          <span className="font-space font-extrabold text-xs uppercase tracking-wider text-black dark:text-white border-[2.5px] border-black dark:border-white px-2 py-0.5 self-start bg-cream dark:bg-zinc-800">
            Investment Score
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center my-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="62"
                strokeWidth="12"
                stroke="var(--border-color)"
                fill="transparent"
                className="opacity-10"
              />
              <circle
                cx="72"
                cy="72"
                r="62"
                strokeWidth="12"
                stroke={activeReport.decision === "INVEST" ? "#7CFF5B" : "#FF4D8D"}
                fill="transparent"
                strokeDasharray={2 * Math.PI * 62}
                strokeDashoffset={2 * Math.PI * 62 * (1 - activeReport.investmentScore / 100)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-space font-extrabold text-4xl text-black dark:text-white">
                {activeReport.investmentScore}
              </span>
              <span className="font-mono text-xxs font-bold text-gray-500 uppercase">out of 100</span>
            </div>
          </div>

          <p className="font-mono text-xxs text-center text-gray-500 dark:text-gray-400">
            Aggregated metric from cloud execution pipelines and valuation calculations.
          </p>
        </div>

        {/* Risk Meter Card */}
        <div className="col-span-1 sm:col-span-6 md:col-span-3 p-6 bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col items-center justify-between">
          <span className="font-space font-extrabold text-xs uppercase tracking-wider text-black dark:text-white border-[2.5px] border-black dark:border-white px-2 py-0.5 self-start bg-cream dark:bg-zinc-800">
            Risk Profile
          </span>

          <div className="relative w-40 h-24 flex items-end justify-center overflow-hidden my-2">
            {/* Arch */}
            <svg className="w-full h-24">
              <path
                d="M 16 90 A 64 64 0 0 1 144 90"
                fill="none"
                stroke="#eee"
                strokeWidth="16"
                strokeLinecap="square"
                className="dark:stroke-zinc-800"
              />
              <path
                d="M 16 90 A 64 64 0 0 1 144 90"
                fill="none"
                stroke="url(#riskGradient)"
                strokeWidth="16"
                strokeLinecap="square"
              />
              <defs>
                <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7CFF5B" />
                  <stop offset="50%" stopColor="#FFD43B" />
                  <stop offset="100%" stopColor="#FF4D8D" />
                </linearGradient>
              </defs>
              {/* Center point pin */}
              <circle cx="80" cy="90" r="6" fill="var(--border-color)" />
            </svg>

            {/* Needle */}
            <div 
              className="absolute left-[calc(50%-4px)] bottom-[10px] w-2 h-16 bg-black dark:bg-white needle-rotate"
              style={{ transform: `rotate(${getRiskNeedleRotation(activeReport.riskLevel)}deg)` }}
            />
          </div>

          <div className="text-center">
            <span className={`font-space font-extrabold text-2xl uppercase ${getRiskColor(activeReport.riskLevel)}`}>
              {activeReport.riskLevel} RISK
            </span>
          </div>

          <div className="w-full flex justify-between font-mono text-xxs font-bold text-gray-500 uppercase px-2">
            <span>Low</span>
            <span>Med</span>
            <span>High</span>
          </div>
        </div>

      </div>

      {/* Company Overview Card */}
      <div className="p-6 bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
        <h2 className="font-space font-extrabold text-xl uppercase border-b-[3.5px] border-black dark:border-white pb-3 mb-6 flex items-center gap-2">
          <Building2 size={20} className="text-sky-blue" />
          Company Overview
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          <div className="border-l-[3.5px] border-purple pl-3 py-1">
            <span className="block font-mono text-xxs text-gray-500 uppercase font-bold">CEO</span>
            <span className="font-mono font-bold text-sm text-black dark:text-white truncate">{activeReport.companyOverview.ceo}</span>
          </div>
          
          <div className="border-l-[3.5px] border-hot-pink pl-3 py-1">
            <span className="block font-mono text-xxs text-gray-500 uppercase font-bold">Market Capitalization</span>
            <span className="font-mono font-bold text-sm text-black dark:text-white">{activeReport.companyOverview.marketCap}</span>
          </div>

          <div className="border-l-[3.5px] border-bright-yellow pl-3 py-1">
            <span className="block font-mono text-xxs text-gray-500 uppercase font-bold">Sector / Industry</span>
            <span className="font-mono font-bold text-sm text-black dark:text-white truncate">{activeReport.companyOverview.industry}</span>
          </div>

          <div className="border-l-[3.5px] border-electric-green pl-3 py-1">
            <span className="block font-mono text-xxs text-gray-500 uppercase font-bold">HQ Location</span>
            <span className="font-mono font-bold text-sm text-black dark:text-white truncate">{activeReport.companyOverview.headquarters}</span>
          </div>

          <div className="border-l-[3.5px] border-sky-blue pl-3 py-1">
            <span className="block font-mono text-xxs text-gray-500 uppercase font-bold">Founded / Exchange</span>
            <span className="font-mono font-bold text-sm text-black dark:text-white truncate">
              {activeReport.companyOverview.founded} | {activeReport.companyOverview.exchange}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Health Cards */}
      <div>
        <h2 className="font-space font-extrabold text-xl uppercase mb-6 flex items-center gap-2">
          <Award size={20} className="text-hot-pink" />
          Financial Health Metrics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Revenue", value: activeReport.financialHealth.revenue, color: "border-purple" },
            { label: "Net Profit", value: activeReport.financialHealth.profit, color: "border-electric-green" },
            { label: "Earnings Per Share", value: activeReport.financialHealth.eps, color: "border-sky-blue" },
            { label: "P/E Ratio", value: activeReport.financialHealth.peRatio, color: "border-hot-pink" },
            { label: "ROE", value: activeReport.financialHealth.roe, color: "border-bright-yellow" },
            { label: "Debt / Equity", value: activeReport.financialHealth.debtEquity, color: "border-purple" },
            { label: "Free Cash Flow", value: activeReport.financialHealth.freeCashFlow, color: "border-electric-green" },
            { label: "Operating Margin", value: activeReport.financialHealth.operatingMargin, color: "border-sky-blue" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-4px] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[7px_7px_0px_0px_rgba(255,255,255,1)] transition-all duration-200`}
            >
              <div className={`border-l-[4px] ${item.color} pl-2.5`}>
                <span className="block font-mono text-xxs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-tight mb-1">{item.label}</span>
                <span className="block font-space font-extrabold text-xl sm:text-2xl text-black dark:text-white tracking-tight">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Charts */}
      <div>
        <h2 className="font-space font-extrabold text-xl uppercase mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-electric-green" />
          Growth Trends (5-Year Historical & Estimates)
        </h2>

        {mounted ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Revenue & Net Income (Bar Chart) */}
            <div className="p-6 bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="font-space font-extrabold text-base uppercase mb-4 text-black dark:text-white">
                Revenue Growth ($ Billions)
              </h3>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={activeReport.growthCharts.revenueGrowth}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.1)" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      stroke="var(--foreground)" 
                      tick={{ fill: "var(--foreground)", fontWeight: "bold", fontFamily: "var(--font-mono)", fontSize: 10 }}
                    />
                    <YAxis 
                      stroke="var(--foreground)" 
                      tick={{ fill: "var(--foreground)", fontWeight: "bold", fontFamily: "var(--font-mono)", fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card-bg)",
                        border: "3px solid var(--border-color)",
                        fontFamily: "var(--font-mono)",
                        fontWeight: "bold",
                        color: "var(--foreground)"
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#A259FF" 
                      stroke="#000" 
                      strokeWidth={2.5}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Operating Cash Flow & EPS (Line Chart) */}
            <div className="p-6 bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="font-space font-extrabold text-base uppercase mb-4 text-black dark:text-white">
                EPS Trend ($)
              </h3>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={activeReport.growthCharts.epsTrend}
                    margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.1)" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      stroke="var(--foreground)" 
                      tick={{ fill: "var(--foreground)", fontWeight: "bold", fontFamily: "var(--font-mono)", fontSize: 10 }}
                    />
                    <YAxis 
                      stroke="var(--foreground)" 
                      tick={{ fill: "var(--foreground)", fontWeight: "bold", fontFamily: "var(--font-mono)", fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card-bg)",
                        border: "3px solid var(--border-color)",
                        fontFamily: "var(--font-mono)",
                        fontWeight: "bold",
                        color: "var(--foreground)"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#FF4D8D" 
                      strokeWidth={4.5}
                      dot={{ fill: "var(--foreground)", stroke: "var(--border-color)", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, strokeWidth: 2, stroke: "#000" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-64 flex items-center justify-center border-[3.5px] border-black dark:border-white bg-white dark:bg-[#1e1e1e]">
            <p className="font-mono font-bold">Loading interactive charts...</p>
          </div>
        )}
      </div>

      {/* AI Reasoning & SWOT Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* AI Reasoning Panel */}
        <div className="col-span-1 lg:col-span-7 p-6 bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
          <h2 className="font-space font-extrabold text-xl uppercase border-b-[3.5px] border-black dark:border-white pb-3 mb-4 flex items-center gap-2">
            <Info size={20} className="text-purple" />
            Why this decision? (AI Reasoning)
          </h2>

          {/* Reasoning Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "strengths", label: "Strengths", color: "bg-electric-green" },
              { id: "weaknesses", label: "Weaknesses", color: "bg-hot-pink" },
              { id: "drivers", label: "Drivers", color: "bg-bright-yellow" },
              { id: "risks", label: "Risks", color: "bg-purple" },
              { id: "conclusion", label: "Opinion", color: "bg-sky-blue" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveReasoningTab(tab.id)}
                className={`
                  px-3 py-1.5 font-space font-bold text-xs uppercase border-[2.5px] border-black dark:border-white transition-all duration-150 select-none cursor-pointer
                  ${activeReasoningTab === tab.id
                    ? `${tab.color} text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]`
                    : "bg-cream dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-100"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="font-mono text-xs sm:text-sm space-y-4">
            {activeReasoningTab === "strengths" && (
              <ul className="space-y-2">
                {activeReport.aiReasoning.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-electric-green font-extrabold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeReasoningTab === "weaknesses" && (
              <ul className="space-y-2">
                {activeReport.aiReasoning.weaknesses.map((wk, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-hot-pink font-extrabold">✗</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeReasoningTab === "drivers" && (
              <ul className="space-y-2">
                {activeReport.aiReasoning.growthDrivers.map((dr, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-bright-yellow font-extrabold">⚡</span>
                    <span>{dr}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeReasoningTab === "risks" && (
              <ul className="space-y-2">
                {activeReport.aiReasoning.risks.map((rsk, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-purple font-extrabold">⚠</span>
                    <span>{rsk}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeReasoningTab === "conclusion" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-space font-extrabold uppercase text-xs mb-1 text-sky-blue underline decoration-2">
                    Competitive Advantage:
                  </h4>
                  <p>{activeReport.aiReasoning.competitiveAdvantage}</p>
                </div>
                <div>
                  <h4 className="font-space font-extrabold uppercase text-xs mb-1 text-sky-blue underline decoration-2">
                    Valuation opinion:
                  </h4>
                  <p>{activeReport.aiReasoning.valuationOpinion}</p>
                </div>
                <div>
                  <h4 className="font-space font-extrabold uppercase text-xs mb-1 text-sky-blue underline decoration-2">
                    Final Recommendation:
                  </h4>
                  <p className="bg-cream dark:bg-zinc-800 p-2.5 border-[2px] border-black dark:border-white font-bold">
                    {activeReport.aiReasoning.finalRecommendation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SWOT Analysis */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-4 h-full">
            
            {/* Strengths Card */}
            <div className="p-4 bg-electric-green text-black border-[3.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <span className="font-space font-extrabold text-base uppercase">STRENGTHS</span>
              <ul className="list-none text-xxs font-mono font-bold space-y-1.5 mt-4">
                {activeReport.swot.strengths.slice(0, 3).map((item, i) => (
                  <li key={i} className="truncate">✔ {item}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses Card */}
            <div className="p-4 bg-hot-pink text-white border-[3.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <span className="font-space font-extrabold text-base uppercase">WEAKNESSES</span>
              <ul className="list-none text-xxs font-mono font-bold space-y-1.5 mt-4">
                {activeReport.swot.weaknesses.slice(0, 3).map((item, i) => (
                  <li key={i} className="truncate">✖ {item}</li>
                ))}
              </ul>
            </div>

            {/* Opportunities Card */}
            <div className="p-4 bg-bright-yellow text-black border-[3.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <span className="font-space font-extrabold text-base uppercase">OPPORTUNITIES</span>
              <ul className="list-none text-xxs font-mono font-bold space-y-1.5 mt-4">
                {activeReport.swot.opportunities.slice(0, 3).map((item, i) => (
                  <li key={i} className="truncate">✦ {item}</li>
                ))}
              </ul>
            </div>

            {/* Threats Card */}
            <div className="p-4 bg-purple text-white border-[3.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <span className="font-space font-extrabold text-base uppercase">THREATS</span>
              <ul className="list-none text-xxs font-mono font-bold space-y-1.5 mt-4">
                {activeReport.swot.threats.slice(0, 3).map((item, i) => (
                  <li key={i} className="truncate">⚠ {item}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>

      {/* Horizontal Milestones Timeline */}
      <div className="p-6 bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
        <h2 className="font-space font-extrabold text-xl uppercase border-b-[3.5px] border-black dark:border-white pb-3 mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-purple" />
          Company Milestones Timeline
        </h2>

        {/* Scrollable container */}
        <div className="overflow-x-auto pb-4 flex gap-6 snap-x">
          {activeReport.timeline.map((mile, i) => (
            <div 
              key={i} 
              className="min-w-[200px] sm:min-w-[240px] flex-shrink-0 bg-cream dark:bg-zinc-800 border-[3px] border-black dark:border-white p-4 snap-start shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
            >
              <span className="inline-block px-2.5 py-0.5 bg-hot-pink text-white font-space font-extrabold text-sm mb-3 border-[2px] border-black dark:border-white">
                {mile.year}
              </span>
              <p className="font-mono text-xs text-black dark:text-white leading-relaxed">
                {mile.event}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Latest News & Articles */}
      <div className="p-6 bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
        <h2 className="font-space font-extrabold text-xl uppercase border-b-[3.5px] border-black dark:border-white pb-3 mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-sky-blue" />
          Latest News & Sentiment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeReport.news.map((item, idx) => {
            const isPos = item.sentiment === "positive";
            const isNeg = item.sentiment === "negative";
            return (
              <div 
                key={idx}
                className="bg-cream dark:bg-zinc-800 border-[3.5px] border-black dark:border-white p-5 flex flex-col justify-between hover:scale-[1.02] hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3.5px_3.5px_0px_0px_rgba(255,255,255,1)]"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-xxs font-bold text-gray-500 uppercase">{item.source} • {item.date}</span>
                    <span className={`
                      font-space font-extrabold text-xxs uppercase px-2 py-0.5 border-[2px] border-black text-black
                      ${isPos 
                        ? "bg-electric-green" 
                        : isNeg 
                          ? "bg-hot-pink text-white" 
                          : "bg-bright-yellow"
                      }
                    `}>
                      {item.sentiment}
                    </span>
                  </div>
                  <h3 className="font-space font-extrabold text-sm sm:text-base leading-tight text-black dark:text-white uppercase mb-4">
                    {item.headline}
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-gray-500 flex items-center gap-1 group self-end">
                  READ ARTICLE <ChevronRight size={14} className="group-hover:translate-x-1 transition-all" />
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
