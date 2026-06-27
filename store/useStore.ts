import { create } from "zustand";

export interface CompanyReport {
  decision: "INVEST" | "PASS";
  confidenceScore: number;
  reason: string[];
  companyOverview: {
    name: string;
    industry: string;
    founded: string;
    ceo: string;
    marketCap: string;
    employees: string;
    headquarters: string;
    exchange: string;
    ticker: string;
  };
  financialHealth: {
    revenue: string;
    profit: string;
    eps: string;
    peRatio: string;
    roe: string;
    debtEquity: string;
    freeCashFlow: string;
    operatingMargin: string;
  };
  growthCharts: {
    revenueGrowth: { year: string; value: number }[];
    netIncome: { year: string; value: number }[];
    operatingCashFlow: { year: string; value: number }[];
    epsTrend: { year: string; value: number }[];
  };
  aiReasoning: {
    strengths: string[];
    weaknesses: string[];
    growthDrivers: string[];
    risks: string[];
    competitiveAdvantage: string;
    valuationOpinion: string;
    marketSentiment: string;
    finalRecommendation: string;
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  timeline: { year: string; event: string }[];
  news: { headline: string; source: string; date: string; sentiment: "positive" | "neutral" | "negative" }[];
  riskLevel: "Low" | "Medium" | "High";
  investmentScore: number;
  researchedAt?: string;
}

interface Message {
  sender: "user" | "agent";
  text: string;
}

interface AppState {
  activeTab: "dashboard" | "research" | "watchlist" | "history";
  setActiveTab: (tab: "dashboard" | "research" | "watchlist" | "history") => void;
  query: string;
  setQuery: (query: string) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (status: boolean) => void;
  workflowStep: number;
  setWorkflowStep: (step: number) => void;
  activeReport: CompanyReport | null;
  setActiveReport: (report: CompanyReport | null) => void;
  watchlist: CompanyReport[];
  addToWatchlist: (report: CompanyReport) => void;
  removeFromWatchlist: (ticker: string) => void;
  researchHistory: CompanyReport[];
  addToHistory: (report: CompanyReport) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  assistantMessages: Message[];
  addAssistantMessage: (message: Message) => void;
  clearAssistantMessages: () => void;
}

export const useStore = create<AppState>((set) => ({
  activeTab: "research",
  setActiveTab: (tab) => set({ activeTab: tab }),
  query: "",
  setQuery: (query) => set({ query }),
  isAnalyzing: false,
  setIsAnalyzing: (status) => set({ isAnalyzing: status }),
  workflowStep: 0,
  setWorkflowStep: (step) => set({ workflowStep: step }),
  activeReport: null,
  setActiveReport: (report) => set({ activeReport: report }),
  watchlist: [],
  addToWatchlist: (report) =>
    set((state) => {
      if (state.watchlist.some((item) => item.companyOverview.ticker === report.companyOverview.ticker)) {
        return state; // Already exists
      }
      return { watchlist: [report, ...state.watchlist] };
    }),
  removeFromWatchlist: (ticker) =>
    set((state) => ({
      watchlist: state.watchlist.filter((item) => item.companyOverview.ticker !== ticker),
    })),
  researchHistory: [],
  addToHistory: (report) =>
    set((state) => {
      const filtered = state.researchHistory.filter(
        (item) => item.companyOverview.ticker !== report.companyOverview.ticker
      );
      return {
        researchHistory: [
          { ...report, researchedAt: new Date().toLocaleDateString() },
          ...filtered,
        ],
      };
    }),
  darkMode: false,
  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.darkMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { darkMode: newMode };
    }),
  assistantMessages: [
    { sender: "agent", text: "Hello! I am your AI Investment Research Assistant. Ask me anything about stocks, financial ratios, or compare companies (e.g. AAPL vs MSFT)!" },
  ],
  addAssistantMessage: (msg) =>
    set((state) => ({ assistantMessages: [...state.assistantMessages, msg] })),
  clearAssistantMessages: () =>
    set({
      assistantMessages: [
        { sender: "agent", text: "Hello! I am your AI Investment Research Assistant. Ask me anything about stocks, financial ratios, or compare companies (e.g. AAPL vs MSFT)!" },
      ],
    }),
}));
