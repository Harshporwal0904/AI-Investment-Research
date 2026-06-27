import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#1e1e1e] border-t-[3.5px] border-black dark:border-white py-12 px-4 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="bg-electric-green text-black px-2 py-0.5 border-[2px] border-black font-space font-extrabold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            NEO.AI
          </div>
          <span className="font-space font-extrabold text-sm tracking-tight text-black dark:text-white">
            AI INVESTMENT RESEARCH AGENT
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 font-mono text-xs font-bold uppercase text-black dark:text-white">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-hot-pink decoration-2">
            GitHub
          </a>
          <a href="#" className="hover:underline hover:text-purple decoration-2">
            Documentation
          </a>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-electric-green border-[1.5px] border-black rounded-full inline-block animate-pulse" />
            <span className="text-gray-500 dark:text-gray-400">API Status:</span>
            <span>Operational</span>
          </div>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          <span className="font-mono text-xxs font-bold text-gray-500 uppercase">Made with:</span>
          {[
            { name: "Next.js", color: "bg-white text-black border-black" },
            { name: "LangGraph", color: "bg-purple text-white border-black" },
            { name: "Gemini", color: "bg-sky-blue text-black border-black" },
            { name: "Tailwind CSS", color: "bg-electric-green text-black border-black" }
          ].map((tech) => (
            <span 
              key={tech.name} 
              className={`px-2 py-0.5 border-[2px] font-mono text-xxs font-extrabold shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,1)] ${tech.color}`}
            >
              {tech.name}
            </span>
          ))}
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t-[2.5px] border-dashed border-gray-300 dark:border-zinc-800 mt-8 pt-6 text-center">
        <p className="font-mono text-xxs text-gray-400 dark:text-zinc-600 font-bold uppercase">
          © {new Date().getFullYear()} Neo.AI Investment Research Agent. All rights reserved. Disclaimer: Financial research provided is for educational and demo purposes only. Not investment advice.
        </p>
      </div>
    </footer>
  );
}
