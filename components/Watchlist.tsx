"use client";

import { useStore } from "@/store/useStore";
import { Star, TrendingUp, TrendingDown, ArrowRight, Trash2 } from "lucide-react";

export default function Watchlist() {
  const { watchlist, setActiveReport, setActiveTab, removeFromWatchlist } = useStore();

  if (watchlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
          <Star size={48} className="mx-auto mb-4 text-bright-yellow fill-bright-yellow" />
          <h2 className="font-space font-extrabold text-2xl mb-2 text-black dark:text-white uppercase">
            YOUR WATCHLIST IS EMPTY
          </h2>
          <p className="font-mono text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
            Search for stocks in the research section and add them to your watchlist to track their AI recommendations.
          </p>
          <button
            onClick={() => setActiveTab("research")}
            className="neo-btn px-6 py-3 font-space font-extrabold text-xs uppercase"
          >
            START RESEARCHING →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-[slideUp_0.4s_ease-out]">
      <div>
        <h1 className="font-space font-extrabold text-3xl sm:text-4xl text-black dark:text-white uppercase mb-2">
          WATCHLIST
        </h1>
        <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
          Track and compare saved stock analyses and AI recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlist.map((report) => {
          const isInvest = report.decision === "INVEST";
          return (
            <div
              key={report.companyOverview.ticker}
              className="bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white p-5 flex flex-col justify-between shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-space font-extrabold text-xl text-black dark:text-white">
                      {report.companyOverview.ticker}
                    </span>
                    <span className="block font-mono text-xxs text-gray-500 truncate max-w-[150px]">
                      {report.companyOverview.name}
                    </span>
                  </div>
                  <span className={`
                    font-space font-extrabold text-xs uppercase px-2.5 py-1 border-[2.5px] border-black text-black
                    ${isInvest ? "bg-electric-green" : "bg-hot-pink text-white"}
                  `}>
                    {report.decision} ({report.confidenceScore}%)
                  </span>
                </div>

                {/* Grid Ratios */}
                <div className="grid grid-cols-2 gap-3 border-t-[2.5px] border-black dark:border-white pt-4 mb-6">
                  <div>
                    <span className="block font-mono text-xxs text-gray-500 uppercase font-bold">Market Cap</span>
                    <span className="font-mono font-bold text-xs text-black dark:text-white">
                      {report.companyOverview.marketCap}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-xxs text-gray-500 uppercase font-bold">P/E Ratio</span>
                    <span className="font-mono font-bold text-xs text-black dark:text-white">
                      {report.financialHealth.peRatio}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-xxs text-gray-500 uppercase font-bold">Free Cash Flow</span>
                    <span className="font-mono font-bold text-xs text-black dark:text-white">
                      {report.financialHealth.freeCashFlow}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-xxs text-gray-500 uppercase font-bold">Risk Level</span>
                    <span className="font-mono font-bold text-xs text-black dark:text-white">
                      {report.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveReport(report);
                    setActiveTab("dashboard");
                  }}
                  className="flex-1 neo-btn py-2 text-xxs uppercase flex items-center justify-center gap-1 bg-sky-blue"
                >
                  VIEW REPORT <ArrowRight size={12} />
                </button>
                <button
                  onClick={() => removeFromWatchlist(report.companyOverview.ticker)}
                  className="px-3 bg-hot-pink text-white border-[3px] border-black dark:border-white hover:bg-red-600 transition-all flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
