import { StateGraph, Annotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

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
    model: "gemini-2.5-flash",
    apiKey: apiKey,
    temperature: 0.2,
  });
};

// ==========================================
// LANGGRAPH NODES
// ==========================================

// Node A: Collect company overview metadata
async function collectDataNode(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log(`[LangGraph Node: collectData] Fetching meta for: ${state.query}`);
  // In a production setup, you would query AlphaVantage, Yahoo Finance, or SEC EDGAR.
  // Here we return a skeleton that will be enriched by the LLM.
  return {
    query: state.query,
    timeline: [
      { year: "2015", event: "Standard service line expansions." },
      { year: "2020", event: "Migrated infrastructure to custom cloud modules." },
      { year: "2024", event: "Released global AI search features." }
    ]
  };
}

// Node B: Evaluate financial ratios & cash flows
async function evaluateFinancialsNode(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log(`[LangGraph Node: evaluateFinancials] Computing ratios for: ${state.query}`);
  return {
    financialHealth: {
      peRatio: "Calculating...",
      roe: "Calculating...",
      freeCashFlow: "Calculating..."
    }
  };
}

// Node C: Perform SWOT and risk analysis
async function analyzeRisksNode(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log(`[LangGraph Node: analyzeRisks] Mapping SWOT and risks for: ${state.query}`);
  return {
    riskLevel: "Medium"
  };
}

// Node D: Final report synthesis (calls Gemini model with structured output instructions)
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
  
  const systemPrompt = `You are a professional financial analyst AI agent. Analyze the requested company/ticker: "${state.query}".
Generate a complete investment report matching the following JSON structure EXACTLY:
{
  "decision": "INVEST" | "PASS",
  "confidenceScore": number (0 to 100),
  "reason": string[],
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
  },
  "aiReasoning": {
    "strengths": string[],
    "weaknesses": string[],
    "growthDrivers": string[],
    "risks": string[],
    "competitiveAdvantage": string,
    "valuationOpinion": string,
    "marketSentiment": string,
    "finalRecommendation": string
  },
  "swot": {
    "strengths": string[],
    "weaknesses": string[],
    "opportunities": string[],
    "threats": string[]
  },
  "timeline": [{"year": string, "event": string}],
  "news": [{"headline": string, "source": string, "date": string, "sentiment": "positive" | "neutral" | "negative"}],
  "riskLevel": "Low" | "Medium" | "High",
  "investmentScore": number
}

Analyze realistic current values. The chart arrays must have exactly 5 years. Return ONLY valid JSON.`;

  const response = await model.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Please generate the investment analysis report for: ${state.query}` }
  ]);

  try {
    const rawContent = response.content.toString().trim();
    let jsonStr = rawContent.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    
    // Clean trailing commas before close braces or close brackets
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, "$1");
    
    const result = JSON.parse(jsonStr);
    return result;
  } catch (err) {
    console.error("Failed to parse Gemini model response in LangGraph Node:", err);
    throw new Error("Invalid output format generated by LLM.");
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
