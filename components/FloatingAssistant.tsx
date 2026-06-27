"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { MessageSquare, Bot, X, Send, Sparkles } from "lucide-react";

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const { assistantMessages, addAssistantMessage, setQuery, setActiveTab } = useStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [assistantMessages, isOpen]);

  const suggestions = [
    { text: "Try Microsoft", action: "MSFT" },
    { text: "Compare Apple vs Google", reply: "Apple (AAPL) dominates consumer lock-in with a 31x P/E, while Google (GOOGL) has strong advertising and AI search scale trading around 23x P/E. AAPL is safer for ecosystem compounders; GOOGL offers higher margin digital advertisement leverage." },
    { text: "Best AI Stocks", reply: "NVIDIA (NVDA) for GPU chips, Microsoft (MSFT) for enterprise SaaS integration, Broadcom (AVGO) for custom silicon, and Amazon (AMZN) for AWS cloud scalability." },
    { text: "Highest Growth Companies", reply: "NVIDIA (NVDA) is growing data center revenues at 150%+. Eli Lilly (LLY) shows massive growth on GLP-1 metrics, and CrowdStrike (CRWD) continues expanding cybersecurity ARR." }
  ];

  const handleSend = (text: string, replyText?: string) => {
    if (!text.trim()) return;

    // Add user message
    addAssistantMessage({ sender: "user", text });
    setInputVal("");

    // Simulate thinking and reply
    setTimeout(() => {
      let finalReply = "";

      if (replyText) {
        finalReply = replyText;
      } else {
        const lower = text.toLowerCase();
        if (lower.includes("microsoft") || lower.includes("msft")) {
          finalReply = "Microsoft (MSFT) is a tier-1 INVEST candidate. We recommend analyzing their Azure cloud growth and Copilot commercial licensing expansion on the main dashboard.";
        } else if (lower.includes("apple") || lower.includes("aapl")) {
          finalReply = "Apple (AAPL) is supported by stable Services margins. Look out for the Apple Intelligence hardware upgrade cycle in their financial statements.";
        } else if (lower.includes("tesla") || lower.includes("tsla")) {
          finalReply = "Tesla (TSLA) is currently rated PASS due to EV price compressions and valuation premium. Check out the risk metrics on our dashboard for the full breakdown.";
        } else {
          finalReply = "I've analyzed your question. As an AI Investment Agent, I suggest checking out our comprehensive dashboard reports for tickers like AAPL, MSFT, TSLA, and NVDA to compare their valuations and moat qualities.";
        }
      }

      addAssistantMessage({ sender: "agent", text: finalReply });
    }, 800);
  };

  const handleSuggestionClick = (sug: typeof suggestions[number]) => {
    if (sug.action) {
      addAssistantMessage({ sender: "user", text: `Analyze ${sug.action}` });
      setQuery(sug.action);
      setActiveTab("research");
      setIsOpen(false);
      
      // Auto reply in chat
      setTimeout(() => {
        addAssistantMessage({ sender: "agent", text: `I am now running the LangGraph analysis pipeline for ${sug.action}. Please check the main search interface!` });
      }, 500);
    } else if (sug.reply) {
      handleSend(sug.text, sug.reply);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-bright-yellow text-black border-[3.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center cursor-pointer select-none"
          aria-label="Open AI Assistant"
        >
          <Bot size={28} />
        </button>
      )}

      {/* Expanded Chat Assistant Card */}
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] h-[500px] bg-white dark:bg-[#1e1e1e] border-[3.5px] border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
          
          {/* Header */}
          <div className="bg-purple text-white p-4 border-b-[3.5px] border-black dark:border-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={22} className="text-black fill-bright-yellow" />
              <div>
                <span className="font-space font-extrabold text-sm uppercase block tracking-tight leading-none text-black">
                  AI CO-PILOT
                </span>
                <span className="font-mono text-xxs text-black/80 font-bold uppercase">
                  Agent Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center bg-white text-black border-[2px] border-black hover:bg-cream transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream dark:bg-zinc-900">
            {assistantMessages.map((msg, idx) => {
              const isAgent = msg.sender === "agent";
              return (
                <div
                  key={idx}
                  className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`
                      max-w-[85%] p-3 text-xs border-[2.5px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                      ${isAgent 
                        ? "bg-white text-black dark:bg-[#252525] dark:text-white dark:border-white" 
                        : "bg-electric-green text-black"
                      }
                    `}
                  >
                    <p className="leading-relaxed font-bold break-words">{msg.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-3 border-t-[2.5px] border-black dark:border-white bg-white dark:bg-[#1e1e1e] flex flex-wrap gap-1.5 max-h-[105px] overflow-y-auto">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(sug)}
                className="px-2 py-1 bg-cream dark:bg-zinc-800 border-[2px] border-black dark:border-white text-[10px] font-bold uppercase hover:bg-sky-blue hover:text-black transition-all cursor-pointer truncate max-w-full"
              >
                {sug.text}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t-[3.5px] border-black dark:border-white bg-white dark:bg-[#1e1e1e] flex gap-2">
            <input
              type="text"
              placeholder="Ask a financial question..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(inputVal)}
              className="flex-1 px-3 py-2 bg-cream dark:bg-zinc-800 text-black dark:text-white border-[2.5px] border-black dark:border-white text-xs font-bold focus:outline-none placeholder-gray-400"
            />
            <button
              onClick={() => handleSend(inputVal)}
              className="w-10 h-10 bg-bright-yellow text-black border-[2.5px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer"
            >
              <Send size={16} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
