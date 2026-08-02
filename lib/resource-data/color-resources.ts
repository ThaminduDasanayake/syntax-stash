import { Tool } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const colorLinks: Tool[] = [
  {
    title: "Colir",
    category: CATEGORIES.colors,
    description:
      "Create unique, professional gradients with curve-based control. Real-time WebGL rendering, 12 blend modes, and advanced visual effects.",
    subtitle: "Gradients",
    tags: [TAGS.color],
    url: "https://colir.space/",
  },
  {
    title: "Colorffy",
    category: CATEGORIES.colors,
    description:
      "Create beautiful color schemes, dynamic gradients, and custom themes with Colorffy—the ultimate CSS color palette generator and designer toolkit suite.",
    favicon: "https://colorffy.com/icon-pwa.svg",
    ogImage: "https://colorffy.com/seo/seo-home.png",
    subtitle: "Create Beautiful CSS Color Palettes & UI Themes",
    tags: [TAGS.color],
    url: "https://colorffy.com/",
  },
  {
    title: "ColorFlow",
    category: CATEGORIES.colors,
    description:
      "Create stunning mesh gradients with ColorFlow. Professional gradient editor with real-time preview, customizable control points, and export options. Perfect for designers and developers.",
    subtitle: "Advanced Mesh Gradient Generator & Editor",
    tags: [TAGS.color],
    url: "https://colorflow.ls.graphics/",
  },
  {
    title: "Color Generator",
    category: CATEGORIES.colors,
    description: "Generate beautiful color palettes for your design system.",
    favicon: "https://kigen.design/kigen-logo-icon.svg",
    ogImage: "https://kigen.design/color-og.jpg",
    tags: [TAGS.color],
    url: "https://kigen.design/color",
  },
  {
    title: "ColorHub",
    author: "Dan Cranney",
    category: CATEGORIES.colors,
    description: "Find the perfect color palette for your next project",
    favicon: "https://www.colorhub.app/favicon.png",
    ogImage:
      "https://raw.githubusercontent.com/danielcranney/repo-storage/main/colorhub-v2-meta-image.jpg",
    tags: [TAGS.color],
    url: "https://www.colorhub.app/",
  },
  {
    title: "Color Hunt",
    category: CATEGORIES.colors,
    description:
      "Find the perfect trendy color palettes and get color inspiration for your next design or art project.",
    ogImage: "https://colorhunt.co/img/color-hunt-og.png",
    subtitle: "The Most Popular Color Palettes of 2026",
    tags: [TAGS.color],
    url: "https://colorhunt.co/",
  },
  {
    title: "Colorize",
    category: CATEGORIES.colors,
    description:
      "Generate color palettes instantly from any website effortlessly. Enter a URL to explore color schemes and combinations directly from the site's design. No sign-up required. Try it now!",
    tags: [TAGS.color],
    url: "https://colorize.design/",
  },
  {
    title: "Color Lab",
    author: "naymur rahman",
    category: CATEGORIES.colors,
    description:
      "Color Lab is your all-in-one color and UI toolkit. Create stunning palettes, convert between HEX, RGB, HSL, and design custom themes with the built-in Shadcn UI Theme Generator – ideal for designers and frontend developers.",
    ogImage: "https://tools.ui-layouts.com/color-lab-og.jpg",
    subtitle: "Generate Color Palettes, Convert Codes & Build Shadcn Themes",
    tags: [TAGS.color],
    url: "https://tools.ui-layouts.com/color-lab",
  },
  {
    title: "Colormind",
    category: CATEGORIES.colors,
    description:
      "Generate color combinations in one click. Colormind creates cohesive color schemes using a deep neural net.",
    subtitle: "The AI powered color palette generator",
    tags: [TAGS.color],
    url: "https://colormind.io/",
  },
  {
    title: "Color Moods",
    category: CATEGORIES.colors,
    description: "Generate pairs of colors based on the amount of stimulation you select.",
    favicon: "https://colormoods.co/assets/images/favicon/apple-touch-icon.png",
    ogImage: "https://colormoods.co/assets/images/og-image.jpg",
    tags: [TAGS.color],
    url: "https://colormoods.co/",
  },
  {
    title: "Color Name Finder",
    author: "Jasper Bernaers",
    category: CATEGORIES.colors,
    description:
      "Free color name finder — identify any HTML color by name, HEX, RGB or HSL. Browse all 140+ CSS named colours, search by hue, and copy values instantly. No signup.",
    subtitle: "HTML Colour Names, HEX, RGB, HSL | jasperbernaers.com",
    tags: [TAGS.color],
    url: "https://jasperbernaers.com/colours/",
  },
  {
    title: "Color Palette Pro",
    category: CATEGORIES.colors,
    description:
      "Generate customizable color palettes in advanced color spaces that can be easily shared, downloaded, or exported.",
    favicon:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFBklEQVR4AeRYPYwbRRR+b3wFEn86qktxviPdURClogOBhHKGAgESkaCiCVUiRIgdQRGlAJ0dEqFQkYYKJAqCKMB3QiKCjiZRKLgunO+k5CpOkERJcd7J9816N/b5b9c+x/bOaMYznnnz3vd92p2dGSMjTl/c+Hlhpbb6TmVz9bOVjerlcq16FeVmeaN6D7V1JWzfRPsqbZwt5nDuiOHJSARY2Vx7sby5er5cW/27njMbKvZ7a+0nqvImCB1GOSAqj6EOc9g+gD+HaeNsMYdz6YO+6BPj+57Nfnlc+ffXp8tb1VMErDb4Xaz9SMQuDe8fPuCLPumbMRhreL+hh6EFIBg+svr/7rYEUtkf0iG49l+IgRiMxZiM3W6TrmcoASpba8f19u4/fGRbHul0GNJb45VhTMau1NaOp3fwcMZAApzbqj6PRew3GwQX4WoWZVx51kpwkViIaRAQqQWo3PjlWBDIdVF5eZCAI5kDLMREbGn9pxKgvFk9b3P6ddogj8qe2IgxTbzEAmDR+VasYGVP434MtsDosCYMnUgAfId/wKLzbkKfYzcjVmJOAqSvAE5Na99K4myibIDZYe8DqqcAfJ+oZh8fEztM7OTQC2BXAdyKivep1+SpGAMHx6UL2I4C8JvKFbXLnKnrJhdy6gS8owBBXb6UjKVunNoEcFtLbCwyxl8EnLh1lz2pRQAeLrC1PLvHJjN/sXU/S47NhFoEMHfqRQyOc2+P8CPNsw2OcZBYACpjAzv5O70Y+mANciTXaHYsgN7dPYb35OEtTWSRtRpHace1wSsWQAJ9v9GX/aqJqxMgvG/DbUv2qTcY2qWQs4gTAJeWbzRGvKkizk4AHHML3jCPiFpxnE149+7T4x8rsETuZjeXeyHq8q0md2NUDvlGPOJL7iYIfHz8QwnI3ajKoniayJ1fgTlP+ZP2nBErs2x5WcDdCPbGWSbfkxu4m54GHgzyFbjvAc/OFK3cN3gFdjqPetCrsmNAcxvF17xtrJUN8TSRu8FeeN1T/kLuJrBy3VcByN3M1Ot/+ioAuZuPD75eE1EPXwNdJ3d+BcBfquJb0pCzE8CK/uQb/4izE+B0/sgf4tVroOsh58atsDAZ+w0rL0oTV/cEkLR9fOYSjsbZPxdg/++4kjRKLMDpZ179T41eQF+mMzmSa0QyFoAdwRO5CuqpPhwBf6+80+AY27QIQGXUmDPxaMYaKuYMOUpTahGA/cX5I19hLbjCdqaKlSvFBXDbQ6pNAI6bnHwoGUvdOHUU4NR84S+t2w+yogG5kFMnPh0FoGHx4GuXRGX6vwrg4LiQVIfSVQDalvKFk6r6HdvTWIidHHph7ykAJxbzy++J6mW2p6oAs8PeB3RfATi/lF9+m2qyPQ2FWIk5CdZEAtCRUxPvE9sTXYDRYU0IMrEA9FfimjDBXweu9sRIrElLKgHolCuqMXJIsLHg/4kowEJMxJYWT2oBGIDf1NJi4RUVc0JExnl22MHW/QSxEBOwpM4DCRBF4dbSPjnzLBadzwXHzKh/5DViMSZju637EAGHEoBxebjAovOpfWpmTowUZaQ3S7i8RQzGYkzGliHT0AJE8QmmNF84V1pYfs6qeQl7B+wiATgyGLiGD9UL9EnfjMFYA7vbM3HfBGj2y/u2Un75JAHn6sEiLiCPukfWyo+wu4ZyS/AYow5z2L6FP9csbJyt6FHOpQ/6ok+Mt+VhOx4AAAD//w+u7LYAAAAGSURBVAMAkST1QJPNV/sAAAAASUVORK5CYII=",
    ogImage: "https://colorpalette.pro/colorpalettepro.png",
    tags: [TAGS.color],
    url: "https://colorpalette.pro/",
  },
  {
    title: "Contrast Report",
    author: "Adam Chaboryk",
    category: CATEGORIES.colors,
    description: "Straightforward colour contrast checker with Picture-in-picture (PiP) mode.",
    favicon:
      "https://raw.githubusercontent.com/adamchaboryk/contrast.report/main/public/icons/icon-384x384.webp",
    ogImage: "https://contrast.report/og-contrast-report.png",
    subtitle: "WCAG Colour Contrast Checker",
    url: "https://contrast.report/",
  },
  {
    title: "Coolors",
    category: CATEGORIES.colors,
    description: "Generate or browse beautiful color combinations for your designs.",
    ogImage: "https://coolors.co/assets/img/og_image.png",
    subtitle: "The super fast color palettes generator!",
    tags: [TAGS.color],
    url: "https://coolors.co/",
  },
  {
    title: "CSS Gradient",
    category: CATEGORIES.colors,
    description:
      "As a free CSS gradient generator tool, this website lets you create a colorful gradient background for your website, blog, or social media profile.",
    tags: [TAGS.color],
    url: "https://cssgradient.io/",
  },
  {
    title: "Gradient Colors Collection",
    author: "GradientsCSS",
    category: CATEGORIES.colors,
    description:
      "Discover and explore beautiful gradient colors for your projects. GradientsCSS offers a curated collection of gradient palettes for web design and creative work.",
    favicon: "https://gradientscss.vercel.app/favicon/favicon.svg",
    ogImage: "https://gradientscss.vercel.app/favicon/banner.jpg",
    tags: [TAGS.color],
    url: "https://gradientscss.vercel.app/",
  },
  {
    title: "Gradienty",
    category: CATEGORIES.colors,
    description:
      "Easily create beautiful Tailwind CSS gradients with Gradienty - a CSS generator. Choose from ready-made gradients or customize your own for eye-catching backgrounds, text effects, and glassmorphism designs. Perfect for websites, apps, and more. Try it for free now!",
    tags: [TAGS.color],
    url: "https://gradienty.codes/",
  },
  {
    title: "Graduum",
    author: "Niklaus Gerber",
    category: CATEGORIES.colors,
    description:
      "A collection of one hundred free high-quality mesh gradients suitable for desktop and mobile use.",
    favicon: "https://graduum.niklausgerber.com/assets/images/apple-touch-icon.png?v=a66bfeb6",
    ogImage: "https://graduum.niklausgerber.com/assets/images/share.jpg?v=a66bfeb6",
    subtitle: "Free Mesh Gradients by Niklaus Gerber",
    tags: [TAGS.color],
    url: "https://graduum.niklausgerber.com/",
  },
  {
    title: "Happy Hues",
    category: CATEGORIES.colors,
    description:
      "See color palette inspiration on a real example website. As you click on different palettes every color on this site updates to give you context of how that color could be used for your design or illustration projects.",
    subtitle: "Curated colors in context",
    tags: [TAGS.color],
    url: "https://www.happyhues.co/",
  },
  {
    title: "Harmonizer",
    category: CATEGORIES.colors,
    description: "Color palette generator for UI",
    favicon: "https://harmonizer.evilmartians.com/favicon.svg",
    ogImage: "https://harmonizer.evilmartians.com/social-image.png",
    tags: [TAGS.color],
    url: "https://harmonizer.evilmartians.com/",
  },
  {
    title: "Hypercolor",
    category: CATEGORIES.colors,
    description:
      "A curated collection of beautiful Tailwind CSS gradients using the full range of Tailwind CSS colors. Easily copy and paste the class names, CSS or even save the gradients as an image.",
    favicon: "https://hypercolor.dev/favicon.png",
    tags: [TAGS.color],
    url: "https://hypercolor.dev/",
  },
  {
    title: "ImageColorPicker.com",
    category: CATEGORIES.colors,
    className: "bg-foreground border-paper",
    description:
      "Upload an image, paste from clipboard, or enter a URL to instantly pick colors. Get HEX, RGB, HSL codes free — no signup required.",
    favicon: "https://imagecolorpicker.com/favicon.svg",
    ogImage: "https://imagecolorpicker.com/imagecolorpicker-preview_b.webp",
    subtitle: "Pick Colors from Any Image – Free HEX, RGB & Color Codes",
    tags: [TAGS.color],
    url: "https://imagecolorpicker.com/",
  },
  {
    title: "Ingradients",
    category: CATEGORIES.colors,
    description: "Hand-picked mesh gradients for your next design project.",
    ogImage:
      "https://framerusercontent.com/modules/reOxh1U6VCuZnfou6x2m/eJmnQAJafZ0DjECK4JSI/assets/S3wd0yoFBBYAKv1E4nAuhoWxC8.jpg",
    tags: [TAGS.color, TAGS.gradient],
    url: "https://ingradients.net/",
  },
  {
    title: "Khroma",
    category: CATEGORIES.colors,
    description:
      "Khroma is the fastest way to discover, search, and save color combos and palettes you'll love. Discover a personalized AI-powered color tool for designers to find the perfect color scheme.",
    tags: [TAGS.color],
    url: "https://www.khroma.co/",
  },
  {
    title: "Meditations in Color",
    author: "Pixel Symphony",
    category: CATEGORIES.colors,
    description:
      "Colorists in the Colorist Archive: browse chromatic profiles, artwork palettes, and generative color studies across artists, periods, and collections.",
    subtitle: "Chromatic Profiles",
    tags: [TAGS.color],
    url: "https://meditationsincolor.com/colorists",
  },
  {
    title: "Mesh Gradient",
    category: CATEGORIES.colors,
    description: "MESH is a simple way to create beautiful, unique gradients using shaders.",
    favicon: "https://meshgradient.com/logo-sm.svg",
    tags: [TAGS.color],
    url: "https://meshgradient.com/",
  },
  {
    title: "mymind",
    category: CATEGORIES.colors,
    description: "A collection of unique color combinations for your design projects.",
    ogImage: "https://static.accelerator.net/134/0.107.0/colors/images/mymind-colors-twitter.jpg",
    subtitle: "Mindfully curated color palettes",
    tags: [TAGS.color],
    url: "https://access.mymind.com/colors",
  },
  {
    title: "OKLCH Color Picker & Converter",
    category: CATEGORIES.colors,
    description: "OKLCH is a new way to encode colors (like hex, RGBA, or HSL)",
    favicon:
      "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='128'%20height='128'%3e%3ccircle%20fill='oklch(0.7 0.1 279)'%20cx='64'%20cy='64'%20r='64'/%3e%3cpath%20fill='%23fff'%20d='m16%2064%2048-48%2048%2048-48%2048zm16%200%2032%2032%2032-32-32-32z'/%3e%3c/svg%3e",
    ogImage: "https://oklch.com/og-oklch.png",
    tags: [TAGS.color],
    url: "https://oklch.com/",
  },
  {
    title: "Palette Maker",
    category: CATEGORIES.colors,
    description:
      "Free color tool for creatives and color lovers. Create color palettes and preview them on UI/UX, Illustrations, Web, Apps, Branding and other designs.",
    tags: [TAGS.color],
    url: "https://palettemaker.com/",
  },
  {
    title: "Paletton",
    category: CATEGORIES.colors,
    description:
      "In love with colors, since 2002. A designer tool for creating color combinations that work together well. Formerly known as Color Scheme Designer. Use the color wheel to create great color palettes.",
    favicon: "https://paletton.com/img/favicon-128.png",
    ogImage: "https://paletton.com/img/paletton-preview-20140414.png",
    subtitle: "The Color Scheme Designer",
    tags: [TAGS.color],
    url: "https://paletton.com/",
  },
  {
    title: "Photo Gradient",
    category: CATEGORIES.colors,
    description: "Generate beautiful gradients from colors or from a photo",
    ogImage: "https://photogradient.com/social-image.png",
    subtitle: "Image to Mesh Gradient",
    tags: [TAGS.gradient],
    url: "https://photogradient.com/",
  },
  {
    title: "Picture Palette",
    category: CATEGORIES.colors,
    description: "Aesthetically pleasing color palettes based on aesthetically pleasing pictures.",
    tags: [TAGS.color],
    url: "https://picture-palette.web.app/",
  },
  {
    title: "Picular",
    category: CATEGORIES.colors,
    description:
      "Picular is a rocket fast primary color generator using Google’s image search. If you ever needed the perfect yellow hex code from a banana, this is the tool for you.",
    favicon: "https://picular.co/images/favicon-base.png",
    tags: [TAGS.color],
    url: "https://picular.co/",
  },
  {
    title: "Poline",
    category: CATEGORIES.colors,
    description:
      "Poline is lightweight, dependency free and fast JavaScript function written in TypeScript. It draws lines between anchors over polar HSL coordinates to generate pleasing color palettes.",
    favicon: "https://meodai.github.io/poline/poline-wheel.png",
    ogImage: "https://meodai.github.io/poline/socialfb.png",
    subtitle: "Esoteric Color Palette Generation Library",
    url: "https://meodai.github.io/poline/",
  },
  {
    title: "Radix Colors",
    author: "Radix",
    category: CATEGORIES.colors,
    description:
      "An open-source color system for designing beautiful, accessible websites and apps.",
    favicon: "https://www.radix-ui.com/favicon-black.svg",
    ogImage: "https://radix-ui.com/colors/opengraph-image.png",
    tags: [TAGS.color],
    url: "https://www.radix-ui.com/colors",
  },
  {
    title: "RandomA11y",
    category: CATEGORIES.colors,
    description:
      "Discover millions of accessible color combinations with RandomA11y, the real-time color playground.",
    ogImage: "https://randoma11y-feed.adam-f8f.workers.dev/og-image.png",
    subtitle: "Endless collection of accessible color combos",
    tags: [TAGS.color],
    url: "https://randoma11y.com/",
  },
  {
    title: "Realtime Colors",
    category: CATEGORIES.colors,
    description: "Visualize your colors and fonts on a real website.",
    tags: [TAGS.color],
    url: "https://www.realtimecolors.com/",
  },
  {
    title: "Scale",
    author: "Hayk An",
    category: CATEGORIES.colors,
    description: "Color scale generator by Hayk An",
    favicon: "https://hihayk.github.io/scale/favicon.ico",
    ogImage: "https://raw.githubusercontent.com/hihayk/scale/master/docs/screenshot-1.png",
    subtitle: "Color scale generator",
    tags: [TAGS.color],
    url: "https://hihayk.github.io/scale",
  },
  {
    title: "Shadecolr",
    author: "Radix",
    category: CATEGORIES.colors,
    description:
      "Generate Tailwind CSS color palettes for SaaS dashboards, product UI, and client projects. Preview them in a real interface and export usable shades fast.",
    favicon: "https://www.shadecolr.com/image/favicon/favicon.svg",
    ogImage: "https://www.shadecolr.com/image/shadecolr-cover.png",
    subtitle: "Generate color palettes for Tailwind CSS",
    tags: [TAGS.color],
    url: "https://www.shadecolr.com/",
  },
  {
    title: "Shader Gradient",
    category: CATEGORIES.colors,
    description: "Create beautiful moving gradients on Framer, Figma and React",
    tags: [TAGS.color],
    url: "https://shadergradient.co/",
  },
  {
    title: "Super Color Palette",
    category: CATEGORIES.colors,
    description:
      "Generate super awesome color palettes by shifting hue, saturation, lightness, and more. 100% free without ads.",
    favicon: "https://supercolorpalette.com/favicon.svg",
    ogImage: "https://i.imgur.com/XeZmcBP.png",
    subtitle: "100% Free Color Palette Generator",
    tags: [TAGS.color],
    url: "https://supercolorpalette.com/",
  },
  {
    title: "The good colors",
    author: "Fran Pérez",
    category: CATEGORIES.colors,
    description:
      "Generate perceptually uniform color palettes with OKLCH, ensuring consistent lightness and chroma. Supports wide gamut displays, checks contrast ratios using APAC, and is optimized for color blindness.",
    favicon:
      "data:image/svg+xml;utf8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20%20%20%20x%3D%221%22%0A%20%20%20%20%20%20%20%20%20%20y%3D%221%22%0A%20%20%20%20%20%20%20%20%20%20width%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20height%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20rx%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20fill%3D%22%23ffb0cc%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20%20%20%20x%3D%226%22%0A%20%20%20%20%20%20%20%20%20%20y%3D%221%22%0A%20%20%20%20%20%20%20%20%20%20width%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20height%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20rx%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20fill%3D%22%23ffb4b3%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20%20%20%20x%3D%2211%22%0A%20%20%20%20%20%20%20%20%20%20y%3D%221%22%0A%20%20%20%20%20%20%20%20%20%20width%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20height%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20rx%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20fill%3D%22%23ffba80%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20%20%20%20x%3D%221%22%0A%20%20%20%20%20%20%20%20%20%20y%3D%226%22%0A%20%20%20%20%20%20%20%20%20%20width%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20height%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20rx%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20fill%3D%22%23eace58%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20%20%20%20x%3D%226%22%0A%20%20%20%20%20%20%20%20%20%20y%3D%226%22%0A%20%20%20%20%20%20%20%20%20%20width%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20height%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20rx%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20fill%3D%22%23ade27f%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20%20%20%20x%3D%2211%22%0A%20%20%20%20%20%20%20%20%20%20y%3D%226%22%0A%20%20%20%20%20%20%20%20%20%20width%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20height%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20rx%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20fill%3D%22%2356edc5%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20%20%20%20x%3D%221%22%0A%20%20%20%20%20%20%20%20%20%20y%3D%2211%22%0A%20%20%20%20%20%20%20%20%20%20width%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20height%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20rx%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20fill%3D%22%2334e7ff%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20%20%20%20x%3D%226%22%0A%20%20%20%20%20%20%20%20%20%20y%3D%2211%22%0A%20%20%20%20%20%20%20%20%20%20width%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20height%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20rx%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20fill%3D%22%23a7d2ff%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Crect%0A%20%20%20%20%20%20%20%20%20%20x%3D%2211%22%0A%20%20%20%20%20%20%20%20%20%20y%3D%2211%22%0A%20%20%20%20%20%20%20%20%20%20width%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20height%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20rx%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20fill%3D%22%23d5c1ff%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%0A%20%20%20%20%3C%2Fsvg%3E",
    ogImage: "https://thegoodcolors.com/og-poster.png",
    tags: [TAGS.color],
    url: "https://thegoodcolors.com/",
  },
  {
    title: "UI Colors",
    category: CATEGORIES.colors,
    description:
      "Create and customize beautiful Tailwind CSS color palettes. Generate, edit, and export colors for your design with our intuitive color generator tool.",
    subtitle: "Tailwind CSS Colors - All colors + Custom color generator",
    tags: [TAGS.color],
    url: "https://uicolors.app/",
  },
  {
    title: "WebGradients",
    category: CATEGORIES.colors,
    description:
      "Browse 180 free CSS gradients for backgrounds, UI, websites, and design systems. Copy CSS code, explore color palettes, and find gradient inspiration fast.",
    tags: [TAGS.color],
    url: "https://webgradients.com/",
  },
];
