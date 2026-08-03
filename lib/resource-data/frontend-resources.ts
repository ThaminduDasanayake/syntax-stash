import { Tool } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const frontendLinks: Tool[] = [
  {
    title: "21st Dev",
    category: CATEGORIES.frontend,
    description:
      "Explore, copy, and remix thousands of high-quality React components published to the 21st.dev Community by designers and developers.",
    tags: [TAGS.react],
    url: "https://21st.dev/",
  },
  {
    title: "Aceternity UI",
    category: CATEGORIES.frontend,
    description:
      "Copy-paste beautiful UI components built with React, Next.js, Tailwind CSS, and Framer Motion. 200+ free components, blocks, and templates.",
    tags: [TAGS["ui-component"]],
    url: "https://ui.aceternity.com/",
  },
  {
    title: "AI Elements",
    category: CATEGORIES.frontend,
    description:
      "A component library and custom registry built on top of shadcn/ui to help you build AI-native applications faster.",
    favicon: "https://elements.ai-sdk.dev/favicon.ico",
    ogImage:
      "https://raw.githubusercontent.com/vercel/ai-elements/main/apps/docs/app/opengraph-image.png",
    tags: [TAGS["ui-component"]],
    url: "https://elements.ai-sdk.dev/",
  },
  {
    title: "All ShadCN",
    category: CATEGORIES.frontend,
    description:
      "Explore All Shadcn, your go-to hub for premium & free Shadcn Themes, Components, Blocks, and Tools.",
    ogImage:
      "https://cdn.allshadcn.com/as-assets/og-images/static-pages/all-shadcn---300+-shadcn-templates,-components,-blocks-&-tools.png",
    subtitle: "300+ Shadcn Templates, Components, Blocks & Tools",
    tags: [TAGS["ui-component"]],
    url: "https://allshadcn.com/",
  },
  {
    title: "Animate UI",
    category: CATEGORIES.frontend,
    description:
      "Fully animated, open-source component distribution built with React, TypeScript, Tailwind CSS, Motion and Shadcn CLI. Browse a list of components you can install, modify, and use in your projects.",
    subtitle: "Animated React Components",
    tags: [TAGS["ui-component"]],
    url: "https://animate-ui.com/",
  },
  {
    title: "Animejs",
    category: CATEGORIES.frontend,
    description: "A fast, multipurpose and lightweight JavaScript animation library",
    tags: [TAGS.animation],
    url: "https://animejs.com/",
  },
  {
    title: "Animista",
    category: CATEGORIES.frontend,
    description:
      "Animista is a CSS animation library and a place where you can play with a collection of ready-made CSS animations and download only those you will use.",
    tags: [TAGS.animation],
    url: "https://animista.net/",
  },
  {
    title: "Animmaster Lib",
    category: CATEGORIES.frontend,
    description:
      "Animmaster Lib — a modern frontend library of 300 PRO-level animated UI components with live video previews. Scroll animations, WebGL shaders, hero sections, sliders, menus and more — copy, paste, ship.",
    tags: [TAGS.animation],
    url: "https://animmasterlib.dev/",
  },
  {
    title: "Apache ECharts",
    category: CATEGORIES.frontend,
    description: "A powerful, interactive charting and visualization library for browser",
    tags: [TAGS["data-viz"]],
    url: "https://echarts.apache.org/en/index.html",
  },
  {
    title: "Ark UI",
    category: CATEGORIES.frontend,
    description:
      "A headless UI library with over 45+ components designed to build reusable, scalable Design Systems that works for a wide range of JS frameworks.",
    favicon: "https://ark-ui.com/icon.svg?3e91f991fe6d39a3",
    tags: [TAGS["ui-component"]],
    url: "https://ark-ui.com/",
  },
  {
    title: "Atropos",
    category: CATEGORIES.frontend,
    description:
      "Atropos is a lightweight, free and open-source JavaScript library to create stunning touch-friendly 3D parallax hover effects.",
    tags: [TAGS.animation],
    url: "https://atroposjs.com/",
  },
  {
    title: "AutoAnimate",
    category: CATEGORIES.frontend,
    description:
      "A zero-config, drop-in animation utility that automatically adds smooth transitions to your web app. Use it with React, Solid, Vue, Svelte, or any other JavaScript application.",
    subtitle: "Add motion to your apps with a single line of code",
    tags: [TAGS.animation],
    url: "https://auto-animate.formkit.com/",
  },
  {
    title: "Background Snippets Generator",
    author: "naymur rahman",
    category: CATEGORIES.frontend,
    description:
      "Generate beautiful CSS background patterns, gradients, textures, and snippets for your website. Perfect for modern web design and UI backgrounds.",
    ogImage: "https://tools.ui-layouts.com/bgsnippets.jpg",
    url: "https://tools.ui-layouts.com/background-snippets",
  },
  {
    title: "beUI",
    category: CATEGORIES.frontend,
    description:
      "The motion toolkit for React and Next.js. Free, open-source, shadcn-compatible components built on Framer Motion and Tailwind CSS. Copy-paste the source or install with the shadcn CLI.",
    subtitle: "The motion toolkit for React & Next.js",
    tags: [TAGS.animation, TAGS.react, TAGS["ui-component"]],
    url: "https://beui.dev/",
  },
  {
    title: "Bklit UI",
    category: CATEGORIES.frontend,
    description:
      "Bklit UI is a component library built on top of shadcn/ui to help you build charts and data visualizations more easily.",
    subtitle: "Charts & Data Visualization Components",
    tags: [TAGS["ui-component"]],
    url: "https://bklit.com/",
  },
  {
    title: "Blossom Carousel",
    category: CATEGORIES.frontend,
    description: "Enhance native scrolling with dragging instead of replacing it.",
    tags: [TAGS["ui-component"]],
    url: "https://www.blossom-carousel.com/",
  },
  {
    title: "boneyard",
    category: CATEGORIES.frontend,
    description:
      "Pixel-perfect skeleton loading screens auto-extracted from your real DOM. Zero configuration, zero layout shift.",
    subtitle: "skeleton screens for your UI",
    tags: [TAGS["ui-component"]],
    url: "https://boneyard.vercel.app/",
  },
  {
    title: "Brik",
    category: CATEGORIES.frontend,
    description:
      "Build your tailor-made stack of AI-powered design tools for animations, 2D & 3D visuals, text effects, and images. Remix, share, export, and scale.",
    tags: [TAGS.animation],
    url: "https://brik.space/",
  },
  {
    title: "Bundui",
    category: CATEGORIES.frontend,
    description:
      "Tailwind is a carefully curated collection of 200+ handcrafted UI components built with CSS, React, and shadcn/ui.",
    favicon: "https://bundui.io/logo.svg",
    ogImage: "https://bundui.io/og-image.png",
    subtitle: "Tailwind CSS & shadcn/ui components, UI blocks, examples and more.",
    tags: [TAGS["ui-component"]],
    url: "https://bundui.io/",
  },
  {
    title: "BuouUI",
    author: "buou",
    category: CATEGORIES.frontend,
    description:
      "This is a beautiful UI library with components, sections, landing page, and templates using Tailwind CSS.",
    favicon: "https://buouui.com/apple-touch-icon.png",
    ogImage: "https://buouui.com/og.jpg",
    tags: [TAGS["ui-component"]],
    url: "https://buouui.com/",
  },
  {
    title: "Clonify",
    category: CATEGORIES.frontend,
    description:
      "Speed up your site builds with 1K+ ready-made Framer and Figma assets — sections, wireframes, templates, and UI kits all in one place.",
    subtitle: "Your All-in-One Framer & Figma UI Library",
    tags: [TAGS["ui-component"]],
    url: "https://clonify.io/",
  },
  {
    title: "CodePen",
    category: CATEGORIES.frontend,
    description: "Build, share, and learn JavaScript, CSS, and HTML with our online code editor.",
    subtitle: "Online Code Editor and Front End Web Developer Community",
    url: "https://codepen.io/",
  },
  {
    title: "Componentry",
    author: "Harsh Jadhav",
    category: CATEGORIES.frontend,
    className: "bg-foreground border-paper",
    description:
      "Beautiful, animated React UI components with styling and motion already handled. Built with Tailwind CSS, TypeScript, and Framer Motion.",
    favicon: "https://componentry.dev/icon.svg",
    ogImage: "https://componentry.dev/opengraph-image.png",
    subtitle: "Beautiful Animated UI Components for React",
    tags: [TAGS["ui-component"]],
    url: "https://componentry.dev/",
  },
  {
    title: "Components – Chánh Đại",
    author: "Chánh Đại",
    category: CATEGORIES.frontend,
    description: "Pixel-perfect, uniquely crafted.",
    tags: [TAGS.animation, TAGS["ui-component"]],
    url: "https://chanhdai.com/components",
  },
  {
    title: "coss ui",
    category: CATEGORIES.frontend,
    description: "Built for developers and AI.",
    favicon: "https://coss.com/ui/favicon.ico",
    ogImage: "https://coss.com/ui/opengraph-image.png",
    subtitle: "A new, modern UI component library built on top of Base UI",
    tags: [TAGS["ui-component"]],
    url: "https://coss.com/ui",
  },
  {
    title: "Cover Flow",
    category: CATEGORIES.frontend,
    description: "iOS-like Cover Flow for React.",
    tags: [TAGS["ui-component"]],
    url: "https://coverflow.ashishgogula.in/",
  },
  {
    title: "CSS-Tricks",
    category: CATEGORIES.frontend,
    description: "A Website About Making Websites",
    url: "https://css-tricks.com/",
  },
  {
    title: "CSS Buttons",
    category: CATEGORIES.frontend,
    description:
      "Explore Cssbuttons.io for a diverse collection of over 100 unique button styles. Get the code you need to enhance your web projects with stylish, functional buttons. Elevate your design with ease and creativity!",
    favicon: "https://cssbuttons.io/favicon-96x96.png",
    ogImage:
      "https://imagedelivery.net/KMb5EadhEKC1gAE0LkjL1g/cb814b9d-45f8-46f5-3108-91e511990200/public",
    tags: [TAGS["ui-component"]],
    url: "https://cssbuttons.io/",
  },
  {
    title: "CSS Diner",
    author: "Luke Pacholski",
    category: CATEGORIES.frontend,
    description: "A fun game to help you learn and practice CSS selectors.",
    favicon: "https://flukeout.github.io/favicon.png",
    ogImage: "https://flukeout.github.io/images/fb-share.jpg",
    subtitle: "Where we feast on CSS Selectors!",
    tags: [TAGS.css],
    url: "https://flukeout.github.io/",
  },
  {
    title: "CSS Loaders",
    author: "Temani Afif",
    category: CATEGORIES.frontend,
    description:
      "The biggest collection of CSS-only loaders. More than 600 loading animations made by Temani Afif using a single element.",
    subtitle: "A collection of more than 600 loading animations",
    tags: [TAGS.animation],
    url: "https://css-loaders.com/",
  },
  {
    title: "CSS Loaders",
    category: CATEGORIES.frontend,
    className: "bg-foreground border-paper",
    description:
      "CSS Loader is a collection of different types of loaders, spinners and their source code. There are no image dependencies in this. It's is done using pure CSS. Hence it is easily customization too.",
    tags: [TAGS.animation],
    url: "https://cssloaders.github.io/",
  },
  {
    title: "CSS Polka Dot Generator",
    author: "Brian Louis Ramirez",
    category: CATEGORIES.frontend,
    description:
      "Generate polka dot patterns using CSS custom variables for background images. No JS required.",
    favicon: "https://screenspan.net/favicon.svg",
    ogImage: "https://screenspan.net/img/polka-hero.jpg",
    tags: [TAGS.patterns],
    url: "https://screenspan.net/polka/",
  },
  {
    title: "CuiCui",
    author: "Damien Schneider",
    category: CATEGORIES.frontend,
    description: "A collection of UI components for advanced applications.",
    tags: [TAGS["ui-component"]],
    url: "https://cuicui.day/",
  },
  {
    title: "Cult UI",
    category: CATEGORIES.frontend,
    description:
      "Open-source Shadcn UI components, animated blocks, and full templates you can copy-paste into any TypeScript/Next.js project.",
    tags: [TAGS["ui-component"]],
    url: "https://www.cult-ui.com/",
  },
  {
    title: "daisyUI",
    category: CATEGORIES.frontend,
    description:
      "Tailwind CSS component library by daisyUI. Build faster with semantic components, built-in themes, and reusable UI blocks.",
    favicon: "https://img.daisyui.com/images/daisyui/mark.svg",
    ogImage: "https://img.daisyui.com/images/default.webp",
    subtitle: "Tailwind CSS Component Library",
    tags: [TAGS["ui-component"]],
    url: "https://daisyui.com/",
  },
  {
    title: "DASCA",
    category: CATEGORIES.frontend,
    description:
      "Desktop visual effects software for video, images and 3D. Pixel sorting, dithering, blob tracking and more with real‑time previews and a smooth workflow.",
    subtitle: "Real-Time Visual Effects for Image/Video/3D",
    tags: [TAGS.animation],
    url: "https://dasca.studio/",
  },
  {
    title: "devl.dev",
    category: CATEGORIES.frontend,
    description:
      "Two years of UI experiments. 159+ components built on coss-ui, all on the shadcn registry. Press 'c' on any design to copy the source.",
    subtitle: "UI experiments built on coss-ui",
    tags: [TAGS["ui-component"]],
    url: "https://www.devl.dev/",
  },
  {
    title: "Dot Matrix",
    category: CATEGORIES.frontend,
    description:
      "React component library of dot matrix loaders—expressive loading primitives you install via the shadcn registry and own as local code.",
    tags: [TAGS["ui-component"]],
    url: "https://dotmatrix.zzzzshawn.cloud/",
  },
  {
    title: "driver.js",
    category: CATEGORIES.frontend,
    description:
      "A light-weight, no-dependency, vanilla JavaScript library to drive user's focus across the page.",
    tags: [TAGS.animation],
    url: "https://driverjs.com/",
  },
  {
    title: "EaseMaster",
    author: "Satish Kumar",
    category: CATEGORIES.frontend,
    description:
      "Design motion that feels real. The ultimate easing visualization tool for generating Cubic Bezier curves and Spring physics for CSS, Tailwind, Framer Motion, and GSAP.",
    favicon: "https://easemaster.satisui.xyz/icon0.svg",
    ogImage: "https://easemaster.satisui.xyz/og-image.png",
    subtitle: "CSS & Spring Easing Generator",
    tags: [TAGS.animation],
    url: "https://easemaster.satisui.xyz/",
  },
  {
    title: "Easing Graphs",
    category: CATEGORIES.frontend,
    className: "bg-foreground border-paper",
    description: "A curated collection of easing graphs",
    favicon: "https://www.easing.dev/logo.svg",
    ogImage: "https://easing.dev/opengraph-image.png?f63f59cbea8235ed",
    tags: [TAGS.animation],
    url: "https://www.easing.dev/",
  },
  {
    title: "Easing Wizard",
    category: CATEGORIES.frontend,
    description:
      "Generate and customize CSS easing functions with ease and magical precision using Easing Wizard 🧙",
    subtitle: "CSS Easing Editor and Generator",
    tags: [TAGS.animation],
    url: "https://easingwizard.com/",
  },
  {
    title: "Efferd - Beautiful Shadcn blocks for Busy & Smart devs.",
    category: CATEGORIES.frontend,
    description:
      "Save hours of design time with clean, ready-to-use shadcn blocks that just work — modern, responsive, and built for speed.",
    tags: [TAGS["ui-component"]],
    url: "https://efferd.com/",
  },
  {
    title: "ElevenLabs UI",
    author: "ElevenLabs",
    category: CATEGORIES.frontend,
    description:
      "A collection of Open Source agent and audio components that you can customize and extend.",
    favicon: "https://ui.elevenlabs.io/apple-touch-icon.png",
    ogImage: "https://ui.elevenlabs.io/opengraph-image.png",
    tags: [TAGS.audio, TAGS["ui-component"]],
    url: "https://ui.elevenlabs.io/",
  },
  {
    title: "Epic Easing",
    category: CATEGORIES.frontend,
    description:
      "Quickly and easily generate easing curves for ease, spring, and bounce animations. Utilize animation presets or create your own custom animation curve, spring, or bounce. Instantly export to CSS, SCSS, Objective-C, and Swift.",
    ogImage: "https://epiceasing.com/epiceasing_preview.png",
    url: "https://epiceasing.com/",
  },
  {
    title: "Fancy Components",
    author: "Daniel Petho",
    category: CATEGORIES.frontend,
    description:
      "Ready to use, fancy React components to make the web fun again. Free & Open Source.",
    ogImage: "https://fancycomponents.dev/og.jpg",
    tags: [TAGS["ui-component"]],
    url: "https://www.fancycomponents.dev/",
  },
  {
    title: "Flexbox Labs",
    category: CATEGORIES.frontend,
    description: "A visual tool for experimenting with flexbox and CSS grid layouts.",
    favicon: "https://raw.githubusercontent.com/prazzon/Flexbox-Labs/master/public/img/logo.svg",
    ogImage:
      "https://raw.githubusercontent.com/prazzon/Flexbox-Labs/master/.github/images/Screenshot1.png",
    tags: [TAGS.tool],
    url: "https://flexboxlabs.netlify.app/",
  },
  {
    title: "Flicker",
    category: CATEGORIES.frontend,
    description:
      "A loading spinner library inspired by flip-dot displays. Browse the collection, build your own, export to SVG, React, or Flutter.",
    subtitle: "Spinner Library",
    tags: [TAGS.animation],
    url: "https://flicker.laurie.fyi/",
  },
  {
    title: "FlipOff.",
    author: "magnum6actual",
    category: CATEGORIES.frontend,
    description:
      "Free split-flap display emulator for any TV. The classic flip-board look, without the $3,500 hardware.",
    favicon: "/github.svg",
    tags: [TAGS.animation],
    url: "https://github.com/magnum6actual/flipoff",
  },
  {
    title: "flowkit-ui",
    author: "vzkiss",
    category: CATEGORIES.frontend,
    description:
      "Patterns teams rebuild on every project - built once, reusable everywhere. Each one targets a concrete problem. Built on shadcn/ui and Base UI.",
    url: "https://flowkit-ui.vzkiss.com/",
  },
  {
    title: "Fluid Functionalism.",
    category: CATEGORIES.frontend,
    description: "Open Source UI components created by @micka_design",
    tags: [TAGS["ui-component"]],
    url: "https://www.fluidfunctionalism.com/",
  },
  {
    title: "Footer",
    category: CATEGORIES.frontend,
    description:
      "Footer is a curated gallery of the top website footer inspiration on earth. Find the footers you need and sort by type and style.",
    subtitle: "The only footer gallery on earth.",
    tags: [TAGS["ui-component"]],
    url: "https://www.footer.design/",
  },
  {
    title: "ForgeUI",
    category: CATEGORIES.frontend,
    description:
      "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    tags: [TAGS["ui-component"]],
    url: "https://forgeui.in/",
  },
  {
    title: "FormSCN",
    category: CATEGORIES.frontend,
    description:
      "Visual form builder for shadcn/ui and React. Build production-ready forms with React Hook Form or TanStack Form, add Better Auth in one click, and export clean TypeScript code for Next.js, Remix, or Vite.",
    subtitle: "shadcn/ui Form Builder with Better Auth Integration",
    tags: [TAGS["ui-component"]],
    url: "https://www.formscn.space/",
  },
  {
    title: "framecn",
    category: CATEGORIES.frontend,
    description:
      "A collection of beautifully designed, and customizable video components. Built on Editframe. Works with shadcn/ui.",
    subtitle: "Beautiful videos, made simple",
    tags: [TAGS["ui-component"]],
    url: "https://www.framecn.dev/",
  },
  {
    title: "Framer University",
    category: CATEGORIES.frontend,
    description:
      "Discover the best free Framer resources for your next project, including Framer components, code overrides, animations, and effects. Elevate your Framer website with a curated selection of top-quality Framer assets.",
    subtitle: "Best Free Framer Resources",
    url: "https://framer.university/resources",
  },
  {
    title: "Frimousse",
    category: CATEGORIES.frontend,
    description:
      "Open-source, lightweight, unstyled, and composable emoji picker for React—originally created for Liveblocks Comments. Styles can be applied with CSS, Tailwind CSS, CSS-in-JS, and more.",
    tags: [TAGS.react],
    url: "https://frimousse.liveblocks.io/",
  },
  {
    title: "Frontend Practice",
    category: CATEGORIES.frontend,
    description:
      "Take your frontend skills to the next level by recreating real websites from real companies.",
    favicon: "https://www.frontendpractice.com/images/favicon.ico",
    ogImage: "https://www.frontendpractice.com/FP-meta.png",
    subtitle: "Become a better frontend developer.",
    tags: [TAGS.development, TAGS.education, TAGS.ui],
    url: "https://www.frontendpractice.com/",
  },
  {
    title: "Gamification UI Kit by Trophy",
    category: CATEGORIES.frontend,
    description:
      "Trophy's Gamification UI Kit is an open-source library of gamification UI components built on shadcn/ui and Tailwind CSS. Drop-in React components for streaks, achievements, leaderboards, points, and more — ready to copy and customize.",
    tags: [TAGS["ui-component"]],
    url: "https://ui.trophy.so/",
  },
  {
    title: "Gingham Maker",
    category: CATEGORIES.frontend,
    description: "A CSS generator for custom gingham patterns",
    url: "https://gingham.laney.tech/",
  },
  {
    title: "gooey-toast",
    category: CATEGORIES.frontend,
    description:
      "Morphing toast notifications for React. Organic blob animations, promise tracking, and full customization out of the box.",
    favicon: "https://goey-toast.vercel.app/apple-touch-icon.png",
    ogImage: "https://goey-toast.vercel.app/og-image.png",
    subtitle: "Morphing toast notifications for React",
    tags: [TAGS["ui-component"]],
    url: "https://goey-toast.vercel.app/",
  },
  {
    title: "Grainrad",
    category: CATEGORIES.frontend,
    description: "Grainrad - Free WebGPU-powered ASCII, dithering, and retro effects at 60fps",
    tags: [TAGS.animation],
    url: "https://grainrad.com/",
  },
  {
    title: "Gravity UI",
    category: CATEGORIES.frontend,
    description: "Build modern interfaces with the Gravity design system and libraries",
    ogImage: "https://gravity-ui.com/index-social.png",
    tags: [TAGS["ui-component"]],
    url: "https://gravity-ui.com/",
  },
  {
    title: "GSAP",
    category: CATEGORIES.frontend,
    description:
      "Supported by Webflow. Animate Anything - A wildly robust JavaScript animation library built for professionals.",
    tags: [TAGS.animation],
    url: "https://gsap.com/",
  },
  {
    title: "Hero Patterns",
    author: "Steve Schoger",
    category: CATEGORIES.frontend,
    description: "Free repeatable SVG background patterns for your web projects",
    tags: [TAGS.image, TAGS.ui],
    url: "https://heropatterns.com/",
  },
  {
    title: "hookcn",
    author: "strlrd-29",
    category: CATEGORIES.frontend,
    description: "A collection of reusable react hooks that you can copy and paste into your apps.",
    favicon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-anchor size-5' aria-hidden='true'%3E%3Cpath d='M12 22V8'%3E%3C/path%3E%3Cpath d='M5 12H2a10 10 0 0 0 20 0h-3'%3E%3C/path%3E%3Ccircle cx='12' cy='5' r='3'%3E%3C/circle%3E%3C/svg%3E",
    ogImage: "https://hookcn.ouassim.tech/og.png",
    tags: [TAGS.react],
    url: "https://hookcn.ouassim.tech/",
  },
  {
    title: "htmldocs",
    author: "htmldocs team",
    category: CATEGORIES.frontend,
    description:
      "Create and generate professional documents and PDFs using React components. htmldocs offers a simple, powerful API for automated document generation and management.",
    favicon: "https://raw.githubusercontent.com/htmldocs-js/htmldocs/canary/apps/docs/favicon.svg",
    ogImage: "https://htmldocs.com/og-image.png",
    subtitle: "Build and generate documents with React",
    tags: [TAGS.react],
    url: "https://htmldocs.com/",
  },
  {
    title: "HTMLrev",
    category: CATEGORIES.frontend,
    description:
      "Free HTML CSS templates and themes for websites, landing pages, blogs, portfolios, ecommerce and admin dashboards.",
    tags: [TAGS["ui-component"]],
    url: "https://htmlrev.com/",
  },
  {
    title: "HyperUI",
    category: CATEGORIES.frontend,
    description:
      "Free, open-source Tailwind CSS components for modern web development. Copy-paste ready components to build beautiful, responsive websites faster.",
    favicon: "https://www.hyperui.dev/favicon.ico",
    ogImage: "https://hyperui.dev/og.jpg",
    subtitle: "Free Tailwind CSS Components",
    tags: [TAGS["ui-component"]],
    url: "https://hyperui.dev/",
  },
  {
    title: "Impeccable",
    category: CATEGORIES.frontend,
    description:
      "1 skill, 23 commands, and curated anti-patterns for impeccable frontend design. Works with Cursor, Claude Code, GitHub Copilot, Gemini CLI, and Codex CLI.",
    subtitle: "The missing upgrade to Anthropic's impeccable skill",
    url: "https://impeccable.style/",
  },
  {
    title: "Indie UI",
    category: CATEGORIES.frontend,
    description:
      "Make your website stand out with minimal effort. Built with Reactjs, shadcn and Framer Motion for animation.",
    favicon: "https://ui.indie-starter.dev/favicon.ico",
    ogImage: "https://ui.indie-starter.dev/opengraph-image.jpg?2c560e418071e952",
    tags: [TAGS["ui-component"]],
    url: "https://ui.indie-starter.dev/",
  },
  {
    title: "Intent UI",
    category: CATEGORIES.frontend,
    description:
      "Copy and paste accessible React components built on React Aria and Tailwind CSS. 87+ production-ready components for Next.js and Laravel.",
    tags: [TAGS["ui-component"]],
    url: "https://intentui.com/",
  },
  {
    title: "Jitter",
    category: CATEGORIES.frontend,
    description:
      "Jitter is a collaborative motion design tool that lets you create professional animations in minutes, no matter your experience with motion.",
    subtitle: "A fast and simple motion design tool on the web",
    tags: [TAGS.animation],
    url: "https://jitter.video/",
  },
  {
    title: "Joly UI",
    author: "johuniq",
    category: CATEGORIES.frontend,
    description:
      "50+ free, open-source React components built on shadcn/ui & Radix. Copy-paste ready for Next.js, TypeScript & Tailwind CSS.",
    favicon: "https://jolyui.dev/icon.png",
    ogImage: "https://jolyui.dev/opengraph-image.png",
    subtitle: "50+ Free shadcn/ui Components for React & Next.js",
    tags: [TAGS["ui-component"]],
    url: "https://www.jolyui.dev/",
  },
  {
    title: "junwen-k/ui-x",
    author: "junwen-k",
    category: CATEGORIES.frontend,
    className: "bg-foreground border-paper",
    description:
      "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    favicon: "https://ui-x.junwen-k.dev/favicon.svg",
    ogImage: "https://ui-x.junwen-k.dev/og.jpg",
    tags: [TAGS["ui-component"]],
    url: "https://ui-x.junwen-k.dev/",
  },
  {
    title: "JustGage",
    author: "JustGage Team",
    category: CATEGORIES.frontend,
    description:
      "Modern SVG gauge library with zero dependencies. Create beautiful, animated dashboard gauges with ease.",
    favicon: "https://raw.githubusercontent.com/toorshia/justgage/master/docs/public/logo.png",
    subtitle: "Modern SVG Gauges",
    tags: [TAGS["ui-component"]],
    url: "https://toorshia.github.io/justgage/",
  },
  {
    title: "Kibo UI",
    category: CATEGORIES.frontend,
    description:
      "Kibo UI is a custom registry of composable, accessible and open source components designed for use with shadcn/ui.",
    favicon: "https://www.kibo-ui.com/apple-icon.png?apple-icon.78308315.png",
    ogImage: "https://www.kibo-ui.com/opengraph-image.jpg?opengraph-image.408bd8df.jpg",
    tags: [TAGS["ui-component"]],
    url: "https://www.kibo-ui.com/",
  },
  {
    title: "Kokonut UI",
    category: CATEGORIES.frontend,
    description:
      "Collection of 100+ stunning UI components free and open source built with Next.js, React, Tailwind CSS, and Motion.",
    subtitle: "Open Source Components",
    tags: [TAGS["ui-component"]],
    url: "https://kokonutui.com/",
  },
  {
    title: "Lightswind UI",
    category: CATEGORIES.frontend,
    description:
      "Accelerate your workflow with Lightswind UI. A library of 151+ high-performance,  accessible, and beautifully animated React components and UI kits crafted for Modern Developers.",
    subtitle: "Beautifully Animated React Components & Modern UI Kits",
    url: "https://lightswind.com/",
  },
  {
    title: "Loading UI",
    category: CATEGORIES.frontend,
    description:
      "Free and open source CSS and React loaders, spinners, and animations to create polished, accessible loading states for modern web apps.",
    subtitle: "Spinners, loaders, and loading animations for the web",
    url: "https://loading-ui.com/",
  },
  {
    title: "LottieFiles",
    category: CATEGORIES.frontend,
    description:
      "Effortlessly bring the smallest, free, ready-to-use motion graphics for the web, app, social, and designs. Create, edit, test, collaborate, and ship Lottie animations in no time!",
    tags: [TAGS.animation],
    url: "https://lottiefiles.com/",
  },
  {
    title: "Lottielab",
    category: CATEGORIES.frontend,
    description:
      "Create and ship animations to your products faster. Bring your websites and apps to life with the simplest editor for Lottie animations.",
    subtitle: "Create & edit Lottie animations",
    tags: [TAGS.animation],
    url: "https://www.lottielab.com/",
  },
  {
    title: "Lukacho UI",
    category: CATEGORIES.frontend,
    description: "Animated UI component Collection made with Next.js | TailwindCSS | Framer Motion",
    tags: [TAGS["ui-component"]],
    url: "https://ui.lukacho.com/",
  },
  {
    title: "Mage UI",
    category: CATEGORIES.frontend,
    description:
      "Hand-crafted animated components that you can copy and paste into your apps. Free & Open Source.",
    tags: [TAGS["ui-component"]],
    url: "https://www.mageui.in/",
  },
  {
    title: "Magic UI",
    category: CATEGORIES.frontend,
    description: "Beautiful UI components and templates to make your landing page look stunning.",
    tags: [TAGS["ui-component"]],
    url: "https://magicui.design/",
  },
  {
    title: "mapcn",
    category: CATEGORIES.frontend,
    description:
      "A collection of beautifully designed, accessible, and customizable map components. Built on MapLibre GL. Styled with Tailwind CSS. Works with shadcn/ui.",
    tags: [TAGS.map],
    url: "https://www.mapcn.dev/",
  },
  {
    title: "Matter.js",
    author: "liabru",
    category: CATEGORIES.frontend,
    description: "Matter.js is 2D rigid body JavaScript physics engine for the web",
    url: "https://brm.io/matter-js/",
  },
  {
    title: "Mesh-Gradient Generator",
    author: "naymur rahman",
    category: CATEGORIES.frontend,
    description:
      "Create beautiful mesh gradients and fluid color transitions for your web designs. Perfect for modern UI and backgrounds.",
    ogImage: "https://tools.ui-layouts.com/meshgradients.jpg",
    url: "https://tools.ui-layouts.com/mesh-gradients",
  },
  {
    title: "MiroMiro",
    category: CATEGORIES.frontend,
    description:
      "The design-to-code tool that turns any website into clean HTML, Tailwind, and design tokens in one click. Paste real code straight into Cursor, Claude,...",
    subtitle: "Website to Code: Copy Real HTML & Tailwind",
    url: "https://miromiro.app/",
  },
  {
    title: "Monoco",
    author: "Monokai",
    category: CATEGORIES.frontend,
    description:
      "Monoco is a tiny JavaScript library that adds squircles (smooth corners) and other corner types to html elements.",
    favicon: "https://somonoco.com/favicon.png",
    ogImage: "https://somonoco.com/featured-image.jpg",
    subtitle: "smooth squircle corners for HTML elements",
    tags: [TAGS["ui-component"]],
    url: "https://somonoco.com/",
  },
  {
    title: "Morphin",
    author: "Morphin",
    category: CATEGORIES.frontend,
    className: "bg-foreground border-paper",
    description:
      "Build premium React interfaces with production-ready animated components, micro-interactions and motion UI patterns. Ship polished UI 10x faster.",
    favicon: "https://morphin.dev/logo.svg",
    ogImage: "https://morphin.dev/twitter-image?eaa549bb27ece1c0",
    subtitle: "Premium Animated React Components & Motion UI Library",
    tags: [TAGS["ui-component"]],
    url: "https://morphin.dev/",
  },
  {
    title: "Motion",
    category: CATEGORIES.frontend,
    description:
      "Motion (prev Framer Motion) is a fast, production-grade animation library for React, JavaScript and Vue. Build smooth UI animations at a tiny footprint.",
    subtitle: "JavaScript & React animation library",
    tags: [TAGS.animation],
    url: "https://motion.dev/",
  },
  {
    title: "Motion-Primitives",
    category: CATEGORIES.frontend,
    description:
      "Motion-Primitives is an open-source UI kit to make beautiful, animated interfaces, faster. Built for React, Next.js, and Tailwind CSS.",
    subtitle: "UI kit to make beautiful, animated interfaces, faster.",
    tags: [TAGS.animation, TAGS["ui-component"]],
    url: "https://motion-primitives.com/",
  },
  {
    title: "MynaUI",
    author: "Praveen Juge",
    category: CATEGORIES.frontend,
    description:
      "MynaUI is a comprehensive design system and UI kit that lets you customize and extend designs.",
    favicon: "https://mynaui.com/icon.svg",
    ogImage: "https://mosaic.praveenjuge.com/use?url=https://mynaui.com/",
    subtitle: "Made with TailwindCSS, shadcn/ui, Radix UI and Figma.",
    tags: [TAGS["ui-component"]],
    url: "https://mynaui.com/",
  },
  {
    title: "Neobrutalism components",
    category: CATEGORIES.frontend,
    description: "A collection of neobrutalism-styled components based on shadcn/ui.",
    subtitle: "Start making neobrutalism layouts today",
    tags: [TAGS["ui-component"]],
    url: "https://www.neobrutalism.dev/",
  },
  {
    title: "Nova UI",
    category: CATEGORIES.frontend,
    description:
      "Nova UI is a complete solution for Framer & Figma, offering all the resources needed from concept to launch. Packed with a UI kit, templates, design systems, components, and custom code, it's the ultimate toolkit for creating and monetizing your websites.",
    subtitle: "Framer UI Kit & Design System",
    tags: [TAGS["ui-component"]],
    url: "https://novaui.design/",
  },
  {
    title: "Odyc.js",
    category: CATEGORIES.frontend,
    description:
      "Odyc.js is a simple JavaScript library to create interactive narrative games, even without coding experience.",
    ogImage: "https://odyc.dev/og.png",
    url: "https://odyc.dev/",
  },
  {
    title: "Open Props: sub-atomic styles",
    category: CATEGORIES.frontend,
    description:
      "Open source CSS custom properties to help accelerate adaptive and consistent design. Available from a CDN or NPM, as CSS or Javascript.",
    tags: [TAGS["ui-component"]],
    url: "https://open-props.style/",
  },
  {
    title: "OpenTUI",
    category: CATEGORIES.frontend,
    description:
      "OpenTUI is a TypeScript library on a native Zig core for building terminal user interfaces (TUIs)",
    subtitle: "Terminal UIs",
    url: "https://opentui.com/",
  },
  {
    title: "Originkit",
    category: CATEGORIES.frontend,
    description:
      "The largest free animated component library for building modern websites. Copy code, use in Framer, or connect through MCP.",
    subtitle: "Free Animated component library for modern websites",
    url: "https://www.originkit.dev/",
  },
  {
    title: "Park UI",
    category: CATEGORIES.frontend,
    description:
      "Beautifully designed components built with Ark UI and Panda CSS that work with a variety of JS frameworks.",
    tags: [TAGS["ui-component"]],
    url: "https://park-ui.com/",
  },
  {
    title: "PDFSlick",
    author: "Vancho Stojkov",
    category: CATEGORIES.frontend,
    description: "View and Interact with PDFs in React, SolidJS, Svelte and JavaScript apps.",
    tags: [TAGS.development, TAGS.react],
    url: "https://pdfslick.dev/",
  },
  {
    title: "PDFx",
    category: CATEGORIES.frontend,
    description:
      "Copy-paste React PDF components like shadcn/ui. Run `npx pdfx-cli add table` and own the code. 24 components, theme system, CLI, invoice & report blocks. MIT licensed.",
    subtitle: "shadcn/ui for React PDFs | Copy-Paste PDF Components",
    tags: [TAGS.development, TAGS.pdf],
    url: "https://pdfx.akashpise.dev/",
  },
  {
    title: "pen.dev",
    category: CATEGORIES.frontend,
    description:
      "pen.dev fundamentally increases your engineering speed by bringing designing directly into your preferred IDE.",
    favicon: "https://www.pen.dev/favicon.svg",
    ogImage: "https://pen.dev/og-image-v4.png",
    subtitle: "Design on canvas. Land in code.",
    url: "https://www.pen.dev/",
  },
  {
    title: "phantom-ui",
    category: CATEGORIES.frontend,
    description: "Structure-aware skeleton loader. One Web Component. Every framework.",
    favicon: "https://aejkatappaja.github.io/phantom-ui/favicon.svg",
    tags: [TAGS["ui-component"]],
    url: "https://aejkatappaja.github.io/phantom-ui/",
  },
  {
    title: "Phosphor Icons",
    category: CATEGORIES.frontend,
    description:
      "A flexible icon family for interfaces, diagrams, presentations — whatever, really.",
    url: "https://phosphoricons.com/",
  },
  {
    title: "Plate rich-text editor",
    category: CATEGORIES.frontend,
    description:
      "A set of beautifully-designed, customizable plugins and components to help you build your rich-text editor. Open Source.",
    tags: [TAGS["ui-component"]],
    url: "https://platejs.org/",
  },
  {
    title: "Pretext",
    category: CATEGORIES.frontend,
    description:
      "Pretext is a pure TypeScript text layout library by ex-React core member Cheng Lou. It bypasses browser layout reflow and measures text 300-600x faster than DOM methods.",
    subtitle: "JavaScript Text Measurement Without DOM Reflow",
    url: "https://pretextjs.net/",
  },
  {
    title: "Prime UI",
    category: CATEGORIES.frontend,
    description:
      "Prime UI is the missing foundation for AI-generated websites. Go from sitemaps and wireframes to production-ready Next.js and Tailwind CSS code in minutes.",
    subtitle: "Build sites fast. Fear no code.",
    url: "https://primeui.com/",
  },
  {
    title: "React Aria",
    category: CATEGORIES.frontend,
    description: "Craft world-class accessible components with custom styles.",
    favicon: "https://react-aria.adobe.com/server/react-aria-favicon.0d52b4c6.svg",
    ogImage: "https://react-aria.adobe.com/server/ReactAriaOpenGraph.c58014f0.webp",
    tags: [TAGS["ui-component"]],
    url: "https://react-aria.adobe.com/",
  },
  {
    title: "React Bits",
    category: CATEGORIES.frontend,
    description:
      "An open source collection of high quality, animated, interactive & fully customizable React components for building stunning, memorable user interfaces.",
    tags: [TAGS["ui-component"]],
    url: "https://www.reactbits.dev/",
  },
  {
    title: "React Doctor",
    category: CATEGORIES.frontend,
    description:
      "Let coding agents diagnose and fix React codebases with deterministic static analysis.",
    url: "https://www.react.doctor/",
  },
  {
    title: "React Haiku",
    category: CATEGORIES.frontend,
    description: "A minimal React Hooks library that saves you time and lines of code.",
    tags: [TAGS.react],
    url: "https://www.reacthaiku.dev/",
  },
  {
    title: "React Three Fiber",
    category: CATEGORIES.frontend,
    description: "React-three-fiber is a React renderer for three.js.",
    tags: [TAGS.react],
    url: "https://r3f.docs.pmnd.rs/getting-started/introduction",
  },
  {
    title: "React Zero-UI",
    category: CATEGORIES.frontend,
    description:
      "React Zero-UI is a CSS-powered React state manager for UI state with zero React re-renders, no providers, and generated Tailwind variants.",
    favicon:
      "https://raw.githubusercontent.com/react-zero-ui/core/main/examples/demo/public/assets/zero-ui-favicon-transparent.png",
    ogImage: "https://zero-ui.dev/assets/zero-ui-logo.png",
    subtitle: "React UI State Management Without Re-renders",
    tags: [TAGS.react],
    url: "https://zero-ui.dev/",
  },
  {
    title: "Refero Styles",
    category: CATEGORIES.frontend,
    description:
      "Search a curated DESIGN.md library for AI agents: colors, typography, spacing, and component patterns from top websites. Part of Refero.",
    tags: [TAGS["ui-component"]],
    url: "https://styles.refero.design/",
  },
  {
    title: "ReUI",
    author: "ReUI",
    category: CATEGORIES.frontend,
    description:
      "Free Shadcn UI components and pro blocks for React and Tailwind CSS. Hand-crafted icons, templates, and a hosted MCP server so coding agents build with the shadcn CLI.",
    favicon: "https://reui.io/favicon.ico",
    ogImage:
      "https://reui.io/og?title=Free%20Shadcn%20UI%20Components%2C%20Blocks%2C%20Icons%2C%20Templates%20%26%20MCP&description=Free%20Shadcn%20UI%20components%20and%20pro%20blocks%20for%20React%20and%20Tailwind%20CSS.%20Hand-crafted%20icons%2C%20templates%2C%20and%20a%20hosted%20MCP%20server%20so%20coding%20agents%20build%20with%20the%20shadcn%20CLI.&v=dpl_7SoDQLxB1vnarVpa5BSr3NUxi4T8",
    subtitle: "Free Shadcn UI Components, Blocks, Icons, Templates & MCP",
    tags: [TAGS["ui-component"]],
    url: "https://reui.io/",
  },
  {
    title: "Rive",
    category: CATEGORIES.frontend,
    description:
      "Behind Spotify Wrapped, Duolingo, and products reaching 2 billion users. Design, animate, and code in one place. Ship everywhere.",
    subtitle: "The interactive experience engine",
    tags: [TAGS.animation],
    url: "https://rive.app/",
  },
  {
    title: "SATIS UI",
    category: CATEGORIES.frontend,
    description:
      "An evolving collection of production-ready components built for the shadcn/ui ecosystem. Supercharge your projects with fluid animations and modern best practices.",
    subtitle: "Beautifully Engineered Components for shadcn/ui",
    url: "https://satisui.xyz/",
  },
  {
    title: "Screen Sizes",
    category: CATEGORIES.frontend,
    description: "A complete guide for Apple Displays, Icon Sizes, and more!",
    favicon: "https://screensizes.app/favicon.svg",
    ogImage: "https://www.screensizes.app/ogimage.png",
    url: "https://screensizes.app/",
  },
  {
    title: "Scrollbar",
    category: CATEGORIES.frontend,
    description: "Simple CSS scrollbar editor.",
    favicon: "https://scrollbar.app/apple-touch-icon.png",
    ogImage: "https://www.scrollbar.app/scrollbar_cover.png",
    tags: [TAGS["ui-component"]],
    url: "https://scrollbar.app/",
  },
  {
    title: "Shadcn Blocks",
    author: "Ephraim Duncan",
    category: CATEGORIES.frontend,
    description:
      "Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.",
    ogImage: "https://blocks.so/opengraph-image.png",
    subtitle: "60+ Free shadcn/ui Components for React | blocks.so - shadcn/ui blocks",
    tags: [TAGS["ui-component"]],
    url: "https://blocks.so/",
  },
  {
    title: "Shadcnblocks",
    category: CATEGORIES.frontend,
    description:
      "Discover hundreds of extra shadcn/ui blocks and Shadcn UI components. Shadcnblocks is a premium component library built with Shadcn UI, React & Tailwind.",
    favicon: "https://www.shadcnblocks.com/favicon/apple-touch-icon.png",
    ogImage: "https://cdn.shadcnblocks.com/shadcnblocks/images/og/og-default.png",
    subtitle: "shadcn/ui blocks & components",
    tags: [TAGS["ui-component"]],
    url: "https://www.shadcnblocks.com/",
  },
  {
    title: "Shadcnexamples",
    category: CATEGORIES.frontend,
    description:
      "Shadcn UI examples, components, and blocks. Built with Tailwind CSS, Shadcn/ui, Next.js, React, Vue.js. Typescript compatible.",
    favicon: "https://shadcnexamples.com/logo.png",
    ogImage: "https://shadcnexamples.com/preview.png",
    subtitle: "Shadcn UI Components and Blocks",
    tags: [TAGS["ui-component"]],
    url: "https://shadcnexamples.com/",
  },
  {
    title: "shadcnmaps",
    category: CATEGORIES.frontend,
    description:
      "170+ interactive SVG map components for React. Countries, continents, and US states. No dependencies — install via shadcn CLI with pure Tailwind CSS styling.",
    tags: [TAGS.map],
    url: "https://www.shadcnmaps.com/",
  },
  {
    title: "ShadcnStore",
    author: "ShadcnStore",
    category: CATEGORIES.frontend,
    description:
      "Build faster with production-ready Shadcn UI blocks and components. Copy-paste React components built with Tailwind CSS. Perfect for Next.js, Vite, and modern web applications. Start building beautiful interfaces today.",
    favicon: "https://shadcnstore.com/docs/logo.svg",
    ogImage: "https://assets.shadcnstore.com/shadcnstore.com/brand/og-image.2400w.19d03d.png",
    subtitle: "Premium Shadcn UI Blocks & Components for Modern Web Apps",
    tags: [TAGS["ui-component"]],
    url: "https://shadcnstore.com",
  },
  {
    title: "ShadCN Themer",
    author: "Mike Tromba",
    category: CATEGORIES.frontend,
    description:
      "Discover and create beautiful themes for shadcn/ui. Browse thousands of community-made themes, customize colors with OKLCH picker, select Google Fonts, adjust border radius, and export themes instantly for your Next.js projects.",
    favicon: "https://shadcnthemer.com/favicon.ico",
    ogImage: "https://shadcnthemer.com/og-image.png",
    subtitle: "ShadCN Themes - Create Beautiful Themes for shadcn/ui",
    tags: [TAGS["ui-component"]],
    url: "https://shadcnthemer.com/",
  },
  {
    title: "Shadcn UI Blocks",
    category: CATEGORIES.frontend,
    description:
      "Explore a curated collection of customized Shadcn UI blocks and components. Preview, customize, and copy ready-to-use code snippets to streamline your web development workflow. Perfect for creating responsive, high-quality Shadcn UI designs with ease.",
    favicon: "https://www.shadcnui-blocks.com/images/android-chrome-192x192.png",
    ogImage: "https://www.shadcnui-blocks.com/images/og-image.png",
    subtitle: "Customized Shadcn UI Blocks & Components | Preview & Copy",
    tags: [TAGS["ui-component"]],
    url: "https://www.shadcnui-blocks.com/",
  },
  {
    title: "Shaders",
    category: CATEGORIES.frontend,
    description:
      "Component library for creative WebGPU effects in modern frontend frameworks. Compose interactive visuals for Vue, React, Svelte, Solid & JS.",
    tags: [TAGS.animation],
    url: "https://shaders.com/",
  },
  {
    title: "Shadows Generator",
    author: "naymur rahman",
    category: CATEGORIES.frontend,
    description:
      "Generate beautiful CSS and Tailwind CSS v3/v4 box-shadows and text-shadows. Perfect for modern UI, glassmorphism, and soft design systems.",
    ogImage: "https://tools.ui-layouts.com/shadows.jpg",
    url: "https://tools.ui-layouts.com/shadows",
  },
  {
    title: "Shoogle",
    category: CATEGORIES.frontend,
    description: "Search shadcn components.",
    tags: [TAGS["ui-component"]],
    url: "https://shoogle.dev/",
  },
  {
    title: "Skiper UI",
    author: "Gxuri",
    category: CATEGORIES.frontend,
    description:
      "Brand new uncommon components for your Next.js project. Use with ease through shadcn CLI 3.0, featuring fast-growing components and collections that are easy to edit and use.",
    favicon: "https://skiper-ui.com/logos/logo.svg",
    ogImage: "https://skiper-ui.com/og-main.png",
    subtitle: "Un-common Components for shadcn/ui",
    tags: [TAGS["ui-component"]],
    url: "https://skiper-ui.com/",
  },
  {
    title: "Smallbits",
    category: CATEGORIES.frontend,
    description:
      "290+ pixelated icons on a limited 8×8 grid where every point counts. Free for personal and commercial use.",
    subtitle: "290+ pixelated icons on an 8×8 grid",
    url: "https://smallbits.design/",
  },
  {
    title: "SmolCSS",
    author: "Stephanie Eckles",
    category: CATEGORIES.frontend,
    description:
      "Minimal snippets for modern CSS layouts and components, created by Stephanie Eckles of ModernCSS.dev",
    tags: [TAGS["ui-component"]],
    url: "https://smolcss.dev/",
  },
  {
    title: "Smooothy",
    category: CATEGORIES.frontend,
    description: "Smooth configurable extendable slider made for animation.",
    tags: [TAGS.animation],
    url: "https://smooothy.vercel.app/",
  },
  {
    title: "SmoothUI",
    category: CATEGORIES.frontend,
    description:
      "Animated React components with smooth Motion animations. Drop-in shadcn/ui compatible, fully customizable with Tailwind CSS.",
    favicon: "https://smoothui.dev/logomark-smoothui.svg",
    ogImage: "https://smoothui.dev/og-optimized.webp",
    subtitle: "Animated React Components for shadcn/ui | Motion & Tailwind",
    tags: [TAGS["ui-component"]],
    url: "https://smoothui.dev/",
  },
  {
    title: "soundcn",
    author: "soundcn",
    category: CATEGORIES.frontend,
    description:
      "700+ curated UI sound effects for modern web apps. Browse, preview, and install sounds with a single command. Free and open source.",
    favicon: "https://www.soundcn.xyz/icon.svg?icon.025y~su-z2aj3.svg",
    ogImage: "https://www.soundcn.xyz/og-dark.png",
    subtitle: "Free Sound Effects for Modern Web Apps",
    tags: [TAGS["ui-component"]],
    url: "https://www.soundcn.xyz/",
  },
  {
    title: "Soundz",
    author: "Kaycee Ingram",
    category: CATEGORIES.frontend,
    description: "A Lightweight, Customizable Sound Effects Wrapper for React.",
    favicon: "https://soundzjs.vercel.app/s-icon.svg",
    ogImage: "https://soundzjs.vercel.app/soundz.svg",
    tags: [TAGS["ui-component"]],
    url: "https://soundzjs.vercel.app/",
  },
  {
    title: "Spectrum UI",
    category: CATEGORIES.frontend,
    description:
      "Copy-paste beautiful UI components built with React, Next.js, Tailwind CSS, and shadcn/ui. 250+ production-ready components, blocks, and templates. Free and open source.",
    tags: [TAGS["ui-component"]],
    url: "https://ui.spectrumhq.in/",
  },
  {
    title: "Spline",
    category: CATEGORIES.frontend,
    description:
      "Spline is a free 3D design software with real-time collaboration to create web interactive experiences in the browser. Easy 3d modeling, animation, textures, and more.",
    subtitle: "3D Design tool in the browser with real-time collaboration",
    tags: [TAGS.animation],
    url: "https://spline.design/",
  },
  {
    title: "spoilerjs",
    category: CATEGORIES.frontend,
    className: "bg-foreground border-paper",
    description:
      "A framework-agnostic web component for creating beautiful spoiler effects with Telegram-inspired particle animations. Easily integrates into React, Vue, Svelte, or vanilla JS.",
    favicon: "https://spoilerjs.sh4jid.me/apple-touch-icon.png",
    ogImage: "https://spoilerjs.sh4jid.me/og_image.png",
    subtitle: "Beautiful Spoiler Effects",
    tags: [TAGS["ui-component"]],
    url: "https://spoilerjs.sh4jid.me/",
  },
  {
    title: "SSGOI",
    author: "MeurSyphus",
    category: CATEGORIES.frontend,
    description:
      "Router-agnostic page transitions for React, Svelte, Vue, Solid, Angular, and Qwik. Built on the Web Animations API with spring physics and state preservation.",
    favicon: "https://ssgoi.dev/ssgoi-logo.png",
    ogImage: "https://ssgoi.dev/og.png",
    subtitle: "Native page transitions on the web",
    tags: [TAGS.animation],
    url: "https://ssgoi.dev/",
  },
  {
    title: "StyleSeed",
    category: CATEGORIES.frontend,
    description:
      "Design engine for vibe coding — it teaches Claude Code, Codex, and Cursor design judgment (74 rules), not just components. A drop-in React design system with 7 brand skins and a named motion system. MIT licensed.",
    subtitle: "Design engine for vibe coding",
    tags: [TAGS.ai, TAGS.development, TAGS.ui],
    url: "https://styleseed-demo.vercel.app/",
  },
  {
    title: "Supabase UI Library",
    author: "Supabase",
    category: CATEGORIES.frontend,
    description: "Provides a library of components for your project",
    favicon: "https://supabase.com/favicon/favicon.svg",
    ogImage: "https://supabase.com/ui/img/supabase-og-image.png",
    tags: [TAGS["ui-component"]],
    url: "https://supabase.com/ui",
  },
  {
    title: "SVGator",
    category: CATEGORIES.frontend,
    description:
      "Create impressive SVG animations and more. Add them easily to your website or app. Get started for free!",
    subtitle: "Free Animation Maker Online",
    tags: [TAGS.animation],
    url: "https://www.svgator.com/",
  },
  {
    title: "SVG Studio",
    category: CATEGORIES.frontend,
    description:
      "SVG Studio — a free, browser-based SVG animation editor. No sign-up, no telemetry, no subscription.",
    subtitle: "Animate Everything",
    tags: [TAGS.animation],
    url: "https://www.svgstudio.org/",
  },
  {
    title: "Swishy",
    category: CATEGORIES.frontend,
    description:
      "Swishy is the leading AI motion designer and AI animator platform. Create professional motion graphics, animated typefaces, and stunning video animations without After Effects. Export to MP4, MOV, and GIF instantly.",
    tags: [TAGS.animation],
    url: "https://www.swishy.ai/",
  },
  {
    title: "SyntaxUI",
    category: CATEGORIES.frontend,
    description:
      "Get free-to-use Prebuilt React components powered by Tailwind CSS & Framer Motion. Modern, Minimal and customizable. Just copy, paste and you're ready to go!",
    subtitle: "Free React, Tailwind CSS & Framer UI Components",
    tags: [TAGS["ui-component"]],
    url: "https://syntaxui.com/",
  },
  {
    title: "TableCraft",
    category: CATEGORIES.frontend,
    description:
      "A production-ready, type-safe, fully customizable table component for modern React applications.",
    favicon: "https://react-table-craft.vercel.app/brand/logo-light.svg",
    ogImage: "https://react-table-craft.vercel.app/brand/thumnail.png",
    subtitle: "The Ultimate React Table Engine",
    tags: [TAGS["ui-component"]],
    url: "https://react-table-craft.vercel.app/",
  },
  {
    title: "Tailark",
    category: CATEGORIES.frontend,
    description:
      "Speed up your workflow with responsive, pre-built UI blocks designed for marketing websites.",
    favicon: "https://tailark.com/icon.svg",
    ogImage: "https://tailark.com/opengraph-image.png",
    subtitle: "Shadcn Marketing Blocks",
    tags: [TAGS["ui-component"]],
    url: "https://tailark.com/",
  },
  {
    title: "Tailwind CSS Animations Plugin",
    author: "Miguel Ángel Durán (midudev)",
    category: CATEGORIES.frontend,
    description:
      "Add 79+ ready-to-use CSS animations to Tailwind CSS with utility classes. Fade, slide, zoom, scroll-driven motion, and dialog effects. Zero config, open source by midudev.",
    favicon: "https://tailwind-animations.com/favicon.svg",
    ogImage: "https://tailwind-animations.com/og.jpg",
    subtitle: "79+ Utility Classes",
    tags: [TAGS.animation],
    url: "https://tailwindcss-animations.vercel.app",
  },
  {
    title: "termcn",
    category: CATEGORIES.frontend,
    description:
      "A collection of beautifully designed, accessible, and customizable terminal UI components. Built on Ink and OpenTUI. Works with shadcn/ui.",
    subtitle: "Beautiful terminal UIs, made simple",
    tags: [TAGS.development, TAGS.ui],
    url: "https://www.termcn.dev/",
  },
  {
    title: "ThemeCN",
    category: CATEGORIES.frontend,
    description:
      "Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.",
    tags: [TAGS["ui-component"]],
    url: "https://tweakcn.com/",
  },
  {
    title: "Tinte",
    author: "Railly Hugo",
    category: CATEGORIES.frontend,
    description:
      "Agent-native design system infrastructure for shadcn/ui. 13 semantic OKLCH tokens compile to presets, VS Code themes, terminal configs, and 19+ formats. Install with one command via shadcn CLI v4. 500+ presets, AI generation, agent skill included.",
    favicon: "https://www.tinte.dev/icons/favicon-192x192.png",
    subtitle: "Agent-Native Design System Infrastructure",
    tags: [TAGS["ui-component"]],
    url: "https://www.tinte.dev/",
  },
  {
    title: "tldraw SDK",
    category: CATEGORIES.frontend,
    description:
      "The tldraw SDK provides tools, services, and APIs to build beautiful whiteboards and infinite canvas applications with real-time collaboration and a powerful React-based canvas.",
    subtitle: "Infinite Canvas SDK for React",
    url: "https://tldraw.dev/",
  },
  {
    title: "toc-cn",
    category: CATEGORIES.frontend,
    description: "A shadcn component registry for documentation-style table of contents.",
    tags: [TAGS["ui-component"]],
    url: "https://tocn.vercel.app/",
  },
  {
    title: "Torph",
    category: CATEGORIES.frontend,
    description: "Dependency-free animated text component.",
    subtitle: "Dependency-Free Text Morphing",
    tags: [TAGS.animation, TAGS.typography],
    url: "https://torph.lochie.me/",
  },
  {
    title: "Transitions.dev",
    category: CATEGORIES.frontend,
    description:
      "Collection of the most essential transitions for web apps that you can just copy and paste into any project.",
    subtitle: "Essential transitions for web apps",
    tags: [TAGS.animation],
    url: "https://transitions.dev/",
  },
  {
    title: "Trees, from Pierre",
    category: CATEGORIES.frontend,
    description:
      "@pierre/trees is an open source file tree rendering library. It's built for performance and flexibility, is super customizable, and comes packed with features.",
    tags: [TAGS["ui-component"]],
    url: "https://trees.software/",
  },
  {
    title: "UI Ball",
    category: CATEGORIES.frontend,
    description: "Useful things for web developers.",
    subtitle: "Useful things for devs",
    url: "https://uiball.com/",
  },
  {
    title: "Uilora",
    category: CATEGORIES.frontend,
    description:
      "Build stunning interfaces with 700+ premium animated components for Next.js & React Native. Copy-paste ready, production-grade UI library.",
    subtitle: "Premium UI Components for Next.js & React Native",
    tags: [TAGS["ui-component"]],
    url: "https://www.uilora.com/",
  },
  {
    title: "UI SFX",
    author: "Yuki Capital",
    category: CATEGORIES.frontend,
    description:
      "Preview 936 open-source UI sound effects for web, mobile, SaaS, and games. Compare 12 sonic styles, one-shots, and seamless loops.",
    favicon: "https://uisfx.com/favicon.svg",
    ogImage: "https://uisfx.com/og-ui-sound-effects-v4.jpg",
    subtitle: "UI Sound Design: 936 Interface Sound Effects",
    tags: [TAGS.audio],
    url: "https://uisfx.com/",
  },
  {
    title: "Uiverse",
    category: CATEGORIES.frontend,
    description:
      "Community-made library of free and customizable UI elements made with CSS or Tailwind. It's all free to copy and use in your projects. Uiverse can save you many hours spent on building & customizing UI components for your next project.",
    tags: [TAGS["ui-component"]],
    url: "https://uiverse.io/",
  },
  {
    title: "Ultracite",
    category: CATEGORIES.frontend,
    description:
      "Ultracite is a zero-config preset for ESLint, Biome, and Oxlint that helps teams and AI write consistent, type-safe code.",
    subtitle: "Zero-Config Linting for Biome, ESLint, and Oxlint",
    url: "https://www.ultracite.ai/",
  },
  {
    title: "unlumen UI",
    category: CATEGORIES.frontend,
    description:
      "A curated registry of beautifully designed React components built with TypeScript, Tailwind CSS and Motion. Install with the shadcn CLI, customize freely, and ship production-ready interfaces faster.",
    subtitle: "Beautifully Designed React Components",
    tags: [TAGS.animation, TAGS["ui-component"]],
    url: "https://ui.unlumen.com/",
  },
  {
    title: "Utility Hub",
    category: CATEGORIES.frontend,
    description: "30 useful web apps, one place. Everything you need, one link.",
    subtitle: "30 tools in one place",
    url: "https://utility-hub-navy-six.vercel.app/",
  },
  {
    title: "UV Canvas",
    category: CATEGORIES.frontend,
    description: "An open source React.js component library for beautifully shaded canvas.",
    favicon: "https://uvcanvas.com/favicon-32x32.png",
    tags: [TAGS.react],
    url: "https://uvcanvas.com/",
  },
  {
    title: "VCI Components",
    category: CATEGORIES.frontend,
    description:
      "200+ copy-paste UI component prompts for AI-powered vibe coding. Elevate your Lovable, Cursor, and Bolt projects with premium components. Ship faster, stand out.",
    subtitle: "Premium UI Prompts for Vibe Coding | React Components",
    tags: [TAGS["ui-component"]],
    url: "https://vibecodecomponents.com/",
  },
  {
    title: "Vengeance UI",
    category: CATEGORIES.frontend,
    description:
      "Animated React components and next-generation UI interactions for modern landing pages.",
    subtitle: "Animated React Components",
    tags: [TAGS["ui-component"]],
    url: "https://www.vengenceui.com/",
  },
  {
    title: "VibeUI",
    category: CATEGORIES.frontend,
    description:
      "92 ready-to-copy layout prompts for vibe coding and AI UI generation. Auth, pricing, hero, bento, dashboards & more — paste into any AI tool.",
    subtitle: "92 Free UI Prompts for Vibe Coders (Auth, Pricing, Hero, Bento)",
    tags: [TAGS["ui-component"]],
    url: "https://vibeui.online/",
  },
  {
    title: "VisGL Google Maps",
    category: CATEGORIES.frontend,
    description: "React components and hooks for the Google Maps JavaScript API",
    favicon: "https://visgl.github.io/react-google-maps/images/visgl-logo-dark.png",
    tags: [TAGS.map],
    url: "https://visgl.github.io/react-google-maps/",
  },
  {
    title: "Watermelon UI",
    category: CATEGORIES.frontend,
    description:
      "A collection of high-quality React components, dashboards, and UI blocks. Copy and paste production-ready UI with ease.",
    subtitle: "Premium React Components, Dashboards & Blocks",
    tags: [TAGS.animation, TAGS["ui-component"]],
    url: "https://ui.watermelon.sh/",
  },
  {
    title: "Web Interface Guidelines",
    category: CATEGORIES.frontend,
    description: "A non-exhaustive list of details that make a good web interface.",
    favicon: "https://interfaces.rauno.me/favicon.svg",
    ogImage: "https://interfaces.rauno.me/og.png",
    tags: [TAGS.education],
    url: "https://interfaces.rauno.me",
  },
  {
    title: "WigggleUI",
    category: CATEGORIES.frontend,
    description: "A beautiful collection of 80+ copy-and-paste widgets for your next project.",
    favicon: "https://wigggle-ui.vercel.app/icon.svg",
    ogImage: "https://wigggle-ui.vercel.app/opengraph-image.png",
    subtitle: "Open Source Widgets for the Web.",
    tags: [TAGS["ui-component"]],
    url: "https://wigggle-ui.vercel.app/",
  },
];
