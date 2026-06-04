import { Tool } from "@/types";

export const CATEGORIES = {
  animations: "Animations & Effects",
  colors: "Colors & Gradients",
  components: "UI Components",
  data: "Data",
  dataViz: "Data Visualization",
  designTools: "Design & Creative Tools",
  development: "Development & Code",
  education: "Education",
  imagesAssets: "Images & Assets",
  mapResources: "Map Resources",
  react: "React Resources",
} as const;

export const resourceCategories: string[] = Object.values(CATEGORIES);

export const animationsLinks: Tool[] = [
  {
    title: "Animejs",
    url: "https://animejs.com/",
    description: "A fast, multipurpose and lightweight JavaScript animation library",
    category: CATEGORIES.animations,
  },
  {
    title: "Animista",
    url: "https://animista.net/",
    description:
      "Animista is a CSS animation library and a place where you can play with a collection of ready-made CSS animations and download only those you will use.",
    category: CATEGORIES.animations,
  },
  {
    title: "CSS Loaders",
    url: "https://cssloaders.github.io/",
    description:
      "CSS Loader is a collection of different types of loaders, spinners and their source code. There are no image dependencies in this. It's is done using pure CSS. Hence it is easily customization too.",
    category: CATEGORIES.animations,
  },
  {
    title: "Smooothy",
    url: "https://smooothy.vercel.app/",
    description: "Smooth configurable extendable slider made for animation.",
    category: CATEGORIES.animations,
  },
  {
    title: "Swishy",
    url: "https://www.swishy.ai/",
    description:
      "Swishy is the leading AI motion designer and AI animator platform. Create professional motion graphics, animated typefaces, and stunning video animations without After Effects. Export to MP4, MOV, and GIF instantly.",
    category: CATEGORIES.animations,
  },
  {
    title: "FlipOff.",
    url: "https://github.com/magnum6actual/flipoff",
    description:
      "Free split-flap display emulator for any TV. The classic flip-board look, without the $3,500 hardware.",
    category: CATEGORIES.animations,
  },
];

export const colorsLinks: Tool[] = [
  {
    title: "Colorize",
    url: "https://colorize.design/",
    description:
      "Generate color palettes instantly from any website effortlessly. Enter a URL to explore color schemes and combinations directly from the site's design. No sign-up required. Try it now!",
    category: CATEGORIES.colors,
  },
  {
    title: "CSS Gradient",
    url: "https://cssgradient.io/",
    description:
      "As a free CSS gradient generator tool, this website lets you create a colorful gradient background for your website, blog, or social media profile.",
    category: CATEGORIES.colors,
  },
  {
    title: "Gradienty",
    url: "https://gradienty.codes/",
    description:
      "Easily create beautiful Tailwind CSS gradients with Gradienty - a CSS generator. Choose from ready-made gradients or customize your own for eye-catching backgrounds, text effects, and glassmorphism designs. Perfect for websites, apps, and more. Try it for free now!",
    category: CATEGORIES.colors,
  },
  {
    title: "Hypercolor",
    url: "https://hypercolor.dev/",
    favicon: "https://hypercolor.dev/favicon.png",
    description:
      "A curated collection of beautiful Tailwind CSS gradients using the full range of Tailwind CSS colors. Easily copy and paste the class names, CSS or even save the gradients as an image.",
    category: CATEGORIES.colors,
  },
  {
    title: "Liquid Glass JS",
    url: "https://dashersw.github.io/liquid-glass-js/",
    description:
      "A WebGL-powered JavaScript library bringing sophisticated Apple Liquid Glass effects to the web with real-time refraction, blur, and masking systems.",
    category: CATEGORIES.colors,
  },
  {
    title: "Palette Maker",
    url: "https://palettemaker.com/",
    description:
      "Free color tool for creatives and color lovers. Create color palettes and preview them on UI/UX, Illustrations, Web, Apps, Branding and other designs.",
    category: CATEGORIES.colors,
  },
  {
    title: "Picular",
    url: "https://picular.co/",
    favicon: "https://picular.co/images/favicon-base.png",
    description:
      "Picular is a rocket fast primary color generator using Google’s image search. If you ever needed the perfect yellow hex code from a banana, this is the tool for you.",
    category: CATEGORIES.colors,
  },
  {
    title: "Shader Gradient",
    url: "https://shadergradient.co/",
    description: "Create beautiful moving gradients on Framer, Figma and React",
    category: CATEGORIES.colors,
  },
  {
    title: "WebGradients",
    url: "https://webgradients.com/",
    description:
      "Browse 180 free CSS gradients for backgrounds, UI, websites, and design systems. Copy CSS code, explore color palettes, and find gradient inspiration fast.",
    category: CATEGORIES.colors,
  },
  {
    title: "Picture Palette",
    url: "https://picture-palette.web.app/",
    description: "Aesthetically pleasing color palettes based on aesthetically pleasing pictures.",
    category: CATEGORIES.colors,
  },
];

