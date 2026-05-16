import { Tool } from "@/types";

export const CATEGORIES = {
  data: "Data",
  dataViz: "Data Visualization",
  development: "Development & Code",
  devops: "DevOps",
  education: "Education",
  imagesAssets: "Images & Assets",
  network: "Network & Security",
  system: "System & OS",
  typography: "Typography & Text",
  components: "UI Components",
  colors: "Colors & Gradients",
  animations: "Animations & Effects",
} as const;

export const resourceCategories: string[] = Object.values(CATEGORIES);

export const dataLinks: Tool[] = [
  {
    title: "Public APIs",
    url: "https://github.com/public-apis/public-apis",
    description: "A collective list of free APIs for use in software and web development.",
    category: CATEGORIES.data,
  },
  {
    title: "Free Public APIs",
    url: "https://www.freepublicapis.com/",
    description: "Curated list of free public APIs with status indicators.",
    category: CATEGORIES.data,
  },
  {
    title: "PublicAPIs.dev",
    url: "https://publicapis.dev/",
    description: "Searchable directory of public APIs organized by category.",
    category: CATEGORIES.data,
  },
  {
    title: "Apify",
    url: "https://apify.com/?fpr=i6ouv&gad_campaignid=22544677876&gbraid=0AAAAADGdQwxm_XhH9hQNusnyQy48tjNqd",
    description: "Platform for building, running, and sharing web scraping and automation actors.",
    category: CATEGORIES.data,
  },
  {
    title: "MCP Servers",
    url: "https://github.com/modelcontextprotocol/servers",
    description: "Official and community Model Context Protocol server implementations for AI tool integrations.",
    category: CATEGORIES.data,
  },
];

export const dataVizLinks: Tool[] = [
  {
    title: "Apache ECharts",
    url: "https://echarts.apache.org/en/index.html",
    description: "Powerful, interactive charting library with a declarative API and broad chart type support.",
    category: CATEGORIES.dataViz,
  },
  {
    title: "CSV Vis Tool",
    url: "https://csvistool.com/",
    description: "Upload a CSV and instantly visualize it as charts or tables in the browser.",
    category: CATEGORIES.dataViz,
  },
];

export const developmentLinks: Tool[] = [
  {
    title: "DhiWise",
    url: "https://www.dhiwise.com/",
    description: "Programming automation platform that generates React and Flutter code from Figma designs.",
    category: CATEGORIES.development,
  },
  {
    title: "GitDocify",
    url: "https://gitdocify.com/readme/Coding-Challenge-Generator#top",
    description: "AI-powered README and documentation generator for GitHub repositories.",
    category: CATEGORIES.development,
  },
  {
    title: "Omatsuri",
    url: "https://omatsuri.app/",
    description: "Open source collection of browser tools — triangle generator, gradients, symbols, and more.",
    category: CATEGORIES.development,
  },
  {
    title: "Database.build",
    url: "https://database.build/",
    description: "Run Postgres in the browser — design schemas, run queries, and share databases instantly (by Supabase).",
    category: CATEGORIES.development,
  },
  {
    title: "TinyWow",
    url: "https://tinywow.com/",
    description: "Free in-browser file tools for PDF, video, image, and document conversion.",
    category: CATEGORIES.development,
  },
  {
    title: "Liam ERD",
    url: "https://liambx.com/",
    description: "Generate interactive, shareable ER diagrams from your database schema automatically.",
    category: CATEGORIES.development,
  },
  {
    title: "React Haiku",
    url: "https://www.reacthaiku.dev/",
    description: "Lightweight collection of React hooks for common browser and UI interactions.",
    category: CATEGORIES.development,
  },
  {
    title: "Frimousse",
    url: "https://frimousse.liveblocks.io/",
    description: "Lightweight, unstyled emoji picker component for React — composable and framework-agnostic styling.",
    category: CATEGORIES.development,
  },
];

