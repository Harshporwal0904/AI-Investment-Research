"use client";

import { useStore } from "@/store/useStore";
import { Sun, Moon, User, Sparkles } from "lucide-react";

export default function Navbar() {
  const { activeTab, setActiveTab, darkMode, toggleDarkMode, activeReport } = useStore();

  const navItems: { id: "research" | "dashboard" | "watchlist" | "history"; label: string; disabled: boolean }[] = [
    { id: "research", label: "Research", disabled: false },
    { id: "dashboard", label: "Dashboard", disabled: !activeReport },
    { id: "watchlist", label: "Watchlist", disabled: false },
    { id: "history", label: "History", disabled: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1e1e1e] border-b-[3.5px] border-black dark:border-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setActiveTab("research")}
        >
          <div className="bg-electric-green text-black neo-border-sm px-2.5 py-1 font-space font-extrabold text-lg flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <Sparkles size={18} className="fill-black" />
            <span>NEO.AI</span>
          </div>
          <span className="hidden sm:inline font-space font-extrabold text-xl tracking-tight">
            AI RESEARCH AGENT
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1.5 sm:gap-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isDisabled = item.disabled;
            
            return (
              <button
                key={item.id}
                disabled={isDisabled}
                onClick={() => setActiveTab(item.id)}
                className={`
                  px-3 py-1.5 font-space font-bold text-xs sm:text-sm uppercase transition-all duration-150 select-none
                  ${isDisabled 
                    ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600" 
                    : "cursor-pointer"
                  }
                  ${isActive && !isDisabled
                    ? "bg-hot-pink text-white border-[3px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]"
                    : "hover:bg-cream dark:hover:bg-zinc-800 text-black dark:text-white border-[3px] border-transparent"
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center bg-bright-yellow dark:bg-purple text-black dark:text-white border-[3px] border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all select-none cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} className="text-white" /> : <Moon size={18} />}
          </button>

          {/* GitHub Button */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 hidden sm:flex items-center justify-center bg-sky-blue text-black border-[3px] border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            aria-label="GitHub Repository"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>

          {/* Profile Avatar */}
          <div className="w-10 h-10 flex items-center justify-center bg-electric-green text-black border-[3px] border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
            <User size={18} />
          </div>
        </div>

      </div>
    </header>
  );
}
