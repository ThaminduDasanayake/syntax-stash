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
    description: "100+ AI Agents, Agent Skills and RAG Apps - Free and Open Source.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/0fab0bfbe38390ee33d289d6332c87cf93420db938121f200dbbdb2d7428398a/Shubhamsaboo/awesome-llm-apps",
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
    title: "Camofox Browser",
    author: "jo inc",
    category: CATEGORIES.ai,
    description:
      "Stealth headless browser for AI agents — bypass Cloudflare, bot detection, and anti-scraping. Drop-in Puppeteer/Playwright replacement.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/40c133c27d499c9e269a93dabe5431d69a68ced134d2bc11a8ac4ba2a7a46c96/jo-inc/camofox-browser",
    tags: [TAGS.ai],
    url: "https://github.com/jo-inc/camofox-browser",
  },
  {
    title: "Caveman",
    category: CATEGORIES.ai,
    description:
      "Your AI bill is mostly waste. Caveman finds it, cuts it with caching, compression and routing, and proves every dollar saved.",
    favicon: "https://caveman.so/favicon.svg",
    ogImage: "https://caveman.so/opengraph-image",
    subtitle: "The token-efficient stack for agent-native development",
    url: "https://caveman.so/",
  },
  {
    title: "Claude Ads",
    author: "Agrici Daniel",
    category: CATEGORIES.ai,
    description:
      "Free, open-source paid-media operations for Claude Code: audit 12 ad platforms with 33 skills, get an evidence-backed health score and a prioritized fix plan.",
    favicon: "https://claude-ads.md/icon.svg",
    gitHubLink: "https://github.com/AgriciDaniel/claude-ads",
    ogImage: "https://claude-ads.md/opengraph-image",
    subtitle: "Free PPC & Google Ads Audit Tool",
    tags: [TAGS.ai],
    url: "https://claude-ads.md/",
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
    author: "UncleCode",
    category: CATEGORIES.ai,
    description: "🚀🤖 Crawl4AI, Open-source LLM-Friendly Web Crawler & Scraper",
    favicon: "https://docs.crawl4ai.com/img/favicon.ico",
    gitHubLink: "https://github.com/unclecode/crawl4ai",
    ogImage:
      "https://opengraph.githubassets.com/3bbe7207bf920ac8f3863ecbbc938081d687a0615f5897d23c3189152b8439b2/unclecode/crawl4ai",
    tags: [TAGS.crawler, TAGS.llm, TAGS.scraper, TAGS["open-source"]],
    url: "https://docs.crawl4ai.com/",
  },
  {
    title: "Dify",
    author: "LangGenius",
    category: CATEGORIES.ai,
    description:
      "Dify is the platform for production-ready agentic workflows. Build agents, knowledge pipelines, models, and tools on one canvas, deployable on Cloud, in your VPC, or self-hosted.",
    favicon: "https://dify.ai/favicon.svg",
    gitHubLink: "https://github.com/langgenius/dify",
    ogImage: "https://dify.ai/assets/og/default.png",
    subtitle: "The Platform for Production-Ready Agentic Workflows",
    tags: [TAGS.ai],
    url: "https://dify.ai/",
  },
  {
    title: "ECC Tools",
    category: CATEGORIES.ai,
    description:
      "ECC is the open agent harness system behind a 210K+ stars OSS ecosystem: start with the repo, install the GitHub App for repo-native guidance, and add AgentShield and rollout layers when coordination gets harder.",
    favicon: "https://ecc.tools/favicon.svg",
    ogImage: "https://ecc.tools/og.png",
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
    author: "Lvmin Zhang",
    category: CATEGORIES.ai,
    description: "Focus on prompting and generating.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/9868c574f9cdec394ac001ba31725ef31a64017ed5c8d7ac7caff7d3682b04ee/lllyasviel/Fooocus",
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
      "Search open models, compare licenses, inspect source records, and download hosted files with published SHA-256 hashes. Check each artifact page for its current run status.",
    favicon: "https://huggingbay.xyz/favicon.png",
    ogImage: "https://huggingbay.xyz/hugging-bay-header.jpg",
    subtitle: "Find And Download Open AI",
    tags: [TAGS.ai],
    url: "https://huggingbay.xyz/",
  },
  {
    title: "HyperFrames",
    author: "HeyGen",
    category: CATEGORIES.ai,
    description:
      "HyperFrames lets AI agents compose videos by writing HTML, CSS & JS — originated by HeyGen, built for the community. Open source under Apache 2.0.",
    favicon: "https://hyperframes.heygen.com/favicon.ico",
    gitHubLink: "https://github.com/heygen-com/hyperframes",
    ogImage: "https://www.heygen.com/images/heygen-logo.svg",
    subtitle: "Edit Videos By Vibe-Coding",
    tags: [TAGS.ai],
    url: "https://hyperframes.heygen.com/",
  },
  {
    title: "Kickbacks.ai",
    category: CATEGORIES.ai,
    description:
      "Kickbacks.ai turns your AI agent's wait time into rewards. Advertisers bid for a tiny sponsored status line; developers earn 50% of the net ad revenue from ads shown on their machine.",
    favicon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%232aa44f'/%3E%3Cstop offset='1' stop-color='%23147a34'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='4' y='4' width='120' height='120' rx='28' fill='url(%23g)'/%3E%3Ctext x='64' y='88' text-anchor='middle' font-family='Montserrat,Segoe UI,Arial,sans-serif' font-weight='800' font-size='66' fill='%23fff' letter-spacing='-3'%3EK$%3C/text%3E%3C/svg%3E",
    ogImage: "https://kickbacks.ai/og-card.png",
    subtitle: "Earn while you wait.",
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
      "Langflow is a low-code AI builder for agentic and retrieval-augmented generation (RAG) apps. Code in Python and use any LLM or vector database.",
    favicon:
      "https://raw.githubusercontent.com/langflow-ai/langflow/main/src/frontend/src/assets/LangflowLogo.svg",
    gitHubLink: "https://github.com/langflow-ai/langflow",
    ogImage: "https://www.langflow.org/images/og-image.png",
    tags: [TAGS.agents, TAGS.builder, TAGS.rag, TAGS["low-code"]],
    url: "https://www.langflow.org/",
  },
  {
    title: "LightRAG",
    author: "HKUDS",
    category: CATEGORIES.ai,
    description: "[EMNLP2025] LightRAG: Simple and Fast Retrieval-Augmented Generation",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/aef45a71ae41cf360958c1b7a8b1620868bb46fcd36296feacf8fe1267648cac/HKUDS/LightRAG",
    url: "https://github.com/HKUDS/LightRAG",
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
    title: "MotionSites AI",
    author: "MotionSites",
    category: CATEGORIES.ai,
    description:
      "Beautiful Website Prompts for Lovable, Bolt, Cursor, and Claude. Build Stunning 3d Websites With AI. Just copy, paste, and launch",
    favicon: "https://motionsites.ai/favicon.png",
    ogImage:
      "https://storage.googleapis.com/gpt-engineer-file-uploads/OzagiQ9ZfuQNatpgQBgKibiYrtm2/social-images/social-1772948036264-1social.webp",
    subtitle: "Official Premium AI Website Prompts",
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
    title: "Ollama",
    author: "Ollama",
    category: CATEGORIES.ai,
    description:
      "Ollama is the easiest way to automate your work using open models, while keeping your data safe.",
    favicon: "https://ollama.com/public/ollama.png",
    gitHubLink: "https://github.com/ollama/ollama",
    ogImage: "https://ollama.com/public/og.png",
    tags: [TAGS.ai, TAGS.models],
    url: "https://ollama.com/",
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
      "Convert PDFs to LLM-ready Markdown and JSON. #1 in benchmarks (0.90 overall). Auto-tag untagged PDFs into Tagged PDFs as foundation for PDF/UA workflows. 100% local, open source (Apache-2.0).",
    favicon: "https://opendataloader.org/logo-icon.webp",
    gitHubLink: "https://github.com/opendataloader-project/opendataloader-pdf",
    ogImage: "https://opendataloader.org/og-image.png",
    subtitle: "PDF Parser for AI-Ready Data | Auto-Tag PDFs for Accessibility",
    url: "https://opendataloader.org/",
  },
  {
    title: "Open Generative AI",
    author: "Anil Matcha",
    category: CATEGORIES.ai,
    description:
      "Unrestricted Open-source alternative to AI video platforms — Free AI image & video generation studio with 500+ models (Flux, Midjourney, Kling, Sora, Veo). No content filters. Self-hosted, MIT licensed.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/43b931633bf6dcb6281304eee843ac8377ecd8f685727db067dd6c7e33efda3e/Anil-matcha/Open-Generative-AI",
    tags: [TAGS.ai],
    url: "https://github.com/Anil-matcha/Open-Generative-AI",
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
    author: "Open WebUI",
    category: CATEGORIES.ai,
    description:
      "Run AI on your own terms. Connect any model, extend with code, and protect what matters without compromise.",
    favicon: "https://openwebui.com/favicon.png",
    gitHubLink: "https://github.com/open-webui/open-webui",
    ogImage: "https://openwebui.com/og-image.png",
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
    ogImage:
      "https://opengraph.githubassets.com/ecc43d4b0b39773da22a5b7cb22e4b502604ec5f7f6e2fc42da4799995b49bf2/HKUDS/RAG-Anything",
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
    title: "unwind ai",
    author: "Unwind AI",
    category: CATEGORIES.ai,
    description: "Open-source Ecosystem for High-Leverage AI Builders",
    favicon:
      "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/84ac330c-894c-4f61-ac66-e747ce8b32eb/thumb_logo.png",
    ogImage:
      "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/thumbnail/84ac330c-894c-4f61-ac66-e747ce8b32eb/landscape_UAI_new_banner.png",
    tags: [TAGS.ai],
    url: "https://www.theunwindai.com/",
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
    title: "Vibe-Trading Wiki",
    author: "HKUDS",
    category: CATEGORIES.ai,
    description:
      "Vibe-Trading is a natural-language finance research agent for market data, backtesting, swarm analysis, trade journals, and research artifacts.",
    favicon: "https://vibetrading.wiki/assets/icon.png",
    gitHubLink: "https://github.com/HKUDS/Vibe-Trading",
    ogImage:
      "https://opengraph.githubassets.com/639d9fb9c0062b5c3be63582499a1c651e4866b9671c31d9a4f977ecd16ca934/HKUDS/Vibe-Trading",
    subtitle: "Finance Research Agent",
    tags: [TAGS.ai],
    url: "https://vibetrading.wiki/",
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
