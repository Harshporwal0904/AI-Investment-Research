"use client";

import { useStore } from "@/store/useStore";
import { Clock, ArrowRight } from "lucide-react";

export default function History() {
  const { researchHistory, setActiveReport, setActiveTab } = useStore();

  if (researchHistory.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
          <Clock size={48} className="mx-auto mb-4 text-purple" />
          <h2 className="font-space font-extrabold text-2xl mb-2 text-black dark:text-white uppercase">
            NO RESEARCH HISTORY
          </h2>
          <p className="font-mono text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
            You haven't conducted any stock analyses yet. Once you search and run an AI compilation, it will appear here.
          </p>
          <button
            onClick={() => setActiveTab("research")}
            className="neo-btn px-6 py-3 font-space font-extrabold text-xs uppercase"
          >
            RUN FIRST SEARCH →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-[slideUp_0.4s_ease-out]">
      <div>
        <h1 className="font-space font-extrabold text-3xl sm:text-4xl text-black dark:text-white uppercase mb-2">
          RESEARCH HISTORY
        </h1>
        <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
          Revisit previous AI research evaluations and recommended outcomes.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] divide-y-[3px] divide-black dark:divide-white">
        {researchHistory.map((report, idx) => {
          const isInvest = report.decision === "INVEST";
          return (
            <div
              key={`${report.companyOverview.ticker}-${idx}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-cream dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-bright-yellow text-black border-[3px] border-black font-space font-extrabold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {report.companyOverview.ticker}
                </div>
                <div>
                  <h3 className="font-space font-extrabold text-base text-black dark:text-white uppercase">
                    {report.companyOverview.name}
                  </h3>
                  <span className="font-mono text-xxs text-gray-500 dark:text-gray-400">
                    Researched on {report.researchedAt || "today"} • {report.companyOverview.industry}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Decision Tag */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xxs font-bold text-gray-500 uppercase">Decision:</span>
                  <span className={`
                    font-space font-extrabold text-xs uppercase px-2 py-0.5 border-[2px] border-black text-black
                    ${isInvest ? "bg-electric-green" : "bg-hot-pink text-white"}
                  `}>
                    {report.decision} ({report.confidenceScore}%)
                  </span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xxs font-bold text-gray-500 uppercase">Score:</span>
                  <span className="font-space font-extrabold text-sm text-black dark:text-white">
                    {report.investmentScore}/100
                  </span>
                </div>

                {/* Load Button */}
                <button
                  onClick={() => {
                    setActiveReport(report);
                    setActiveTab("dashboard");
                  }}
                  className="neo-btn py-1.5 px-4 text-xxs uppercase flex items-center gap-1 bg-sky-blue"
                >
                  LOAD ANALYSIS <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
