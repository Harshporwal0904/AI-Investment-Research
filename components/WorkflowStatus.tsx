"use client";

import { useStore } from "@/store/useStore";
import { Check, Loader2, Sparkles, HelpCircle } from "lucide-react";

export default function WorkflowStatus() {
  const { workflowStep, query } = useStore();

  const steps = [
    { label: "User Query Received", desc: `Analyzing intent for "${query || "Stock"}"` },
    { label: "Collecting Financial Data", desc: "Fetching market cap, ratios, and price history" },
    { label: "Reading News & Sentiment", desc: "Aggregating articles, scraping social indicators" },
    { label: "Checking SEC Filings", desc: "Parsing latest 10-K and 10-Q filing details" },
    { label: "Analyzing Financial Ratios", desc: "Computing margins, ROE, valuation, and leverage" },
    { label: "Evaluating Risks & SWOT", desc: "Mapping weaknesses, opportunities, and risk profiles" },
    { label: "Making Investment Decision", desc: "Running recommendation consensus engine" },
    { label: "Generating Report & Charts", desc: "Compiling charts and finalizing AI reasoning" }
  ];

  // Visual accents for steps
  const stepColors = [
    "bg-sky-blue",
    "bg-purple",
    "bg-bright-yellow",
    "bg-hot-pink",
    "bg-electric-green",
    "bg-sky-blue",
    "bg-purple",
    "bg-electric-green"
  ];

  return (
    <div className="w-full max-w-lg mx-auto py-12 px-4">
      <div className="neo-card p-6 bg-white dark:bg-[#1e1e1e] mb-8 text-left">
        <h2 className="font-space font-extrabold text-xl mb-1 flex items-center gap-2">
          <Sparkles size={20} className="text-purple fill-purple dark:text-purple" />
          AI AGENT WORKFLOW RUNNING
        </h2>
        <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
          Watch the multi-agent LangGraph orchestration analyze {query || "your company"}.
        </p>
      </div>

      <div className="space-y-4 text-left">
        {steps.map((step, idx) => {
          const isCompleted = idx < workflowStep;
          const isCurrent = idx === workflowStep;
          const isPending = idx > workflowStep;

          return (
            <div key={idx} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div 
                  className={`absolute left-[22px] top-[44px] w-[4px] h-[24px] z-0 transition-all duration-300
                    ${isCompleted ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-700"}
                  `}
                />
              )}

              {/* Step Card */}
              <div 
                className={`
                  flex items-center gap-4 p-3.5 z-10 relative transition-all duration-300
                  ${isCurrent 
                    ? `neo-card ${stepColors[idx % stepColors.length]} text-black scale-102 -translate-y-0.5` 
                    : isCompleted
                      ? "bg-white dark:bg-[#252525] border-[3px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      : "bg-gray-100 dark:bg-[#181818] border-[3px] border-gray-300 dark:border-zinc-800 text-gray-400 dark:text-gray-600"
                  }
                `}
              >
                {/* Status Indicator */}
                <div 
                  className={`
                    w-10 h-10 flex items-center justify-center border-[2.5px] font-bold text-sm transition-all duration-300
                    ${isCompleted 
                      ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white" 
                      : isCurrent
                        ? "bg-white text-black border-black animate-pulse"
                        : "bg-transparent border-gray-300 dark:border-zinc-800"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3} />
                  ) : isCurrent ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <HelpCircle size={18} />
                  )}
                </div>

                {/* Step Details */}
                <div>
                  <h3 className={`font-space font-extrabold text-sm sm:text-base tracking-tight uppercase`}>
                    {step.label}
                  </h3>
                  <p className={`font-mono text-xxs sm:text-xs transition-colors duration-200
                    ${isCurrent ? "text-black/85" : isCompleted ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"}
                  `}>
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
