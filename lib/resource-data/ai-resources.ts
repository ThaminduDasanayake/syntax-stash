import { Tool } from "@/types";

import { CATEGORIES } from "./categories";

export const aiLinks: Tool[] = [
  {
    author: "Cloudflare",
    category: CATEGORIES.ai,
    description:
      "A self-hosted email client with an AI agent, running entirely on Cloudflare Workers.",
    favicon: "/github.svg",
    related: ["Open WebUI"],
    title: "agentic-inbox",
    url: "https://github.com/cloudflare/agentic-inbox",
  },
  {
    author: "The Swarm Corporation",
    category: CATEGORIES.ai,
    description:
      "Build your autonomous hedge fund in minutes. AutoHedge harnesses the power of swarm intelligence and AI agents to automate market analysis, risk management, and trade execution.",
    favicon: "/github.svg",
    related: ["Vibe-Trading", "Fincept Terminal"],
    title: "AutoHedge",
    url: "https://github.com/The-Swarm-Corporation/AutoHedge",
  },
  {
    category: CATEGORIES.ai,
    description:
      "The curated directory of Claude AI resources: the Claude Code 2.1 cheatsheet, agent skills, top MCP servers, plugins, SDKs and integrations for developers.",
    related: ["claude-ads", "OpenHands"],
    subtitle: "Claude AI Tools, Cheatsheet, Skills & MCP Servers",
    title: "Awesome Claude",
    url: "https://awesomeclaude.ai/",
  },
  {
    author: "Shubhamsaboo",
    category: CATEGORIES.ai,
    description: "100+ AI Agent & RAG apps you can actually run — clone, customize, ship.",
    favicon: "/github.svg",
    related: ["Langflow", "ollama/ollama"],
    title: "awesome-llm-apps",
    url: "https://github.com/Shubhamsaboo/awesome-llm-apps",
  },
  {
    category: CATEGORIES.ai,
    description:
      "78,000+ GitHub stars. Trusted by Fortune 500. The #1 open-source browser automation platform.",
    related: ["Crawl4AI", "jo-inc/camofox-browser"],
    subtitle: "The way AI uses the internet",
    title: "Browser Use",
    url: "https://browser-use.com/",
  },
  {
    author: "jo-inc",
    category: CATEGORIES.ai,
    description:
      "Stealth headless browser for AI agents — bypass Cloudflare, bot detection, and anti-scraping. Drop-in Puppeteer/Playwright replacement.",
    favicon: "/github.svg",
    related: ["Crawl4AI", "Browser Use - The way AI uses the internet"],
    title: "camofox-browser",
    url: "https://github.com/jo-inc/camofox-browser",
  },
  {
    author: "AgriciDaniel",
    category: CATEGORIES.ai,
    description:
      "Comprehensive paid advertising audit & optimization skill for Claude Code. 250+ checks across Google, Meta, YouTube, LinkedIn, TikTok, Microsoft & Apple Ads with weighted scoring, parallel agents, industry templates, and AI creative generation.",
    favicon: "/github.svg",
    related: ["Awesome Claude"],
    title: "claude-ads",
    url: "https://github.com/AgriciDaniel/claude-ads",
  },
  {
    category: CATEGORIES.ai,
    description: "Open-source LLM-Friendly Web Crawler & Scraper",
    related: ["Maxun", "Browser Use - The way AI uses the internet", "jo-inc/camofox-browser"],
    tags: ["crawler", "scraper", "open-source", "llm"],
    title: "Crawl4AI",
    url: "https://docs.crawl4ai.com/",
  },
  {
    category: CATEGORIES.ai,
    description:
      "Unlock agentic workflow with Dify. Develop, deploy, and manage autonomous agents, RAG pipelines, and more for teams at any scale, effortlessly.",
    related: ["Langflow", "Unstructured - Unstructured Data Platform for GenAI"],
    subtitle: "Leading Agentic Workflow Builder",
    title: "Dify",
    url: "https://dify.ai/",
  },
  {
    author: "Fincept Corporation",
    category: CATEGORIES.ai,
    description:
      "FinceptTerminal is a modern finance application offering advanced market analytics, investment research, and economic data tools, designed for interactive exploration and data-driven decision-making in a user-friendly environment.",
    favicon: "/github.svg",
    related: ["AutoHedge", "Vibe-Trading"],
    title: "Fincept Terminal",
    url: "https://github.com/Fincept-Corporation/FinceptTerminal",
  },
  {
    author: "heygen-com",
    category: CATEGORIES.ai,
    description: "Write HTML. Render video. Built for agents.",
    favicon: "/github.svg",
    related: ["Anil-matcha/Open-Generative-AI"],
    title: "hyperframes",
    url: "https://github.com/heygen-com/hyperframes",
  },
  {
    author: "Langflow",
    category: CATEGORIES.ai,
    description:
      "Low-code AI builder for agentic and RAG applications. Build AI applications with ease",
    details: [
      {
        content:
          "A visual framework for building multi-agent and RAG applications. It’s open-source and provides a drag-and-drop UI to compose LLMs, vector stores, and prompt templates easily.",
        title: "WHAT IT IS",
      },
      {
        content:
          "Building custom ChatGPT-like bots and AI workflows typically requires heavy Python scripting (LangChain/LlamaIndex). Langflow reduces this to a visual node-based experience, drastically speeding up prototyping and deployment for teams.",
        title: "IN THE AGE OF AI",
      },
    ],
    related: ["Dify", "OpenHands"],
    tags: ["low-code", "rag", "agents", "builder"],
    title: "Langflow",
    url: "https://www.langflow.org/",
  },
  {
    category: CATEGORIES.ai,
    description:
      "The easiest AI-powered  web scraping, crawling, extraction, search platform. The best open-source Browse AI alternative.",
    related: ["Crawl4AI", "jo-inc/camofox-browser"],
    subtitle: "Scrape, Extract, Crawl, Search Web Data With No-Code",
    title: "Maxun",
    url: "https://www.maxun.dev/",
  },
  {
    author: "Anil-matcha",
    category: CATEGORIES.ai,
    description:
      "Open-source alternative to AI video platforms — Free AI image & video generation studio with 200+ models (Flux, Midjourney, Kling, Sora, Veo). No content filters. Self-hosted, MIT licensed.",
    favicon: "/github.svg",
    related: ["heygen-com/hyperframes", "Open-LLM-VTuber/Open-LLM-VTuber"],
    title: "Open-Generative-AI",
    url: "https://github.com/Anil-matcha/Open-Generative-AI",
  },
  {
    author: "OpenHands",
    authorLink: "https://github.com/OpenHands",
    category: CATEGORIES.ai,
    description:
      "Meet OpenHands, the open-source, model-agnostic platform for cloud coding agents. Automate real engineering work securely and transparently. Build faster with full control.",
    favicon: "/github.svg",
    related: ["Awesome Claude", "Langflow"],
    subtitle: "The Open Platform for Cloud Coding Agents",
    title: "OpenHands",
    url: "https://www.openhands.dev/",
  },
  {
    author: "Ollama",
    category: CATEGORIES.ai,
    description:
      "Get up and running with Kimi-K2.6, GLM-5.1, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma and other models.",
    favicon: "/github.svg",
    related: ["Open WebUI", "Shubhamsaboo/awesome-llm-apps"],
    title: "ollama",
    url: "https://github.com/ollama/ollama",
  },
  {
    author: "Open-LLM-VTuber",
    category: CATEGORIES.ai,
    description:
      "Talk to any LLM with hands-free voice interaction, voice interruption, and Live2D taking face running locally across platforms.",
    favicon: "/github.svg",
    related: ["openai/whisper", "Anil-matcha/Open-Generative-AI"],
    title: "Open-LLM-VTuber",
    url: "https://github.com/Open-LLM-VTuber/Open-LLM-VTuber",
  },
  {
    author: "Open WebUI Team",
    category: CATEGORIES.ai,
    description:
      "Run AI on your own terms. Connect any model, extend with code, protect what matters—without compromise.",
    details: [
      {
        content:
          "If you want the ChatGPT Plus experience but fully offline or pointing to your own local models (like Llama 3 via Ollama), this is the definitive UI. It supports multiple users, RAG document uploading, and full API integrations.",
        title: "WHY USE THIS",
      },
      {
        content:
          "By self-hosting your AI stack, no corporate entity can use your chats for training data. Your local documents and conversations remain strictly on your own hardware.",
        title: "PRIVACY FOCUS",
      },
    ],
    related: ["ollama/ollama", "Unstructured - Unstructured Data Platform for GenAI"],
    subtitle: "Self-Hosted AI Platform",
    tags: ["self-hosted", "llm", "ui", "platform"],
    title: "Open WebUI",
    url: "https://openwebui.com/",
  },
  {
    category: CATEGORIES.ai,
    description:
      "Transform complex, unstructured data into clean, AI-ready inputs. Connect to any source, process 64+ file types, and power your GenAI projects. Start now.",
    related: ["Open WebUI", "Dify"],
    subtitle: "Unstructured Data Platform for GenAI",
    title: "Unstructured",
    url: "https://unstructured.io/",
  },
  {
    author: "HKUDS",
    category: CATEGORIES.ai,
    description: "Vibe-Trading: Your Personal Trading Agent",
    favicon: "/github.svg",
    related: ["AutoHedge", "Fincept Terminal"],
    title: "Vibe-Trading",
    url: "https://github.com/HKUDS/Vibe-Trading",
  },
  {
    author: "OpenAI",
    category: CATEGORIES.ai,
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    favicon: "/github.svg",
    related: ["Open-LLM-VTuber/Open-LLM-VTuber"],
    title: "whisper",
    url: "https://github.com/openai/whisper",
  },
];
