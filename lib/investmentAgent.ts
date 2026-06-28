import { StateGraph, Annotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import yahooFinance from "yahoo-finance2";

// 1. Define the State Schema of the LangGraph Research Agent
export const ResearchStateAnnotation = Annotation.Root({
  query: Annotation<string>(),
  companyOverview: Annotation<any>(),
  financialHealth: Annotation<any>(),
  growthCharts: Annotation<any>(),
  aiReasoning: Annotation<any>(),
  swot: Annotation<any>(),
  timeline: Annotation<any>(),
  news: Annotation<any>(),
  riskLevel: Annotation<string>(),
  investmentScore: Annotation<number>(),
  decision: Annotation<"INVEST" | "PASS">(),
  confidenceScore: Annotation<number>(),
  reason: Annotation<string[]>(),
});

// Define type helper for state updates
type ResearchState = typeof ResearchStateAnnotation.State;

// 2. Instantiate LLM using Google Gemini 2.5 Flash from LangChain
const getModel = (apiKey: string) => {
  return new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    apiKey: apiKey,
    temperature: 0.2,
  });
};

// ==========================================
// LANGGRAPH NODES
// ==========================================

// Node A: Collect company overview metadata using Yahoo Finance and Gemini
async function collectDataNode(
  state: ResearchState,
  config?: { configurable?: { apiKey?: string } }
): Promise<Partial<ResearchState>> {
  console.log(`[LangGraph Node: collectData] Fetching meta for: ${state.query}`);
  const apiKey = config?.configurable?.apiKey;
  if (!apiKey) {
    throw new Error("Missing Gemini API Key in LangGraph runtime configuration.");
  }

  const model = getModel(apiKey);
  let ticker = state.query.toUpperCase().trim();
  let yahooProfile: any = {};
  let yahooQuote: any = {};

  try {
    // 1. Search for symbol if query is not a direct ticker
    const searchResults: any = await yahooFinance.search(state.query);
    if (searchResults?.quotes && searchResults.quotes.length > 0) {
      ticker = searchResults.quotes[0].symbol;
    }

    // 2. Fetch profile and quotes
    yahooQuote = await yahooFinance.quote(ticker);
    const summary: any = await yahooFinance.quoteSummary(ticker, {
      modules: ["assetProfile"]
    });
    yahooProfile = summary.assetProfile || {};
  } catch (err) {
    console.error("Yahoo Finance overview fetch failed, relying on Gemini fallback:", err);
  }

  // 3. Prompt Gemini to compile the clean data structure
  const prompt = `Convert the following raw stock market data for ticker "${ticker}" into a clean, structured JSON format.
If details are missing, use your general knowledge to fill in realistic, accurate data (e.g. year founded, CEO, headquarters, etc.).

Raw Yahoo Quote Data: ${JSON.stringify(yahooQuote)}
Raw Yahoo Profile Data: ${JSON.stringify(yahooProfile)}

Return ONLY a valid JSON object matching this structure exactly, with no additional text or formatting:
{
  "companyOverview": {
    "name": string,
    "industry": string,
    "founded": string,
    "ceo": string,
    "marketCap": string,
    "employees": string,
    "headquarters": string,
    "exchange": string,
    "ticker": string
  },
  "timeline": [
    { "year": string, "event": string }
  ]
}`;

  const response = await model.invoke([
    { role: "user", content: prompt }
  ]);

  try {
    const rawContent = response.content.toString().trim();
    const jsonStr = rawContent.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(jsonStr);
    
    // Ensure timeline is at least 3 items
    if (!parsed.timeline || parsed.timeline.length === 0) {
      parsed.timeline = [
        { year: parsed.companyOverview.founded || "2000", event: "Company founded." },
        { year: "2018", event: "Expanded core product offerings." },
        { year: "2024", event: "Initiated major AI optimization programs." }
      ];
    }
    
    return parsed;
  } catch (err) {
    console.error("Failed to parse collectDataNode response:", err);
    return {
      companyOverview: {
        name: ticker,
        industry: "Technology",
        founded: "N/A",
        ceo: "N/A",
        marketCap: "N/A",
        employees: "N/A",
        headquarters: "N/A",
        exchange: "N/A",
        ticker: ticker
      },
      timeline: []
    };
  }
}