export const educationLinks: Tool[] = [
  {
    title: "Coddy",
    url: "https://coddy.tech/",
    description: "Gamified coding challenges and courses.",
    category: CATEGORIES.education,
  },
  {
    title: "Codecademy",
    url: "https://www.codecademy.com/",
    description: "Interactive coding tutorials and courses.",
    category: CATEGORIES.education,
  },
  {
    title: "Codédex",
    url: "https://www.codedex.io/",
    description: "Learn to code in a fantasy RPG environment.",
    category: CATEGORIES.education,
  },
  {
    title: "Code with Mosh",
    url: "https://codewithmosh.com/p/learning-paths",
    description: "Clear, concise programming courses by Mosh Hamedani.",
    category: CATEGORIES.education,
  },
  {
    title: "DeepWiki",
    url: "https://deepwiki.com/",
    description: "Deep tech and software engineering wiki.",
    category: CATEGORIES.education,
  },
  {
    title: "Dev Quizzes",
    url: "https://quizzes.madza.dev/",
    description: "Test your programming knowledge.",
    category: CATEGORIES.education,
  },
  {
    title: "Learn Anything",
    url: "https://learn-anything.xyz/",
    description: "Organize knowledge and discover resources.",
    category: CATEGORIES.education,
  },
  {
    title: "MindLuster",
    url: "https://www.mindluster.com/",
    description: "Free online courses with certificates.",
    category: CATEGORIES.education,
  },
  {
    title: "Roadmap.sh",
    url: "https://roadmap.sh/",
    description: "Step-by-step developer roadmaps and guides.",
    category: CATEGORIES.education,
  },
  {
    title: "QuickRef",
    url: "https://quickref.me/index.html",
    description: "Cheat sheets for programming languages and tools.",
    category: CATEGORIES.education,
  },
  {
    title: "Web Skills",
    url: "https://andreasbm.github.io/web-skills/",
    description: "A visual overview of useful skills to learn as a web developer.",
    category: CATEGORIES.education,
  },
  {
    title: "App Ideas",
    url: "https://github.com/florinpop17/app-ideas",
    description: "A Collection of application ideas to improve your coding skills.",
    category: CATEGORIES.education,
  },
  {
    title: "Simple ML Examples",
    url: "https://github.com/chribsen/simple-machine-learning-examples/tree/master",
    description: "Basic implementations of ML algorithms.",
    category: CATEGORIES.education,
  },
  {
    title: "33 JS Concepts",
    url: "https://github.com/leonardomso/33-js-concepts",
    description: "33 Concepts Every JavaScript Developer Should Know.",
    category: CATEGORIES.education,
  },
  {
    title: "JavaScript Questions",
    url: "https://github.com/lydiahallie/javascript-questions",
    description: "A long list of (advanced) JavaScript questions.",
    category: CATEGORIES.education,
  },
  {
    title: "You Don't Know JS",
    url: "https://github.com/getify/You-Dont-Know-JS",
    description: "Book series diving deep into the core mechanisms of JavaScript.",
    category: CATEGORIES.education,
  },
  {
    title: "Airbnb JS Guide",
    url: "https://github.com/airbnb/javascript",
    description: "A mostly reasonable approach to JavaScript.",
    category: CATEGORIES.education,
  },
  {
    title: "Awesome JavaScript",
    url: "https://github.com/sorrycc/awesome-javascript",
    description: "A collection of awesome browser-side JS libraries and resources.",
    category: CATEGORIES.education,
  },
  {
    title: "Build Your Own X",
    url: "https://github.com/codecrafters-io/build-your-own-x",
    description: "Recreate popular technologies from scratch.",
    category: CATEGORIES.education,
  },
  {
    title: "Project Based Learning",
    url: "https://github.com/practical-tutorials/project-based-learning",
    description: "Learn to code by building projects.",
    category: CATEGORIES.education,
  },
  {
    title: "Awesome LeetCode",
    url: "https://github.com/ashishps1/awesome-leetcode-resources",
    description: "Resources for mastering LeetCode and DSA.",
    category: CATEGORIES.education,
  },
  {
    title: "Awesome Lists",
    url: "https://github.com/sindresorhus/awesome",
    description: "Awesome lists about all kinds of interesting topics.",
    category: CATEGORIES.education,
  },
  {
    title: "Idealist",
    url: "https://github.com/yoheinakajima/idealist",
    description: "Open source projects and ideas.",
    category: CATEGORIES.education,
  },
];