export const componentsLinks: Tool[] = [
  {
    title: "Ark UI",
    url: "https://ark-ui.com/",
    favicon: "https://ark-ui.com/icon.svg?3e91f991fe6d39a3",
    description:
      "A headless UI library with over 45+ components designed to build reusable, scalable Design Systems that works for a wide range of JS frameworks.",
    category: CATEGORIES.components,
  },
  {
    title: "Mage UI",
    url: "https://www.mageui.in/",
    description:
      "Hand-crafted animated components that you can copy and paste into your apps. Free & Open Source.",
    category: CATEGORIES.components,
  },
  {
    title: "ThemeCN",
    url: "https://tweakcn.com/",
    description:
      "Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.",
    category: CATEGORIES.components,
  },
  {
    title: "Smooth UI",
    url: "https://www.smoothui.dev/",
    description:
      "Animated React components with smooth Motion animations. Drop-in shadcn/ui compatible, fully customizable with Tailwind CSS.",
    category: CATEGORIES.components,
  },
  {
    title: "Spectrum UI",
    url: "https://ui.spectrumhq.in/",
    description:
      "Copy-paste beautiful UI components built with React, Next.js, Tailwind CSS, and shadcn/ui. 250+ production-ready components, blocks, and templates. Free and open source.",
    category: CATEGORIES.components,
  },
  {
    title: "Intent UI",
    url: "https://intentui.com/",
    description:
      "Copy and paste accessible React components built on React Aria and Tailwind CSS. 87+ production-ready components for Next.js and Laravel.",
    category: CATEGORIES.components,
  },
  {
    title: "Park UI",
    url: "https://park-ui.com/",
    description:
      "Beautifully designed components built with Ark UI and Panda CSS that work with a variety of JS frameworks.",
    category: CATEGORIES.components,
  },
  {
    title: "React Bits",
    url: "https://www.reactbits.dev/",
    description:
      "An open source collection of high quality, animated, interactive & fully customizable React components for building stunning, memorable user interfaces.",
    category: CATEGORIES.components,
  },
  {
    title: "Magic UI",
    url: "https://magicui.design/",
    description: "Beautiful UI components and templates to make your landing page look stunning.",
    category: CATEGORIES.components,
  },
  {
    title: "Cult UI",
    url: "https://www.cult-ui.com/",
    description:
      "Open-source Shadcn UI components, animated blocks, and full templates you can copy-paste into any TypeScript/Next.js project.",
    category: CATEGORIES.components,
  },
  {
    title: "Refero Styles",
    url: "https://styles.refero.design/",
    description:
      "Search a curated DESIGN.md library for AI agents: colors, typography, spacing, and component patterns from top websites. Part of Refero.",
    category: CATEGORIES.components,
  },
  {
    title: "Plate rich-text editor",
    url: "https://platejs.org/",
    description:
      "A set of beautifully-designed, customizable plugins and components to help you build your rich-text editor. Open Source.",
    category: CATEGORIES.components,
  },
  {
    title: "Dot Matrix",
    url: "https://dotmatrix.zzzzshawn.cloud/",
    description:
      "React component library of dot matrix loaders—expressive loading primitives you install via the shadcn registry and own as local code.",
    category: CATEGORIES.components,
  },
  {
    title: "Footer — The only footer gallery on earth.",
    url: "https://www.footer.design/",
    description:
      "Footer is a curated gallery of the top website footer inspiration on earth. Find the footers you need and sort by type and style.",
    category: CATEGORIES.components,
  },
];

