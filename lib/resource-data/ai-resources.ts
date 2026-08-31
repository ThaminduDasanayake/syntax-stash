import { Resource } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const aiLinks: Resource<typeof CATEGORIES.ai>[] = [
  {
    title: "agentic-inbox",
    author: "Cloudflare",
    category: CATEGORIES.ai,
    description:
      "A self-hosted email client with an AI agent, running entirely on Cloudflare Workers.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/ae4da67dc6bd7c91e3cc19c37a9848baac3393638e9608d5f9a5349d393b807f/cloudflare/agentic-inbox",
    tags: [TAGS.ai],
    url: "https://github.com/cloudflare/agentic-inbox",
  },
  {
    title: "agentmemory",
    author: "Rohit Ghumare",
    category: CATEGORIES.ai,
    description:
      "Persistent memory for AI coding agents. Capture every session, recall it in the next one. Runs locally with zero external databases. Works with every MCP client.",
    favicon: "https://www.agent-memory.dev/icon.svg",
    ogImage:
      "https://opengraph.githubassets.com/3f39d8c755703def7ddb8895187d372e8fcab2397135aac3e1bec717cdcd3aa7/rohitg00/agentmemory",
    subtitle: "Persistent memory for AI coding agents",
    tags: [TAGS.agents],
    url: "https://www.agent-memory.dev/",
  },
  {
    title: "AI Design Field Guide",
    category: CATEGORIES.ai,
    description:
      "Learn techniques from the designers behind OpenAI, Anthropic, Figma, Notion & more",
    favicon: "https://www.aidesignfieldguide.com/favicon/apple-icon-180x180.png",
    ogImage: "https://www.aidesignfieldguide.com/share-link.png",
    tags: [TAGS.ai],
    url: "https://www.aidesignfieldguide.com/",
  },
  {
    title: "AI Engineering Hub",
    author: "patchy631",
    category: CATEGORIES.ai,
    description: "In-depth tutorials on LLMs, RAGs and real-world AI agent applications.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/6b54d143e106630cca3b3cc1263cab912884d114805911d9b9383c7bba42821e/patchy631/ai-engineering-hub",
    tags: [TAGS.ai],
    url: "https://github.com/patchy631/ai-engineering-hub",
  },
  {
    title: "Andrej Karpathy Skills",
    author: "Multica AI",
    category: CATEGORIES.ai,
    description:
      "A single CLAUDE.md file to improve Claude Code behavior, derived from Andrej Karpathy's observations on LLM coding pitfalls.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/8aba2cedd2dc2447cd55eeb1f08834209b7fb6bcb660e17e2f03baf7e5b9d195/multica-ai/andrej-karpathy-skills",
    tags: [TAGS.ai],
    url: "https://github.com/multica-ai/andrej-karpathy-skills",
  },
  {
    title: "AnythingLLM",
    category: CATEGORIES.ai,
    description:
      "A free, private AI assistant that runs on your device. No accounts, no API keys, no token limits.",
    favicon: "https://anythingllm.com/images/brand/logo-mark.svg",
    ogImage: "https://anythingllm.com/share-card.png",
    subtitle: "On-device AI for productivity | Local & Private",
    tags: [TAGS.ai],
    url: "https://anythingllm.com/",
  },
  {
    title: "AutoHedge",
    author: "The Swarm Corporation",
    category: CATEGORIES.ai,
    description:
      "Build your autonomous hedge fund in minutes. AutoHedge harnesses the power of swarm intelligence and AI agents to automate market analysis, risk management, and trade execution.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/4215b1a22e1ca62f47aac7b4127b54e053679d63414e6139c9e2f34bd5f9d61a/The-Swarm-Corporation/AutoHedge",
    tags: [TAGS.ai],
    url: "https://github.com/The-Swarm-Corporation/AutoHedge",
  },
  {
    title: "Awesome Claude",
    author: "Awesome Claude Community",
    category: CATEGORIES.ai,
    description:
      "The curated directory of Claude AI resources: the Claude Code 2.1 cheatsheet, agent skills, top MCP servers, plugins, SDKs and integrations for developers.",
    favicon: "https://awesomeclaude.ai/awesomeclaude.svg",
    ogImage: "https://awesomeclaude.ai/og.png",
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
    ogImage:
      "https://opengraph.githubassets.com/7becdfa0572ad40b84614e640fb865ed1eab4b9d114746228f5775a968197373/steven2358/awesome-generative-ai",
    tags: [TAGS.ai],
    url: "https://github.com/steven2358/awesome-generative-ai",
  },
  {
    title: "Awesome LLM Apps",
    author: "Shubham Saboo",
    category: CATEGORIES.ai,
    description: "100+ AI Agent & RAG apps you can actually run — clone, customize, ship.",
    favicon: "/github.svg",
    tags: [TAGS.ai],
    url: "https://github.com/Shubhamsaboo/awesome-llm-apps",
  },
  {
    title: "Browser Use",
    category: CATEGORIES.ai,
    description:
      "Browser Use Agents finish the task. Browser Infrastructure gives your code managed browsers that don't get blocked. 82% on Internal Bench Hard at 17¢ per solved task, $0.02 per browser hour.",
    favicon: "https://browser-use.com/logo-primary.svg",
    ogImage: "https://browser-use.com/og/home-og.png",
    subtitle: "Browser Use Agents & Browser Infrastructure",
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
    tags: [TAGS.ai],
    url: "https://github.com/jo-inc/camofox-browser",
  },
  {
    title: "Caveman",
    category: CATEGORIES.ai,
    description:
      "A compression primitive, a coding agent, and a managed efficiency layer for internal AI agents. From the team behind the 72.8k★ caveman.",
    ogImage: "https://caveman.so/opengraph-image",
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
    tags: [TAGS.ai],
    url: "https://github.com/AgriciDaniel/claude-ads",
  },
  {
    title: "Claude Code Templates",
    author: "Daniel Avila",
    category: CATEGORIES.ai,
    description:
      "Browse and install 1000+ pre-built components for Claude Code. AI agents, slash commands, MCP integrations, hooks, and settings. Free, open-source CLI tool.",
    favicon: "https://aitmpl.com/static/favicon/apple-touch-icon.png",
    ogImage: "https://www.aitmpl.com/logo.png",
    subtitle: "1000+ Agents, Commands, Skills & MCP Integrations",
    tags: [TAGS.ai],
    url: "https://aitmpl.com/",
  },
  {
    title: "Crawl4AI",
    category: CATEGORIES.ai,
    description: "Open-source LLM-Friendly Web Crawler & Scraper",
    tags: [TAGS.crawler, TAGS.llm, TAGS.scraper, TAGS["open-source"]],
    url: "https://docs.crawl4ai.com/",
  },
  {
    title: "Dify",
    category: CATEGORIES.ai,
    description:
      "Unlock agentic workflow with Dify. Develop, deploy, and manage autonomous agents, RAG pipelines, and more for teams at any scale, effortlessly.",
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
    author: "Vercel",
    category: CATEGORIES.ai,
    description:
      "Like Next.js for web apps, but for agents. Markdown for instructions and skills, TypeScript for tools. Durable by default.",
    subtitle: "The Agent Framework",
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
    title: "Freebuff",
    author: "Freebuff",
    category: CATEGORIES.ai,
    description:
      "Freebuff is the free coding agent: a free CLI coding agent and Freebuff Web, the free way to build full-stack apps. No subscription, no setup, no lock-in. The free alternative to Claude Code, Cursor, Codex, Lovable, Replit, Bolt, Windsurf, and Devin.",
    favicon: "https://freebuff.com/favicon/apple-touch-icon.png",
    ogImage: "https://freebuff.com/opengraph-image.png",
    subtitle: "The free coding agent (free Claude Code, Codex, Cursor & Lovable alternative)",
    url: "https://freebuff.com/",
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
    tags: [TAGS.ai],
    url: "https://github.com/heygen-com/hyperframes",
  },
  {
    title: "Kickbacks.ai",
    category: CATEGORIES.ai,
    description:
      "Kickbacks.ai helps developers get paid for AI-agent wait states. Advertisers bid for a tiny sponsored status line; users get 50% of ad revenue.",
    subtitle: "Get paid for waiting",
    url: "https://kickbacks.ai/",
  },
  {
    title: "Label Studio",
    category: CATEGORIES.ai,
    description:
      "Multi-modal data labeling and annotation platform for agent traces, LLM evals, RLHF, computer vision, document AI, NLP, audio transcription, and more.",
    favicon: "https://labelstud.io/favicon.svg",
    ogImage:
      "https://cdn.sanity.io/images/k7elabj6/production/91e23a79f08972e22abe23b7f70866fddecbb17b-1200x630.png",
    subtitle: "Open Source Data Labeling and AI Evaluation",
    tags: [TAGS.ai],
    url: "https://labelstud.io/",
  },
  {
    title: "Langflow",
    author: "Langflow",
    category: CATEGORIES.ai,
    description:
      "Low-code AI builder for agentic and RAG applications. Build AI applications with ease",
    tags: [TAGS.agents, TAGS.builder, TAGS.rag, TAGS["low-code"]],
    url: "https://www.langflow.org/",
  },
  {
    title: "LLM Gateway",
    category: CATEGORIES.ai,
    description:
      "Route, manage, and analyze LLM requests across OpenAI, Anthropic, Google, and 40+ providers through one unified, OpenAI-compatible API. Free and open source.",
    favicon: "https://llmgateway.io/brand/logo-black.svg",
    ogImage: "https://llmgateway.io/opengraph.png",
    subtitle: "Unified API for Multiple LLM Providers",
    tags: [TAGS.ai],
    url: "https://llmgateway.io/",
  },
  {
    title: "Maxun",
    category: CATEGORIES.ai,
    description:
      "The easiest AI-powered  web scraping, crawling, extraction, search platform. The best open-source Browse AI alternative.",
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
    tags: [TAGS.ai],
    url: "https://github.com/ollama/ollama",
  },
  {
    title: "OmniRoute",
    author: "Diego Rodrigues de Sa e Souza",
    category: CATEGORIES.ai,
    description:
      "Free, open-source AI router with auto-fallback. 339 providers, one endpoint, 95 MCP tools, 19 routing strategies, A2A protocol, auto-combo engine, semantic cache, memory & skills. Deploy anywhere.",
    favicon:
      "https://raw.githubusercontent.com/diegosouzapw/OmniRoute/release/v3.8.50/public/favicon.svg",
    ogImage:
      "https://raw.githubusercontent.com/diegosouzapw/OmniRoute/release/v3.8.50/docs/diagrams/readme-hero.svg",
    subtitle: "Free AI Gateway for Multi-Provider LLMs",
    tags: [TAGS.ai],
    url: "https://omniroute.online/",
  },
  {
    title: "Open-Generative-AI",
    author: "Anil-matcha",
    category: CATEGORIES.ai,
    description:
      "Open-source alternative to AI video platforms — Free AI image & video generation studio with 200+ models (Flux, Midjourney, Kling, Sora, Veo). No content filters. Self-hosted, MIT licensed.",
    favicon: "/github.svg",
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
    subtitle: "The Open Platform for Cloud Coding Agents",
    tags: [TAGS.ai],
    url: "https://www.openhands.dev/",
  },
  {
    title: "OpenRouter",
    category: CATEGORIES.ai,
    description:
      "The unified interface for every model. Find the best models & prices for your prompts",
    favicon: "https://openrouter.ai/favicon/glyph.png",
    ogImage:
      "https://openrouter.ai/dynamic-og?pathname=default&title=OpenRouter&description=The+unified+interface+for+every+model.+Find+the+best+models+%26+prices+for+your+prompts&v=2",
    tags: [TAGS.ai],
    url: "https://openrouter.ai",
  },
  {
    title: "Open WebUI",
    author: "Open WebUI Team",
    category: CATEGORIES.ai,
    description:
      "Run AI on your own terms. Connect any model, extend with code, protect what matters—without compromise.",
    subtitle: "Self-Hosted AI Platform",
    tags: [TAGS.llm, TAGS.platform, TAGS.selfHosted, TAGS.ui],
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
    title: "Prompt Explorer by Raycast",
    author: "Raycast",
    category: CATEGORIES.ai,
    description: "Easily browse, share, and add prompts to Raycast.",
    ogImage: "https://www.ray.so/_next/static/media/og-image.0xf6y8axn-d2x.png",
    tags: [TAGS.ai],
    url: "https://ray.so/prompts/code",
  },
  {
    title: "RAG-Anything",
    author: "HKUDS",
    category: CATEGORIES.ai,
    description: "RAG-Anything: All-in-One RAG Framework",
    favicon: "/github.svg",
    url: "https://github.com/hkuds/rag-anything",
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
    title: "Sinceerly",
    category: CATEGORIES.ai,
    description: "Make your emails sound human",
    url: "https://sinceerly.com/",
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
    subtitle: "Unstructured Data Platform for GenAI",
    tags: [TAGS.ai],
    url: "https://unstructured.io/",
  },
  {
    title: "v0",
    author: "Vercel",
    category: CATEGORIES.ai,
    description:
      "Your collaborative AI assistant to design, iterate, and scale full-stack applications for the web.",
    favicon: "https://v0.app/assets/icon.svg",
    ogImage: "https://v0.app/chat/api/og",
    subtitle: "Build Full-Stack Web Apps with AI",
    url: "https://v0.app/",
  },
  {
    title: "Varchive",
    author: "Cameron Moll LLC",
    category: CATEGORIES.ai,
    description:
      "Varchive is a digest of artificial intelligence news biased toward design, curated by Cameron Moll.",
    favicon: "https://varchive.ai/favicons/apple-touch-icon.png",
    ogImage: "https://varchive.ai/social-og.png",
    url: "https://varchive.ai/",
  },
  {
    title: "Vibe-Trading",
    author: "HKUDS",
    category: CATEGORIES.ai,
    description: "Vibe-Trading: Your Personal Trading Agent",
    favicon: "/github.svg",
    tags: [TAGS.ai],
    url: "https://github.com/HKUDS/Vibe-Trading",
  },
  {
    title: "whisper",
    author: "OpenAI",
    category: CATEGORIES.ai,
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    favicon: "/github.svg",
    tags: [TAGS.ai],
    url: "https://github.com/openai/whisper",
  },
];