export const componentsLinks: Tool[] = [
  {
    title: "Ark UI",
    favicon: "https://ark-ui.com/icon.svg?3e91f991fe6d39a3",
    url: "https://ark-ui.com/",
    description: "Unstyled, accessible component primitives for building design systems in React, Solid, and Vue.",
    category: CATEGORIES.components,
  },
  {
    title: "Mage UI",
    url: "https://www.mageui.in/",
    description: "Copy-paste animated React components and blocks with Tailwind CSS.",
    category: CATEGORIES.components,
  },
  {
    title: "ThemeCN",
    url: "https://tweakcn.com/",
    description: "Visual theme editor for shadcn/ui — tweak tokens and preview changes live.",
    category: CATEGORIES.components,
  },
  {
    title: "Smooth UI",
    url: "https://www.smoothui.dev/",
    description: "Framer Motion-powered React components with fluid transition animations.",
    category: CATEGORIES.components,
  },
  {
    title: "Spectrum UI",
    url: "https://ui.spectrumhq.in/",
    description: "Dark-mode-first component collection built with Tailwind CSS and Radix primitives.",
    category: CATEGORIES.components,
  },
  {
    title: "Intent UI",
    url: "https://intentui.com/",
    description: "Accessible component library built on React Aria with Tailwind CSS styling.",
    category: CATEGORIES.components,
  },
  {
    title: "Park UI",
    url: "https://park-ui.com/",
    description: "Themeable components built on top of Ark UI and Panda CSS.",
    category: CATEGORIES.components,
  },
  {
    title: "React Bits",
    url: "https://www.reactbits.dev/",
    description: "Animated React components, interaction patterns, and copy-paste snippets.",
    category: CATEGORIES.components,
  },
  {
    title: "Magic UI",
    url: "https://magicui.design/",
    description: "Animated UI components powered by Framer Motion for React and Next.js.",
    category: CATEGORIES.components,
  },
  {
    title: "Cult UI",
    url: "https://www.cult-ui.com/",
    description: "Opinionated, animated copy-paste components with a distinctive dark aesthetic.",
    category: CATEGORIES.components,
  },
  {
    title: "VisGL Google Maps",
    url: "https://visgl.github.io/react-google-maps/",
    description: "React components and hooks for embedding and controlling Google Maps.",
    category: CATEGORIES.components,
  },
  {
    title: "CSS Grid Generator",
    url: "https://cssgridgenerator.io/",
    description: "Drag-and-drop tool to build and export CSS grid layouts.",
    category: CATEGORIES.components,
  },
];

export const colorsLinks: Tool[] = [
  {
    title: "Picular",
    url: "https://picular.co/",
    favicon: "https://picular.co/images/favicon-base.png",
    description: "Search any word to get an AI-matched color palette inspired by it.",
    category: CATEGORIES.colors,
  },
  {
    title: "Colorize",
    url: "https://colorize.design/",
    description: "AI-powered color palette generator with accessible contrast checking.",
    category: CATEGORIES.colors,
  },
  {
    title: "Palette Maker",
    url: "https://palettemaker.com/",
    description: "Create color palettes and preview them instantly on real UI patterns.",
    category: CATEGORIES.colors,
  },
  {
    title: "Gradienty",
    url: "https://gradienty.codes/",
    description: "Browse and copy Tailwind CSS gradient classes across thousands of combinations.",
    category: CATEGORIES.colors,
  },
  {
    title: "Hypercolor",
    url: "https://hypercolor.dev/",
    favicon: "https://hypercolor.dev/favicon.png",
    description: "Curated Tailwind CSS gradient presets — click to copy the class string.",
    category: CATEGORIES.colors,
  },
  {
    title: "WebGradients",
    url: "https://webgradients.com/",
    description: "180 linear CSS gradients with one-click copy of the CSS code.",
    category: CATEGORIES.colors,
  },
  {
    title: "UV Canvas",
    url: "https://uvcanvas.com/",
    favicon: "https://uvcanvas.com/favicon-32x32.png",
    description: "React components for animated mesh and canvas gradient backgrounds.",
    category: CATEGORIES.colors,
  },
];

export const animationsLinks: Tool[] = [
  {
    title: "CSS Loaders",
    url: "https://cssloaders.github.io/",
    description: "Pure CSS loading spinners and skeleton animations — no JavaScript required.",
    category: CATEGORIES.animations,
  },
  {
    title: "Smooothy",
    url: "https://smooothy.vercel.app/",
    description: "Smooth scroll-driven animations and UI transition effects for React.",
    category: CATEGORIES.animations,
  },
];

export const imagesAssetsLinks: Tool[] = [
  {
    title: "unDraw",
    url: "https://undraw.co/",
    description: "Open-source SVG illustrations for any idea — customizable accent color.",
    category: CATEGORIES.imagesAssets,
  },
];

export const resourceLinks: Tool[] = [
  ...dataLinks,
  ...dataVizLinks,
  ...developmentLinks,
  ...educationLinks,
  ...componentsLinks,
  ...colorsLinks,
  ...animationsLinks,
  ...imagesAssetsLinks,
];