export const dataLinks: Tool[] = [
  {
    title: "Public APIs",
    url: "https://github.com/public-apis/public-apis",
    description: "A collective list of free APIs.",
    category: CATEGORIES.data,
  },
  {
    title: "Free Public APIs",
    url: "https://www.freepublicapis.com/",
    description:
      "A collection of Free Public APIs for Students and Developers. Tested every single day.",
    category: CATEGORIES.data,
  },
  {
    title: "PublicAPIs.dev",
    url: "https://publicapis.dev/",
    description:
      "A collection of public APIs for developers, categorized and crowdsourced. Animals, books, cryptocurrencies, development, music, weather and much more.",
    category: CATEGORIES.data,
  },
  {
    title: "Apify",
    url: "https://apify.com/",
    description:
      "Cloud platform for web scraping, browser automation, AI agents, and data for AI. Use 35,000+ ready-made tools, code templates, or order a custom solution.",
    category: CATEGORIES.data,
  },
  {
    title: "MCP Servers",
    url: "https://github.com/modelcontextprotocol/servers",
    description:
      "Official and community Model Context Protocol server implementations for AI tool integrations.",
    category: CATEGORIES.data,
  },
  {
    title: "Microlink",
    url: "https://microlink.io/",
    description:
      "Turn any URL into structured data. The all-in-one API for browser automation: screenshots, PDFs, scraping, and link previews. No infrastructure to manage.",
    category: CATEGORIES.data,
  },
];

export const dataVizLinks: Tool[] = [
  {
    title: "Apache ECharts",
    url: "https://echarts.apache.org/en/index.html",
    description: "A powerful, interactive charting and visualization library for browser",
    category: CATEGORIES.dataViz,
  },
];

export const designToolsLinks: Tool[] = [
  {
    title: "Logo Lattice",
    url: "https://logolattice.com/",
    description: "Draw logos quickly with snapped square and isometric grids.",
    category: CATEGORIES.designTools,
  },
  {
    title: "Planner 5D",
    url: "https://planner5d.com/",
    description:
      "An advanced and easy-to-use 2D/3D house design tool. Create your dream home design with powerful but easy software by Planner 5D.",
    category: CATEGORIES.designTools,
  },
  {
    title: "Omma",
    url: "https://omma.build/",
    description: "Build interactive experiences, websites, 3d, and apps using natural language.",
    category: CATEGORIES.designTools,
  },
  {
    title: "OS Design Directory",
    url: "https://design-directory-blue.vercel.app/",
    description: "Curated design resources, tools, and inspiration for designers and developers.",
    category: CATEGORIES.designTools,
  },
  {
    title: "Storyboard Maker",
    url: "https://storytribeapp.com/",
    description:
      "Free online storyboard software for film, education, UX, and marketing. Create professional storyboards — no drawing skills needed.",
    category: CATEGORIES.designTools,
  },
  {
    title: "Endless Tools",
    url: "https://endlesstools.io/",
    description:
      "No-coding tool to create 3D assets, key visual for social media, identity elements and other marketing and design need.",
    category: CATEGORIES.designTools,
  },
  {
    title: "Maket | AI-Powered Floor Plan Creation",
    url: "https://www.maket.ai/",
    description:
      "Maket uses generative AI so homeowners, architects, and builders can quickly design, plan, and visualize residential projects in just a few simple steps.",
    category: CATEGORIES.designTools,
  },
  {
    title: "PaperMe - Custom Paper Generator",
    url: "https://paperme.pixzens.com/",
    description:
      "Free online tool to create and print custom papers. Design lined paper, grid paper, dot paper, music paper, and more. Adjust size, color, and spacing to meet all your needs.",
    category: CATEGORIES.designTools,
  },
];

