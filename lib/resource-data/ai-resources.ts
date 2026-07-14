import { Tool } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const aiLinks: Tool[] = [
  {
    title: "agentic-inbox",
    author: "Cloudflare",
    category: CATEGORIES.ai,
    description:
      "A self-hosted email client with an AI agent, running entirely on Cloudflare Workers.",
    favicon: "/github.svg",
    related: ["Open WebUI"],
    tags: [TAGS.ai],
    url: "https://github.com/cloudflare/agentic-inbox",
  },
  {
    title: "AI Engineering Hub",
    author: "patchy631",
    category: CATEGORIES.ai,
    description: "In-depth tutorials on LLMs, RAGs and real-world AI agent applications.",
    favicon: "/github.svg",
    tags: [TAGS.ai],
    url: "https://github.com/patchy631/ai-engineering-hub",
  },
  {
    title: "AutoHedge",
    author: "The Swarm Corporation",
    category: CATEGORIES.ai,
    description:
      "Build your autonomous hedge fund in minutes. AutoHedge harnesses the power of swarm intelligence and AI agents to automate market analysis, risk management, and trade execution.",
    favicon: "/github.svg",
    related: ["Fincept Terminal", "Vibe-Trading"],
    tags: [TAGS.ai],
    url: "https://github.com/The-Swarm-Corporation/AutoHedge",
  },
  {
    title: "awesome-llm-apps",
    author: "Shubhamsaboo",
    category: CATEGORIES.ai,
    description: "100+ AI Agent & RAG apps you can actually run — clone, customize, ship.",
    favicon: "/github.svg",
    related: ["Langflow", "ollama/ollama"],
    tags: [TAGS.ai],
    url: "https://github.com/Shubhamsaboo/awesome-llm-apps",
  },
  {
    title: "Awesome Claude",
    category: CATEGORIES.ai,
    description:
      "The curated directory of Claude AI resources: the Claude Code 2.1 cheatsheet, agent skills, top MCP servers, plugins, SDKs and integrations for developers.",
    related: ["claude-ads", "OpenHands"],
    subtitle: "Claude AI Tools, Cheatsheet, Skills & MCP Servers",
    tags: [TAGS.ai],
    url: "https://awesomeclaude.ai/",
  },
  {
    title: "Awesome Generative AI",
    author: "steven2358",
    category: CATEGORIES.ai,
    description:
      "A curated list of modern Generative Artificial Intelligence projects and services.",
    favicon: "/github.svg",
    tags: [TAGS.ai],
    url: "https://github.com/steven2358/awesome-generative-ai",
  },
  {
    title: "Browser Use",
    category: CATEGORIES.ai,
    description:
      "78,000+ GitHub stars. Trusted by Fortune 500. The #1 open-source browser automation platform.",
    related: ["Crawl4AI", "jo-inc/camofox-browser"],
    subtitle: "The way AI uses the internet",
    tags: [TAGS.ai],
    url: "https://browser-use.com/",
  },
  {
    title: "camofox-browser",
    author: "jo-inc",
    category: CATEGORIES.ai,
    description:
      "Stealth headless browser for AI agents — bypass Cloudflare, bot detection, and anti-scraping. Drop-in Puppeteer/Playwright replacement.",
    favicon: "/github.svg",
    related: ["Browser Use - The way AI uses the internet", "Crawl4AI"],
    tags: [TAGS.ai],
    url: "https://github.com/jo-inc/camofox-browser",
  },
  {
    title: "Caveman",
    category: CATEGORIES.ai,
    description:
      "A compression primitive, a coding agent, and a managed efficiency layer for internal AI agents. From the team behind the 72.8k★ caveman.",
    subtitle: "The token-efficient stack for agent-native development",
    url: "https://caveman.so/",
  },
  {
    title: "claude-ads",
    author: "AgriciDaniel",
    category: CATEGORIES.ai,
    description:
      "Comprehensive paid advertising audit & optimization skill for Claude Code. 250+ checks across Google, Meta, YouTube, LinkedIn, TikTok, Microsoft & Apple Ads with weighted scoring, parallel agents, industry templates, and AI creative generation.",
    favicon: "/github.svg",
    related: ["Awesome Claude"],
    tags: [TAGS.ai],
    url: "https://github.com/AgriciDaniel/claude-ads",
  },
  {
    title: "Crawl4AI",
    category: CATEGORIES.ai,
    description: "Open-source LLM-Friendly Web Crawler & Scraper",
    related: ["Browser Use - The way AI uses the internet", "jo-inc/camofox-browser", "Maxun"],
    tags: [TAGS.crawler, TAGS.llm, TAGS.scraper, TAGS["open-source"]],
    url: "https://docs.crawl4ai.com/",
  },
  {
    title: "CS 329S: Machine Learning Systems Design",
    category: CATEGORIES.ai,
    description:
      "This course aims to provide an iterative framework for developing real-world machine learning systems that are deployable, reliable, and scalable.",
    tags: [TAGS.ai, TAGS.education],
    url: "https://stanford-cs329s.github.io/syllabus.html",
  },
  {
    title: "Dify",
    category: CATEGORIES.ai,
    description:
      "Unlock agentic workflow with Dify. Develop, deploy, and manage autonomous agents, RAG pipelines, and more for teams at any scale, effortlessly.",
    related: ["Langflow", "Unstructured - Unstructured Data Platform for GenAI"],
    subtitle: "Leading Agentic Workflow Builder",
    tags: [TAGS.ai],
    url: "https://dify.ai/",
  },
  {
    title: "Distill",
    category: CATEGORIES.ai,
    description: "Articles about Machine Learning",
    subtitle: "Latest articles about machine learning",
    tags: [TAGS.ai, TAGS.education],
    url: "https://distill.pub/",
  },
  {
    title: "ECC Tools",
    category: CATEGORIES.ai,
    description:
      "ECC is the open agent harness system behind a 210K+ stars OSS ecosystem: start with the repo, install the GitHub App for repo-native guidance, and add AgentShield and rollout layers when coordination gets harder.",
    subtitle: "Open Agent Harness System for GitHub App Automation and Security",
    url: "https://ecc.tools/",
  },
  {
    title: "eve",
    category: CATEGORIES.ai,
    description:
      "Like Next.js for web apps, but for agents. Markdown for instructions and skills, TypeScript for tools. Durable by default.",
    subtitle: "The Agent Framework - Vercel",
    tags: [TAGS.ai],
    url: "https://vercel.com/eve",
  },
  {
    title: "Fincept Terminal",
    author: "Fincept Corporation",
    category: CATEGORIES.ai,
    description:
      "FinceptTerminal is a modern finance application offering advanced market analytics, investment research, and economic data tools, designed for interactive exploration and data-driven decision-making in a user-friendly environment.",
    favicon: "/github.svg",
    related: ["AutoHedge", "Vibe-Trading"],
    tags: [TAGS.ai],
    url: "https://github.com/Fincept-Corporation/FinceptTerminal",
  },
  {
    title: "Flue",
    category: CATEGORIES.ai,
    description:
      "Build durable AI agents and workflows with Flue's programmable TypeScript harness. Write once, deploy anywhere, use any LLM.",
    subtitle: "The Open Agent Framework",
    tags: [TAGS.ai],
    url: "https://flueframework.com/",
  },
  {
    title: "Fooocus",
    author: "lllyasviel",
    category: CATEGORIES.ai,
    description: "Focus on prompting and generating.",
    favicon: "/github.svg",
    tags: [TAGS.ai],
    url: "https://github.com/lllyasviel/Fooocus",
  },
  {
    title: "Hands-On Large Language Models",
    author: "HandsOnLLM",
    category: CATEGORIES.ai,
    description: 'Official code repo for the O\'Reilly Book - "Hands-On Large Language Models"',
    favicon: "/github.svg",
    tags: [TAGS.ai, TAGS.llm],
    url: "https://github.com/handsOnLLM/Hands-On-Large-Language-Models",
  },
  {
    title: "handson-ml3",
    author: "ageron",
    category: CATEGORIES.ai,
    description:
      "A series of Jupyter notebooks that walk you through the fundamentals of Machine Learning and Deep Learning in Python using Scikit-Learn, Keras and TensorFlow 2.",
    favicon: "/github.svg",
    tags: [TAGS.ai],
    url: "https://github.com/ageron/handson-ml3",
  },
  {
    title: "Hugging Bay",
    category: CATEGORIES.ai,
    description:
      "Hugging Bay publishes open AI catalog metadata, source provenance, license records, neutral hosted-file inventory, answer packs, and recorded hashes. Canonical bundle verification and runtime readiness remain unknown.",
    subtitle: "Open AI Artifact Metadata",
    tags: [TAGS.ai],
    url: "https://huggingbay.xyz/",
  },
  {
    title: "hyperframes",
    author: "heygen-com",
    category: CATEGORIES.ai,
    description: "Write HTML. Render video. Built for agents.",
    favicon: "/github.svg",
    related: ["Anil-matcha/Open-Generative-AI"],
    tags: [TAGS.ai],
    url: "https://github.com/heygen-com/hyperframes",
  },
  {
    title: "Langflow",
    author: "Langflow",
    category: CATEGORIES.ai,
    description:
      "Low-code AI builder for agentic and RAG applications. Build AI applications with ease",
    details: [
      {
        title: "IN THE AGE OF AI",
        content:
          "Building custom ChatGPT-like bots and AI workflows typically requires heavy Python scripting (LangChain/LlamaIndex). Langflow reduces this to a visual node-based experience, drastically speeding up prototyping and deployment for teams.",
      },
      {
        title: "WHAT IT IS",
        content:
          "A visual framework for building multi-agent and RAG applications. It’s open-source and provides a drag-and-drop UI to compose LLMs, vector stores, and prompt templates easily.",
      },
    ],
    related: ["Dify", "OpenHands"],
    tags: [TAGS.agents, TAGS.builder, TAGS.rag, TAGS["low-code"]],
    url: "https://www.langflow.org/",
  },
  {
    title: "Maxun",
    category: CATEGORIES.ai,
    description:
      "The easiest AI-powered  web scraping, crawling, extraction, search platform. The best open-source Browse AI alternative.",
    related: ["Crawl4AI", "jo-inc/camofox-browser"],
    subtitle: "Scrape, Extract, Crawl, Search Web Data With No-Code",
    tags: [TAGS.ai],
    url: "https://www.maxun.dev/",
  },
  {
    title: "Models",
    category: CATEGORIES.ai,
    description: "Experience the leading models to build enterprise generative AI apps now.",
    subtitle: "Try NVIDIA NIM APIs",
    url: "https://build.nvidia.com/models",
  },
  {
    title: "MotionSites",
    category: CATEGORIES.ai,
    description:
      "MotionSites is the premium library of AI beautiful website prompts, apps and animations for Lovable, Bolt, Cursor, and Claude",
    subtitle: "Premium Website Prompts",
    url: "https://motionsites.ai/",
  },
  {
    title: "Neural Networks: Zero To Hero",
    author: "Andrej Karpathy",
    category: CATEGORIES.ai,
    description: "A course by Andrej Karpathy on building neural networks, from scratch, in code.",
    tags: [TAGS.ai, TAGS.education],
    url: "https://karpathy.ai/zero-to-hero.html",
  },
  {
    title: "ollama",
    author: "Ollama",
    category: CATEGORIES.ai,
    description:
      "Get up and running with Kimi-K2.6, GLM-5.1, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma and other models.",
    favicon: "/github.svg",
    related: ["Open WebUI", "Shubhamsaboo/awesome-llm-apps"],
    tags: [TAGS.ai],
    url: "https://github.com/ollama/ollama",
  },
  {
    title: "Open-Generative-AI",
    author: "Anil-matcha",
    category: CATEGORIES.ai,
    description:
      "Open-source alternative to AI video platforms — Free AI image & video generation studio with 200+ models (Flux, Midjourney, Kling, Sora, Veo). No content filters. Self-hosted, MIT licensed.",
    favicon: "/github.svg",
    related: ["heygen-com/hyperframes", "Open-LLM-VTuber/Open-LLM-VTuber"],
    tags: [TAGS.ai],
    url: "https://github.com/Anil-matcha/Open-Generative-AI",
  },
  {
    title: "Open-LLM-VTuber",
    author: "Open-LLM-VTuber",
    category: CATEGORIES.ai,
    description:
      "Talk to any LLM with hands-free voice interaction, voice interruption, and Live2D taking face running locally across platforms.",
    favicon: "/github.svg",
    related: ["Anil-matcha/Open-Generative-AI", "openai/whisper"],
    tags: [TAGS.ai],
    url: "https://github.com/Open-LLM-VTuber/Open-LLM-VTuber",
  },
  {
    title: "OpenDataLoader PDF",
    author: "OpenDataLoader",
    category: CATEGORIES.ai,
    description:
      "Convert PDFs to LLM-ready Markdown and JSON. #1 in benchmarks (0.90 overall). Bounding boxes for citations. Auto-tag untagged PDFs into Tagged PDFs as foundation for PDF/UA workflows. 100% local, open source (Apache-2.0).",
    subtitle: "PDF Parser for AI-Ready Data | Auto-Tag PDFs for Accessibility",
    url: "https://opendataloader.org/",
  },
  {
    title: "OpenHands",
    author: "OpenHands",
    authorLink: "https://github.com/OpenHands",
    category: CATEGORIES.ai,
    description:
      "Meet OpenHands, the open-source, model-agnostic platform for cloud coding agents. Automate real engineering work securely and transparently. Build faster with full control.",
    favicon: "/github.svg",
    related: ["Awesome Claude", "Langflow"],
    subtitle: "The Open Platform for Cloud Coding Agents",
    tags: [TAGS.ai],
    url: "https://www.openhands.dev/",
  },
  {
    title: "Open WebUI",
    author: "Open WebUI Team",
    category: CATEGORIES.ai,
    description:
      "Run AI on your own terms. Connect any model, extend with code, protect what matters—without compromise.",
    details: [
      {
        title: "PRIVACY FOCUS",
        content:
          "By self-hosting your AI stack, no corporate entity can use your chats for training data. Your local documents and conversations remain strictly on your own hardware.",
      },
      {
        title: "WHY USE THIS",
        content:
          "If you want the ChatGPT Plus experience but fully offline or pointing to your own local models (like Llama 3 via Ollama), this is the definitive UI. It supports multiple users, RAG document uploading, and full API integrations.",
      },
    ],
    related: ["ollama/ollama", "Unstructured - Unstructured Data Platform for GenAI"],
    subtitle: "Self-Hosted AI Platform",
    tags: [TAGS.llm, TAGS.platform, TAGS.ui, TAGS["self-hosted"]],
    url: "https://openwebui.com/",
  },
  {
    title: "OpenWiki",
    author: "LangChain",
    category: CATEGORIES.ai,
    description:
      "OpenWiki is a CLI that writes and maintains agent documentation for your codebase.",
    favicon: "/github.svg",
    tags: [TAGS.ai],
    url: "https://github.com/langchain-ai/openwiki",
  },
  {
    title: "Ship Studio",
    category: CATEGORIES.ai,
    description:
      "A free desktop app that runs on your machine and plugs into the subscriptions, GitHub account, and hosting you already pay for — agent, repo, and deploys in one window.",
    subtitle: "Build it, ship it, host it without leaving the app",
    url: "https://www.ship.studio/",
  },
  {
    title: "Taste Skill",
    category: CATEGORIES.ai,
    description:
      "Taste Skill gives your AI coding agent good taste. Open-source skill files that stop Cursor, Claude Code, Codex & more from generating generic, boring frontends. Install in one command.",
    subtitle: "The Anti-Slop Frontend Framework for AI Agents",
    tags: [TAGS.ai],
    url: "https://www.tasteskill.dev/",
  },
  {
    title: "The Agent Skills Directory",
    category: CATEGORIES.ai,
    description: "Discover and install skills for AI agents.",
    url: "https://www.skills.sh/",
  },
  {
    title: "Unstructured",
    category: CATEGORIES.ai,
    description:
      "Transform complex, unstructured data into clean, AI-ready inputs. Connect to any source, process 64+ file types, and power your GenAI projects. Start now.",
    related: ["Dify", "Open WebUI"],
    subtitle: "Unstructured Data Platform for GenAI",
    tags: [TAGS.ai],
    url: "https://unstructured.io/",
  },
  {
    title: "Vibe-Trading",
    author: "HKUDS",
    category: CATEGORIES.ai,
    description: "Vibe-Trading: Your Personal Trading Agent",
    favicon: "/github.svg",
    related: ["AutoHedge", "Fincept Terminal"],
    tags: [TAGS.ai],
    url: "https://github.com/HKUDS/Vibe-Trading",
  },
  {
    title: "whisper",
    author: "OpenAI",
    category: CATEGORIES.ai,
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    favicon: "/github.svg",
    related: ["Open-LLM-VTuber/Open-LLM-VTuber"],
    tags: [TAGS.ai],
    url: "https://github.com/openai/whisper",
  },
];