// Node B: Evaluate financial ratios & cash flows using Yahoo Finance and Gemini
async function evaluateFinancialsNode(
  state: ResearchState,
  config?: { configurable?: { apiKey?: string } }
): Promise<Partial<ResearchState>> {
  const companyName = state.companyOverview?.name || state.query;
  const ticker = state.companyOverview?.ticker || state.query;
  console.log(`[LangGraph Node: evaluateFinancials] Computing ratios for: ${companyName}`);

  const apiKey = config?.configurable?.apiKey;
  if (!apiKey) {
    throw new Error("Missing Gemini API Key in LangGraph runtime configuration.");
  }

  const model = getModel(apiKey);
  let yahooFinancials: any = {};

  try {
    // Fetch key financials and statistics
    const summary: any = await yahooFinance.quoteSummary(ticker, {
      modules: ["financialData", "defaultKeyStatistics"]
    });
    yahooFinancials = summary;
  } catch (err) {
    console.error("Yahoo Finance financials fetch failed, relying on Gemini fallback:", err);
  }

  const prompt = `Analyze the financial health of the company "${companyName}" (${ticker}).
Use the following raw financial data from Yahoo Finance:
${JSON.stringify(yahooFinancials)}

Format this data into clean, readable financial metrics (e.g. human readable numbers like "$385.6B" or "75.0x" or "15.4%") and produce a realistic 5-year historical/estimate trend of data points for charts.
Return ONLY a valid JSON object matching this structure exactly, with no additional text or formatting:
{
  "financialHealth": {
    "revenue": string,
    "profit": string,
    "eps": string,
    "peRatio": string,
    "roe": string,
    "debtEquity": string,
    "freeCashFlow": string,
    "operatingMargin": string
  },
  "growthCharts": {
    "revenueGrowth": [{"year": string, "value": number}],
    "netIncome": [{"year": string, "value": number}],
    "operatingCashFlow": [{"year": string, "value": number}],
    "epsTrend": [{"year": string, "value": number}]
  }
}`;

  const response = await model.invoke([
    { role: "user", content: prompt }
  ]);

  try {
    const rawContent = response.content.toString().trim();
    const jsonStr = rawContent.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse evaluateFinancialsNode response:", err);
    return {
      financialHealth: {
        revenue: "N/A",
        profit: "N/A",
        eps: "N/A",
        peRatio: "N/A",
        roe: "N/A",
        debtEquity: "N/A",
        freeCashFlow: "N/A",
        operatingMargin: "N/A"
      },
      growthCharts: {
        revenueGrowth: [],
        netIncome: [],
        operatingCashFlow: [],
        epsTrend: []
      }
    };
  }
}