export const developmentLinks: Tool[] = [
  {
    title: "GitDocify",
    url: "https://gitdocify.com/",
    description:
      "Turn any GitHub repository into structured, source-grounded documentation with GitDocify..",
    category: CATEGORIES.development,
  },
  {
    title: "Omatsuri",
    url: "https://omatsuri.app/",
    description: "Progressive Web Application with 12 open source frontend focused tools",
    category: CATEGORIES.development,
  },
  {
    title: "Postgres Sandbox",
    url: "https://database.build/",
    description: "In-browser Postgres sandbox with AI assistance",
    category: CATEGORIES.development,
  },
  {
    title: "TinyWow",
    url: "https://tinywow.com/",
    description: "Free AI Writing, PDF, Image, and other Online Tools",
    category: CATEGORIES.development,
  },
  {
    title: "Liam ERD",
    url: "https://liambx.com/",
    description:
      "Automatically generates beautiful and easy-to-read ER diagrams from your database.",
    category: CATEGORIES.development,
  },
  {
    title: "CSS Grid Generator",
    url: "https://cssgridgenerator.io/",
    description:
      "A user-friendly tool designed for web developers to effortlessly create customizable CSS grids for seamless web development.",
    category: CATEGORIES.development,
  },
  {
    title: "OpenFlowKit",
    url: "https://openflowkit.com/",
    description:
      "Open-source, local-first AI diagramming for architecture diagrams, flowcharts, system design, and editable exports. No signup required.",
    category: CATEGORIES.development,
  },
  {
    title: "Replit",
    url: "https://replit.com/",
    description:
      "Build and deploy software collaboratively with the power of AI without spending a second on setup.",
    category: CATEGORIES.development,
  },
  {
    title: "Web Apps by 123apps",
    url: "https://123apps.com/",
    description: "Online Tools for Video, Audio, PDF, and File Conversion.",
    category: CATEGORIES.development,
  },
];

export const educationLinks: Tool[] = [
  {
    title: "Coddy",
    url: "https://coddy.tech/",
    description: "Interactive lessons in Python, JavaScript, SQL, and 15+ languages.",
    category: CATEGORIES.education,
  },
  {
    title: "Codecademy",
    url: "https://www.codecademy.com/",
    description:
      "Learn the technical skills to get the job you want. Join over 50 million people choosing Codecademy to start a new career (or advance in their current one).",
    category: CATEGORIES.education,
  },
  {
    title: "Codédex",
    url: "https://www.codedex.io/",
    description:
      "Journey through the fantasy land of Python, HTML, CSS, or JavaScript, earn experience points (XP) to unlock new regions, and collect all the badges at your own pace. Start your adventure today.",
    category: CATEGORIES.education,
  },
  {
    title: "DeepWiki",
    url: "https://deepwiki.com/",
    description:
      "DeepWiki provides up-to-date documentation you can talk to, for every repo in the world. Think Deep Research for GitHub - powered by Devin.",
    category: CATEGORIES.education,
  },
  {
    title: "devQuizzes",
    url: "https://quizzes.madza.dev/",
    description:
      "devQuizzes is the platform where you can test your knowledge on various DEV topics.",
    category: CATEGORIES.education,
  },
  {
    title: "Learn Anything",
    url: "https://learn-anything.xyz/",
    description:
      "Discover and learn about any topic with Learn-Anything. Our free, comprehensive platform connects you to the best resources for every subject. Start learning today!",
    category: CATEGORIES.education,
  },
  {
    title: "Mind Luster",
    url: "https://www.mindluster.com/",
    description:
      " Discover Free Online Certified Courses - Programming - Graphic - Accounting - Languages - English - Computer - Technology designed by experts and universities ",
    category: CATEGORIES.education,
  },
  {
    title: "Developer Roadmaps",
    url: "https://roadmap.sh/",
    description:
      "Community driven roadmaps, articles and guides for developers to grow in their career.",
    category: CATEGORIES.education,
  },
  {
    title: "QuickRef",
    url: "https://quickref.me/",
    description: "Share quick reference and cheat sheet for developers",
    category: CATEGORIES.education,
  },
  {
    title: "Web Skills",
    url: "https://andreasbm.github.io/web-skills/",
    description: "A visual overview of useful skills to learn as a web developer",
    category: CATEGORIES.education,
  },
  {
    title: "App Ideas",
    url: "https://github.com/florinpop17/app-ideas",
    description:
      "A Collection of application ideas which can be used to improve your coding skills.",
    category: CATEGORIES.education,
  },
  {
    title: "33 JS Concepts",
    url: "https://github.com/leonardomso/33-js-concepts",
    description: "33 JavaScript concepts every developer should know.",
    category: CATEGORIES.education,
  },
  {
    title: "JavaScript Questions",
    url: "https://github.com/lydiahallie/javascript-questions",
    description: "A long list of advanced JavaScript questions, and their explanations.",
    category: CATEGORIES.education,
  },
  {
    title: "You Don't Know JS",
    url: "https://github.com/getify/You-Dont-Know-JS",
    description: "A book series (2 published editions) on the JS language.",
    category: CATEGORIES.education,
  },
  {
    title: "Airbnb JS Guide",
    url: "https://javascript.airbnb.tech/",
    description: "A mostly reasonable approach to JavaScript.",
    category: CATEGORIES.education,
  },
  {
    title: "Awesome JavaScript",
    url: "https://github.com/sorrycc/awesome-javascript",
    description:
      "A collection of awesome browser-side JavaScript libraries, resources and shiny things.",
    category: CATEGORIES.education,
  },
  {
    title: "Build Your Own X",
    url: "https://github.com/codecrafters-io/build-your-own-x",
    description: "Master programming by recreating your favorite technologies from scratch.",
    category: CATEGORIES.education,
  },
  {
    title: "Code Crafters",
    url: "https://app.codecrafters.io/",
    description:
      "Advanced programming challenges for experienced engineers. Rebuild real production tools like Redis, Git, and SQLite from scratch in your IDE.",
    category: CATEGORIES.education,
  },
  {
    title: "Project Based Learning",
    url: "https://github.com/practical-tutorials/project-based-learning",
    description: "Curated list of project-based tutorials.",
    category: CATEGORIES.education,
  },
  {
    title: "Awesome LeetCode",
    url: "https://github.com/ashishps1/awesome-leetcode-resources",
    description:
      "Awesome LeetCode resources to learn Data Structures and Algorithms and prepare for Coding Interviews.",
    category: CATEGORIES.education,
  },
  {
    title: "Awesome Lists",
    url: "https://github.com/sindresorhus/awesome",
    description: "Awesome lists about all kinds of interesting topics.",
    category: CATEGORIES.education,
  },
  {
    title: "CSV Vis Tool",
    url: "https://csvistool.com/",
    description:
      "Official data structures and algorithms visualization tool for CS 1332 at Georgia Tech.",
    category: CATEGORIES.education,
  },
  {
    title: "Loot Drop",
    url: "https://www.loot-drop.io/",
    description:
      "Explore 1100+ failed startups and learn from $40B+ in burned venture capital. Discover why they failed, their market potential, and how to rebuild them with today's tech",
    category: CATEGORIES.education,
  },
  {
    title: "Powerful Websites",
    url: "https://powerfulwebsites.io/",
    description:
      "Discover 125+ powerful websites and free tools that most people don't know about. Curated directory of useful apps, AI tools, design resources, and hidden gems built by indie developers.",
    category: CATEGORIES.education,
  },
  {
    title: "freemediaheckyeah",
    url: "https://fmhy.net/",
    description: "The largest collection of free stuff on the internet!",
    category: CATEGORIES.education,
  },
  {
    title: "HF Viewer",
    url: "https://hfviewer.com/",
    description:
      "View any Hugging Face model. We believe good understanding of AI models unlocks innovative ideas.",
    category: CATEGORIES.education,
  },
  {
    title: "The Odin Project",
    url: "https://www.theodinproject.com/",
    description:
      "The Odin Project empowers aspiring web developers to learn together for free. Our full stack curriculum is free and supported by a passionate open source community.",
    category: CATEGORIES.education,
  },
];