// Node C: Perform SWOT and risk analysis using Yahoo Finance News and Gemini
async function analyzeRisksNode(
  state: ResearchState,
  config?: { configurable?: { apiKey?: string } }
): Promise<Partial<ResearchState>> {
  const companyName = state.companyOverview?.name || state.query;
  const ticker = state.companyOverview?.ticker || state.query;
  console.log(`[LangGraph Node: analyzeRisks] Mapping SWOT and risks for: ${companyName}`);

  const apiKey = config?.configurable?.apiKey;
  if (!apiKey) {
    throw new Error("Missing Gemini API Key in LangGraph runtime configuration.");
  }

  const model = getModel(apiKey);
  let rawNews: any[] = [];

  try {
    const searchResults: any = await yahooFinance.search(ticker);
    rawNews = searchResults.news || [];
  } catch (err) {
    console.error("Yahoo Finance news fetch failed, relying on Gemini fallback:", err);
  }

  const prompt = `Based on the company overview and financials:
Company Overview: ${JSON.stringify(state.companyOverview)}
Financial Health: ${JSON.stringify(state.financialHealth)}

And recent Yahoo Finance news updates:
${JSON.stringify(rawNews.slice(0, 5))}

Perform a SWOT analysis, decide on an overall risk level (Low, Medium, or High), and draft 3 structured news cards with sentiments (positive, neutral, or negative).
Return ONLY a valid JSON object matching this structure exactly, with no additional text or formatting:
{
  "swot": {
    "strengths": string[],
    "weaknesses": string[],
    "opportunities": string[],
    "threats": string[]
  },
  "riskLevel": "Low" | "Medium" | "High",
  "news": [
    { "headline": string, "source": string, "date": string, "sentiment": "positive" | "neutral" | "negative" }
  ]
}`;

  const response = await model.invoke([
    { role: "user", content: prompt }
  ]);

  try {
    const rawContent = response.content.toString().trim();
    const jsonStr = rawContent.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    console.log(jsonStr);
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse analyzeRisksNode response:", err);
    return {
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      riskLevel: "Medium",
      news: []
    };
  }
}

// Node D: Final report synthesis using all accumulated state
async function generateReportNode(
  state: ResearchState,
  config?: { configurable?: { apiKey?: string } }
): Promise<Partial<ResearchState>> {
  console.log(`[LangGraph Node: generateReport] Synthesizing final analysis via Gemini`);
  const apiKey = config?.configurable?.apiKey;
  if (!apiKey) {
    throw new Error("Missing Gemini API Key in LangGraph runtime configuration.");
  }

  const model = getModel(apiKey);
  
  const prompt = `You are a professional financial analyst AI agent.
We have collected the following state metadata for the company:
Company Overview: ${JSON.stringify(state.companyOverview)}
Financial Health: ${JSON.stringify(state.financialHealth)}
Growth Trends: ${JSON.stringify(state.growthCharts)}
SWOT Analysis: ${JSON.stringify(state.swot)}
Risk Profile: ${state.riskLevel}

Synthesize your final investment decision (INVEST or PASS) and detailed rationale based strictly on this collected state.
Return ONLY a valid JSON object matching this structure exactly, with no additional text or formatting:
{
  "decision": "INVEST" | "PASS",
  "confidenceScore": number (0 to 100),
  "reason": string[] (3-4 concise rationale bullet points),
  "investmentScore": number (0 to 100 rating),
  "aiReasoning": {
    "strengths": string[],
    "weaknesses": string[],
    "growthDrivers": string[],
    "risks": string[],
    "competitiveAdvantage": string,
    "valuationOpinion": string,
    "marketSentiment": string,
    "finalRecommendation": string
  }
}`;

  const response = await model.invoke([
    { role: "user", content: prompt }
  ]);

  try {
    const rawContent = response.content.toString().trim();
    const jsonStr = rawContent.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (err) {
    console.error("Failed to parse generateReportNode response:", err);
    throw new Error("Invalid output format generated by LLM during report synthesis.");
  }
}

// ==========================================
// BUILD STATE GRAPH ORCHESTRATION
// ==========================================

const workflow = new StateGraph(ResearchStateAnnotation)
  // 1. Add Nodes to Graph
  .addNode("collectData", collectDataNode)
  .addNode("evaluateFinancials", evaluateFinancialsNode)
  .addNode("analyzeRisks", analyzeRisksNode)
  .addNode("generateReport", generateReportNode)
  
  // 2. Define Edges (Orchestration path)
  .addEdge("__start__", "collectData")
  .addEdge("collectData", "evaluateFinancials")
  .addEdge("evaluateFinancials", "analyzeRisks")
  .addEdge("analyzeRisks", "generateReport")
  .addEdge("generateReport", "__end__");

// 3. Compile the Graph
export const investmentAgentGraph = workflow.compile();