export const imagesAssetsLinks: Tool[] = [
  {
    title: "unDraw",
    url: "https://undraw.co/",
    description:
      "Open-source illustrations for any idea you can imagine and create. Build beautiful websites, products and applications with your color, for free.",
    category: CATEGORIES.imagesAssets,
  },
  {
    title: "Newt",
    url: "https://newt.sh/",
    description:
      "A code-native pixel art tool. Paint like a normal raster editor; underneath, every pixel is a color token in clean, editable code. Export SVG, CSS, React, PNG, and GIF.",
    category: CATEGORIES.imagesAssets,
  },
];

export const mapLinks: Tool[] = [
  {
    title: "Arnis",
    url: "https://arnismc.com/",
    description:
      "Generate Minecraft worlds from real-world locations. Free, open-source tool to recreate your hometown, city, or any place on Earth in Minecraft.",
    category: CATEGORIES.mapResources,
  },
  {
    title: "Cityweft",
    url: "https://cityweft.com/",
    description:
      "Generate clean, editable 3D site context for any location on Earth — ready for your CAD, BIM, or generative-design workflow.",
    category: CATEGORIES.mapResources,
  },
  {
    title: "mapcn",
    url: "https://www.mapcn.dev/",
    description:
      "A collection of beautifully designed, accessible, and customizable map components. Built on MapLibre GL. Styled with Tailwind CSS. Works with shadcn/ui.",
    category: CATEGORIES.mapResources,
  },
  {
    title: "shadcnmaps",
    url: "https://www.shadcnmaps.com/",
    description:
      "170+ interactive SVG map components for React. Countries, continents, and US states. No dependencies — install via shadcn CLI with pure Tailwind CSS styling.",
    category: CATEGORIES.mapResources,
  },
  {
    title: "Terraink: Free Map Poster & Wallpaper Creator",
    url: "https://terraink.app/",
    description:
      "Free online map poster and wallpaper generator. Design custom, print-ready map art for any city or location — export as PNG, PDF, or SVG. No sign-up required.",
    category: CATEGORIES.mapResources,
  },
  {
    title: "VisGL Google Maps",
    url: "https://visgl.github.io/react-google-maps/",
    description: "React components and hooks for the Google Maps JavaScript API",
    category: CATEGORIES.mapResources,
  },
];

export const reactLinks: Tool[] = [
  {
    title: "React Three Fiber",
    url: "https://r3f.docs.pmnd.rs/getting-started/introduction",
    description: "React-three-fiber is a React renderer for three.js.",
    category: CATEGORIES.react,
  },
  {
    title: "UV Canvas",
    url: "https://uvcanvas.com/",
    favicon: "https://uvcanvas.com/favicon-32x32.png",
    description: "An open source React.js component library for beautifully shaded canvas.",
    category: CATEGORIES.react,
  },
  {
    title: "React Haiku",
    url: "https://www.reacthaiku.dev/",
    description: "A minimal React Hooks library that saves you time and lines of code.",
    category: CATEGORIES.react,
  },
  {
    title: "Frimousse",
    url: "https://frimousse.liveblocks.io/",
    description:
      "Open-source, lightweight, unstyled, and composable emoji picker for React—originally created for Liveblocks Comments. Styles can be applied with CSS, Tailwind CSS, CSS-in-JS, and more.",
    category: CATEGORIES.react,
  },
];

export const resourceLinks: Tool[] = [
  ...animationsLinks,
  ...colorsLinks,
  ...componentsLinks,
  ...dataLinks,
  ...dataVizLinks,
  ...designToolsLinks,
  ...developmentLinks,
  ...educationLinks,
  ...imagesAssetsLinks,
  ...mapLinks,
  ...reactLinks,
];
