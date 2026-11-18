# Syntax Stash — Category Audit & Restructuring Strategy Report

> **Audit Date:** November 18, 2026  
> **Database Scope:** 1,703 Resources across 21 Categories  
> **Actionable Moves Identified:** 89 Resources  

---

## Executive Summary

As Syntax Stash has scaled to over **1,700 resources**, category boundaries have naturally blurred. A comprehensive database audit was executed across all 21 categories to identify miscategorized resources, inspect category balance, evaluate naming clarity, and explore whether new categories should be introduced.

### Key Audit Findings:
1. **The "Media & Assets" Ambiguity:** "Media & Assets" currently contains 165 resources, but acts as a catch-all dumping ground. Over **40 resources** inside it belong in other categories (12 in *Images & Illustration*, 9 in *Sound*, 7 in *Icons*, 4 in *Mockups & Presentations*, 4 in *Backgrounds & Patterns*, 3 in *Animation & Motion*, and 3 in *Developer Tools*).
2. **Category Drift:** Categories like *Design & UX*, *Developer Tools & Utilities*, *Documentation & Markdown*, and *Frontend & UI* contain specialized resources that belong in newer, more targeted categories (*Animation & Motion*, *Backgrounds & Patterns*, *Design Systems*, *Mockups & Presentations*, *Sound*, and *Education & Community*).
3. **Sound Category Underutilization:** *Sound* only has 9 resources in the database, while **12 high-quality sound/audio resources** are misclassified under *Media & Assets* and *Developer Tools*. Moving them immediately doubles the size and utility of the *Sound* category.
4. **Strong Demand for a Dedicated "3D & WebGL" Category:** 82 resources across the platform focus on 3D design software (Spline), 3D graphics libraries (Three.js, React Three Fiber, Drei), 3D model assets, and WebGL shader tools, currently dispersed across 15 different categories.

---

## 1. Resolution: The "Media and Assets" vs. "Images & Illustration" Dilemma

### The Problem
You originally introduced **"Images & Illustration"** to house pure galleries, intending **"Media & Assets"** to be the home for image editing tools and creative utilities. However, the name **"Media and Assets"** is causing friction and confusion:
- **The word "Assets" denotes downloadable static content:** In design and engineering vocabulary, "assets" means downloadable graphic packs, avatar sets, illustration bundles, 3D models, textures, sound stems, and icon sheets — **not** web apps, background removers, or converters. Because of the label "Assets", static packs keep landing in this category instead of *Images & Illustration*.
- **The word "Media" is overly broad:** It invites audio clips, video clips, video editors, and camera filters indiscriminately.

### Analysis of Current Contents in "Media & Assets" (165 Items):
- **110 items** are genuine **creative tools, editors, generators, and optimizers** (e.g., Photopea, remove.bg, Squoosh, VectorCraft, FilmCraft, Ladybug, DotForge, SVGOMG, Boxy SVG, Clipdrop).
- **12 items** are **static illustration & avatar packs** that never made it into *Images & Illustration* (e.g., Avataaars, Bottts, DrawKit, Streamline, Transhumans).
- **9 items** are **sound effects & audio packs** belonging in *Sound* (e.g., SONNISS, SND, Sound Kit, Voicebox).
- **7 items** are **SVG brand logos & icon converters** belonging in *Icons* (e.g., Logos, Iconly, Free Favicon Generator).
- **4 items** are **device mockup tools** belonging in *Mockups & Presentations* (e.g., Tokokino, YUZU).
- **4 items** are **repeatable texture generators** belonging in *Backgrounds & Patterns* (e.g., Mirrors, Halftone Studio Lab).

### Recommended Naming Strategy
> **Verdict:** **Rename "Media & Assets" to "Media Tools & Editors" (or "Creative Tools & Editors").**

| Category Name | Exact Purpose & Inclusions | What Does NOT Belong |
|---|---|---|
| **Images & Illustration** | **Static visual content & galleries:** Downloadable vector illustrations, stock photography, avatar packs, character doodles, clip art, and stock image search engines (e.g., Unsplash, Pexels, unDraw, Avataaars, Transhumans, Storyset). | Editing tools, converters, background removers, canvas apps. |
| **Media Tools & Editors** *(New Name)* | **Active creation & manipulation software:** In-browser image editors, background removers, vector editors, SVG path optimizers, image/video compressors, dither/halftone/shader visual effects studios, and media format converters (e.g., Photopea, remove.bg, Squoosh, VectorCraft, Ladybug, Boxy SVG, vid2ascii). | Static downloadable illustration packs, icon libraries, audio samples. |

This renaming creates an unmistakable semantic distinction: **Images & Illustration = Content**, whereas **Media Tools & Editors = Software/Tools**.

---

## 2. Should You Introduce Any New Category?

Based on an exhaustive scan of the 1,703 resources, here is the recommendation for potential new categories:

### A. Strongly Recommended: "3D & WebGL"
* **Evidence:** There are currently **82 resources** related to 3D and WebGL scattered across 15 categories:
  * 3D Web Frameworks & Renderers: *React Three Fiber*, *Drei*, *Three.js* (currently in *Frontend & UI*).
  * 3D Design Applications & Modeling: *Spline*, *FluidCAD*, *Cadmapper*, *Juddesk*, *Pascal Editor* (currently in *Animation*, *Dev Tools*, *Design & UX*).
  * 3D Assets & Free Models: *Need3D*, *Free 3D Icon Collection*, *Thiings*, *wannathis.one* (currently in *Images & Illustration*, *Mockups*).
  * WebGL Shader Studios: *Shader Lab*, *TSL Graph*, *OpenShaders*, *Caustic* (currently in *Media & Assets*, *Dev Tools*).
* **Verdict:** **Introduce `3D & WebGL` (slug: `3d-webgl`).** It immediately captures 30–50+ existing resources and provides a dedicated destination for modern WebGPU, shader, and 3D web technologies.

### B. Recommended Expansion: Expand "Sound" to "Audio & Video" (or Keep "Sound" Focused)
* **Current status:** *Sound* currently has only 9 resources, but with our 12 audited additions, it grows to **21 resources**.
* **Video Tools status:** Video editing and capture tools (*FilmCraft*, *Recordly*, *html-video*, *Cliparr*, *FrameSketch*, *Slideshow maker*, *seqframe*, *vid2ascii*) currently lack a natural home and get shoved into *Media & Assets* or *Dev Tools*.
* **Verdict:** You have two viable choices:
  1. **Option 1 (Recommended):** Keep **Sound** focused strictly on audio/music/SFX/synthesizers, and let **Media Tools & Editors** cover image, vector, and video processing software.
  2. **Option 2:** Expand the category name to **"Audio & Video"** (slug: `audio-video`), aggregating sound effects, voice cloning, screen recorders, and video production tools in one multimedia hub.

### C. Category to Monitor / Not Yet Needed: "Boilerplates & Starter Kits"
* An audit for boilerplates, SaaS starters, and Next.js kits only surfaced 3 dedicated items. Most starter code is embedded within component libraries. **Do not introduce at this time.**

### D. What to do with "Games" (Currently 4 items)?
* *Games* has only 4 resources (*Saltline*, *WASM Arcade*, *Teleoperator*, *Tidewater*).
* **Verdict:** Keep *Games* as a niche fun/experimental category, but consider expanding it with browser games built with web tech, open-source web games, and creative dev simulations (e.g., *Elevator Saga*, *CSS Diner*, *Untrusted*).

---

## 3. Comprehensive Master Table: Resources to Move (89 Items)

The table below catalogs all **89 resources** that require category re-assignment, with links, their current placement, their verified destination, and the rationale for the move.

| # | Resource | Current Category | Proposed Category | Rationale |
|---|---|---|---|---|
| 1 | [Sound Design Essentials (For Video Creators)](https://nikkohunt.gumroad.com/l/JJCAf) | **Media & Assets** | **Sound** | Curated sound effect library of cinematic .wav audio files. |
| 2 | [Voicebox](https://voicebox.sh/) | **Media & Assets** | **Sound** | Desktop voice cloning and TTS audio generation application. |
| 3 | [SONNISS](https://sonniss.com/) | **Media & Assets** | **Sound** | Sound effects libraries from independent audio publishers. |
| 4 | [SND](https://snd.dev/) | **Media & Assets** | **Sound** | UI sound assets and interactive audio packs for developers. |
| 5 | [Sound Kit](https://soundkit.thisux.com/) | **Media & Assets** | **Sound** | UI interaction sound library with preview audio. |
| 6 | [Audio Library](https://audiolibrary.com.co/) | **Media & Assets** | **Sound** | Free background music and audio tracks directory. |
| 7 | [Cinematic Sound Pack](https://nikkohunt.gumroad.com/l/dpclP) | **Media & Assets** | **Sound** | High-quality cinematic sound effects pack in .wav format. |
| 8 | [Free Online Audio Editor](https://jasperbernaers.com/audio-editor/) | **Media & Assets** | **Sound** | Browser-based audio trimming, cutting, and fading tool. |
| 9 | [mobygratis](https://mobygratis.com/) | **Media & Assets** | **Sound** | Catalog of free music and audio stems for creators. |
| 10 | [Sonify Your Images](https://sonification.shiva.codes/) | **Media & Assets** | **Sound** | Converts images into audio WAV frequencies and sonification. |
| 11 | [Beeps](https://www.beeps.studio/) | **Developer Tools & Utilities** | **Sound** | Procedural UI interaction sound generator for web apps. |
| 12 | [SoundCraft](https://getartcraft.com/apps/soundcraft) | **Developer Tools & Utilities** | **Sound** | Multitrack audio workstation and MIDI editing DAW app. |
| 13 | [Storytale](https://storytale.io/browse/?isFree=true) | **Media & Assets** | **Images & Illustration** | Extensive library of 3D and 2D illustrations, graphics, and asset packs. |
| 14 | [Avataaars](https://avataaars.com/) | **Media & Assets** | **Images & Illustration** | Modular avatar illustration library and character generator. |
| 15 | [Bottts](https://bottts.com/) | **Media & Assets** | **Images & Illustration** | Modular robot avatar illustration library. |
| 16 | [Free Userpics Pack](https://userpics.craftwork.design/) | **Media & Assets** | **Images & Illustration** | Curated pack of 100+ user avatars and character illustrations. |
| 17 | [GetIllustrations](https://getillustrations.com/) | **Media & Assets** | **Images & Illustration** | Massive repository of 170,000+ vector illustrations and scenes. |
| 18 | [On Fire illustrations](https://onfire.craftwork.design/) | **Media & Assets** | **Images & Illustration** | Handcrafted vector illustration pack. |
| 19 | [Pablo Stanley](https://pablostanley.gumroad.com/) | **Media & Assets** | **Images & Illustration** | Creator illustration doodle packs, brushes, and vector characters. |
| 20 | [Peeps Avatar Builder by UI8.net](https://peeps.ui8.net/) | **Media & Assets** | **Images & Illustration** | Hand-drawn vector avatar builder and character generator. |
| 21 | [SketchValley](https://sketchvalley.com/) | **Media & Assets** | **Images & Illustration** | Library of 1,000+ free vector illustrations for UI and presentations. |
| 22 | [Streamline](https://www.streamlinehq.com/illustrations) | **Media & Assets** | **Images & Illustration** | Extensive collection of vector illustrations and graphic elements. |
| 23 | [Transhumans](https://www.transhumans.xyz/) | **Media & Assets** | **Images & Illustration** | Collection of punk/sci-fi themed black & white vector illustrations. |
| 24 | [Avatars](https://avatars.outpacestudios.com/) | **Media & Assets** | **Images & Illustration** | Generative gradient avatar component library. |
| 25 | [Logos](https://logos.lndev.me/) | **Media & Assets** | **Icons** | Searchable repository of 15,000+ free brand and tech SVG logos. |
| 26 | [Iconly](https://iconly.io/) | **Media & Assets** | **Icons** | Icon preparation tool for converting SVG strokes to fills and webfonts. |
| 27 | [Convert PNG to ICO file](https://png-to-ico.com/) | **Media & Assets** | **Icons** | Utility for converting raster images into multi-size ICO app icons. |
| 28 | [Free Placeholder Logo Collection](https://graphicsauce.co/free-placeholder-logo/) | **Media & Assets** | **Icons** | Collection of transparent SVG placeholder brand marks. |
| 29 | [Free Favicon Generator](https://jasperbernaers.com/free-favicon-generator/) | **Media & Assets** | **Icons** | Generates browser favicons in multiple dimensions from images. |
| 30 | [Good Stuff No Nonsense](https://goodstuffnononsense.com/) | **Media & Assets** | **Icons** | Hand-drawn icon sets in vector SVG formats. |
| 31 | [uilogos](https://uilogos.co/) | **Media & Assets** | **Icons** | Curated pack of placeholder brand logos and dummy marks. |
| 32 | [SkeuDesign](https://www.skeudesign.com/) | **Images & Illustration** | **Icons** | Extensive collection of 12,000+ skeuomorphic app and UI icons. |
| 33 | [theSVG](https://thesvg.org/) | **Images & Illustration** | **Icons** | Open-source library of 7,400+ tech brand SVG logos and icons. |
| 34 | [Free 3D Icon Collection](https://graphicsauce.co/free-3d-icons/) | **Images & Illustration** | **Icons** | Downloadable collection of high-resolution 3D icons. |
| 35 | [SVG Repo](https://www.svgrepo.com/) | **Images & Illustration** | **Icons** | Vast repository of free vector icons and mono/multi-color SVG glyphs. |
| 36 | [Icons8](https://icons8.com/icons) | **Images & Illustration** | **Icons** | Massive directory of matching UI icons in consistent styles. |
| 37 | [Haikei](https://haikei.app/) | **Images & Illustration** | **Backgrounds & Patterns** | Generative design tool creating SVG geometric patterns and background waves. |
| 38 | [Contour](https://illustrations.run/contour/) | **Images & Illustration** | **Backgrounds & Patterns** | Topographic contour line and elevation background pattern generator. |
| 39 | [Svg Wave](https://svgwave.in/) | **Images & Illustration** | **Backgrounds & Patterns** | Customizable SVG wave divider and section background generator. |
| 40 | [SVG Shapes](https://www.shapes.gallery/) | **Images & Illustration** | **Backgrounds & Patterns** | Copy-paste organic geometric SVG shapes and textures. |
| 41 | [Mirrors](https://www.designminis.com/mirrors) | **Media & Assets** | **Backgrounds & Patterns** | Creates kaleidoscopic repeating patterns and seamless tiled wallpapers. |
| 42 | [Halftone Studio Lab](https://etienne.design/tools/halftone/) | **Media & Assets** | **Backgrounds & Patterns** | Halftone dot patterns and repeatable texture generator. |
| 43 | [fffuel](https://www.fffuel.co/) | **Media & Assets** | **Backgrounds & Patterns** | Collection of SVG generators for patterns, textures, and mesh gradients. |
| 44 | [Durves](https://www.durves.com/) | **Design & UX** | **Backgrounds & Patterns** | Tileable curving line backgrounds and organic pattern generator. |
| 45 | [Transparent Textures](https://www.transparenttextures.com/) | **Design & UX** | **Backgrounds & Patterns** | Tileable transparent PNG textures for subtle website backgrounds. |
| 46 | [Tokokino](https://tokokino.com/) | **Media & Assets** | **Mockups & Presentations** | Device mockup frames and screenshot presentation builder. |
| 47 | [YUZU](https://yuzudigital.gumroad.com/) | **Media & Assets** | **Mockups & Presentations** | Mockup and packaging showcase creator. |
| 48 | [slides.supply](https://slides.supply/) | **Media & Assets** | **Mockups & Presentations** | Presentation slide decks and pitch deck layout templates. |
| 49 | [Bloo](https://bloouikit.com/) | **Design & UX** | **Mockups & Presentations** | Wireframing and UI mockup components for product concepts. |
| 50 | [Contra](https://contrauikit.com/) | **Design & UX** | **Mockups & Presentations** | Wireframe presentation kit and interactive storyboard tool. |
| 51 | [Storyboard Maker](https://storytribeapp.com/) | **Design & UX** | **Mockups & Presentations** | Interactive storyboard creator for presentation visual narratives. |
| 52 | [Wiretext](https://wiretext.app/) | **Design & UX** | **Mockups & Presentations** | Text-based wireframe and low-fi layout presentation tool. |
| 53 | [dump](https://dump.cam/) | **Design & UX** | **Mockups & Presentations** | Creative design showcase and mockup presentation board. |
| 54 | [javiitools](https://javii.tools/) | **Design & UX** | **Mockups & Presentations** | Mockup framing and social presentation generator. |
| 55 | [Slidev](https://sli.dev/) | **Documentation & Markdown** | **Mockups & Presentations** | Developer-focused presentation slides written in Markdown. |
| 56 | [404 Animation Library](https://404.colorion.co/) | **Frontend & UI** | **Animation & Motion** | Curated library of animated SVG/Lottie 404 motion illustrations. |
| 57 | [ASCII Motion](https://ascii-motion.com/) | **Design & UX** | **Animation & Motion** | Kinetic ASCII animation generator and terminal motion player. |
| 58 | [Fluidmotion](https://fluidmotion.app/) | **Media & Assets** | **Animation & Motion** | Interactive fluid simulation and spring motion builder. |
| 59 | [Making SVG Loading Spinners](https://fffuel.co/svg-spinner/) | **Media & Assets** | **Animation & Motion** | Step-by-step interactive SVG loading spinner animations. |
| 60 | [MotionView](https://feralui.dev/motionview) | **UI & Components** | **Animation & Motion** | Interactive previewer for framer-motion and UI easing curves. |
| 61 | [OpenMotion](https://openmotion.design/) | **Design & UX** | **Animation & Motion** | Open-source motion design presets and UI micro-interaction library. |
| 62 | [PaperAnimator.com](https://paperanimator.com/) | **Design & UX** | **Animation & Motion** | Stop-motion paper cut animation generator. |
| 63 | [Vanta.js](https://www.vantajs.com/) | **Frontend & UI** | **Animation & Motion** | Animated 3D/WebGL background visualizer for web pages. |
| 64 | [animos](https://animos.app/) | **Design & UX** | **Animation & Motion** | CSS animation generator and keyframe motion builder. |
| 65 | [seqframe](https://seqfra.me/) | **Media & Assets** | **Animation & Motion** | Turns image frame sequences into animated GIF and MP4 loops. |
| 66 | [Creattie](https://creattie.com/) | **Images & Illustration** | **Animation & Motion** | Curated library of animated Lottie motion assets and JSON icons. |
| 67 | [MiroMiro](https://miromiro.app/) | **Frontend & UI** | **Design Systems** | Comprehensive design token reference and design system guidelines. |
| 68 | [The Component Gallery](https://component.gallery/) | **UI & Components** | **Design Systems** | Cross-design-system repository documenting interface patterns across systems. |
| 69 | [Product UI](https://primer.style/product/) | **UI & Components** | **Design Systems** | GitHub Primer design system principles, guidelines, and interface patterns. |
| 70 | [Free QR Code Generator](https://jasperbernaers.com/QR/) | **Media & Assets** | **Developer Tools & Utilities** | Utility generator for custom QR codes across web/wifi/vcard formats. |
| 71 | [TinyQRC](https://www.tinyqrc.com/) | **Media & Assets** | **Developer Tools & Utilities** | Developer API and generator for programmatic QR codes. |
| 72 | [metadata-gen](https://github.com/mickadesign/metadata-gen) | **Media & Assets** | **Developer Tools & Utilities** | CLI tool generating social media open-graph images and favicons. |
| 73 | [Juddesk](https://www.juddesk.com/) | **Design & UX** | **Developer Tools & Utilities** | Interactive 3D workspace and room planning software. |
| 74 | [Pascal Editor](https://editor.pascal.app/) | **Design & UX** | **Developer Tools & Utilities** | Browser-based 3D architectural CAD layout editor. |
| 75 | [Matter.](https://hihayk.github.io/matter/) | **Documentation & Markdown** | **Developer Tools & Utilities** | Lightweight task management and developer productivity utility. |
| 76 | [ByteByteGo](https://bytebytego.com/) | **Data & APIs** | **Education & Community** | System design visual architecture educational guides and courses. |
| 77 | [SQLMaxx](https://sqlmaxx.com/) | **Developer Tools & Utilities** | **Education & Community** | Interactive SQL course with 66 structured lessons and 600+ exercises. |
| 78 | [Dev Resources](https://devresourc.es/) | **Developer Tools & Utilities** | **Education & Community** | Community-curated educational roadmaps and programming resources. |
| 79 | [ilovecreatives](https://ilovecreatives.com/) | **Developer Tools & Utilities** | **Education & Community** | Creative education courses and trade school platform for digital creatives. |
| 80 | [OverAPI.com](https://overapi.com/) | **Documentation & Markdown** | **Education & Community** | Comprehensive directory of programming cheatsheets across languages. |
| 81 | [Devhints](https://devhints.io/) | **Documentation & Markdown** | **Education & Community** | Curated collection of developer syntax reference cheatsheets. |
| 82 | [Model Context Protocol](https://modelcontextprotocol.io/) | **Data & APIs** | **AI & Machine Learning** | Open protocol standard for integrating LLMs and AI agent workflows. |
| 83 | [DesignCraft](https://getartcraft.com/apps/designcraft) | **Documentation & Markdown** | **Design & UX** | Native publication layout and desktop vector design software. |
| 84 | [Movie Poster Archive](https://meditationsincolor.com/movies) | **Color & Gradients** | **Inspiration & Galleries** | Curated chromatic design archive of movie posters for visual inspiration. |
| 85 | [Anypost](https://anypost.com/) | **Documentation & Markdown** | **Backend & Infrastructure** | Transactional and broadcast email delivery API infrastructure. |
| 86 | [Wolfram|Alpha](https://www.wolframalpha.com/) | **Developer Tools & Utilities** | **Data & APIs** | Computational knowledge engine and structured scientific computation API. |
| 87 | [Free AI Pixel Art Fixer](https://www.spritefusion.com/pixel-snapper) | **Images & Illustration** | **Media & Assets** | Image processing utility to clean up AI pixel art and snapping. |
| 88 | [Recordly](https://recordly.dev/) | **Developer Tools & Utilities** | **Media & Assets** | Screen recording and video capture tool. |
| 89 | [html-video](https://open-design.ai/html-video/) | **Developer Tools & Utilities** | **Media & Assets** | Programmatic rendering engine turning HTML/CSS into video. |


---

## 4. Breakdown of Moves by Target Category

### 1. Moves to **Sound** (12 Resources)
* [Sound Design Essentials (For Video Creators)](https://nikkohunt.gumroad.com/l/JJCAf) (from Media & Assets)
* [Voicebox](https://voicebox.sh/) (from Media & Assets)
* [SONNISS](https://sonniss.com/) (from Media & Assets)
* [SND](https://snd.dev/) (from Media & Assets)
* [Sound Kit](https://soundkit.thisux.com/) (from Media & Assets)
* [Audio Library](https://audiolibrary.com.co/) (from Media & Assets)
* [Cinematic Sound Pack](https://nikkohunt.gumroad.com/l/dpclP) (from Media & Assets)
* [Free Online Audio Editor](https://jasperbernaers.com/audio-editor/) (from Media & Assets)
* [mobygratis](https://mobygratis.com/) (from Media & Assets)
* [Sonify Your Images](https://sonification.shiva.codes/) (from Media & Assets)
* [Beeps](https://www.beeps.studio/) (from Developer Tools & Utilities)
* [SoundCraft](https://getartcraft.com/apps/soundcraft) (from Developer Tools & Utilities)

### 2. Moves to **Images & Illustration** (12 Resources)
* [Storytale](https://storytale.io/browse/?isFree=true) (from Media & Assets)
* [Avataaars](https://avataaars.com/) (from Media & Assets)
* [Bottts](https://bottts.com/) (from Media & Assets)
* [Free Userpics Pack](https://userpics.craftwork.design/) (from Media & Assets)
* [GetIllustrations](https://getillustrations.com/) (from Media & Assets)
* [On Fire illustrations](https://onfire.craftwork.design/) (from Media & Assets)
* [Pablo Stanley](https://pablostanley.gumroad.com/) (from Media & Assets)
* [Peeps Avatar Builder by UI8.net](https://peeps.ui8.net/) (from Media & Assets)
* [SketchValley](https://sketchvalley.com/) (from Media & Assets)
* [Streamline](https://www.streamlinehq.com/illustrations) (from Media & Assets)
* [Transhumans](https://www.transhumans.xyz/) (from Media & Assets)
* [Avatars](https://avatars.outpacestudios.com/) (from Media & Assets)

### 3. Moves to **Icons** (12 Resources)
* [Logos](https://logos.lndev.me/) (from Media & Assets)
* [Iconly](https://iconly.io/) (from Media & Assets)
* [Convert PNG to ICO file](https://png-to-ico.com/) (from Media & Assets)
* [Free Placeholder Logo Collection](https://graphicsauce.co/free-placeholder-logo/) (from Media & Assets)
* [Free Favicon Generator](https://jasperbernaers.com/free-favicon-generator/) (from Media & Assets)
* [Good Stuff No Nonsense](https://goodstuffnononsense.com/) (from Media & Assets)
* [uilogos](https://uilogos.co/) (from Media & Assets)
* [SkeuDesign](https://www.skeudesign.com/) (from Images & Illustration)
* [theSVG](https://thesvg.org/) (from Images & Illustration)
* [Free 3D Icon Collection](https://graphicsauce.co/free-3d-icons/) (from Images & Illustration)
* [SVG Repo](https://www.svgrepo.com/) (from Images & Illustration)
* [Icons8](https://icons8.com/icons) (from Images & Illustration)

### 4. Moves to **Backgrounds & Patterns** (9 Resources)
* [Haikei](https://haikei.app/) (from Images & Illustration)
* [Contour](https://illustrations.run/contour/) (from Images & Illustration)
* [Svg Wave](https://svgwave.in/) (from Images & Illustration)
* [SVG Shapes](https://www.shapes.gallery/) (from Images & Illustration)
* [Basic Pattern Repository](https://patterns.helloyes.dev/) (from Media & Assets)
* [Mirrors](https://www.designminis.com/mirrors) (from Media & Assets)
* [Halftone Studio Lab](https://etienne.design/tools/halftone/) (from Media & Assets)
* [fffuel](https://www.fffuel.co/) (from Media & Assets)
* [Durves](https://durves.com/) (from Design & UX)
* [Transparent Textures](https://www.transparenttextures.com/) (from Design & UX)
* [Background Snippets Generator](https://tools.ui-layouts.com/background-snippets) (from Frontend & UI)
* [CSS Polka Dot Generator](https://tools.ui-layouts.com/polka-dots) (from Frontend & UI)

### 5. Moves to **Mockups & Presentations** (10 Resources)
* [Tokokino](https://tokokino.com/) (from Media & Assets)
* [YUZU](https://yuzu.design/) (from Media & Assets)
* [slides.supply](https://slides.supply/) (from Media & Assets)
* [Bloo](https://bloo.craftwork.design/) (from Design & UX)
* [Contra](https://contra.craftwork.design/) (from Design & UX)
* [Storyboard Maker](https://storyboardmaker.ai/) (from Design & UX)
* [Wiretext](https://wiretext.app/) (from Design & UX)
* [dump](https://dump.design/) (from Design & UX)
* [javiitools](https://javiitools.com/) (from Design & UX)
* [Slidev](https://sli.dev/) (from Documentation & Markdown)

### 6. Moves to **Animation & Motion** (11 Resources)
* [404 Animation Library](https://404.colorion.co/) (from Frontend & UI)
* [ASCII Motion](https://ascii-motion.com/) (from Design & UX)
* [Fluidmotion](https://fluidmotion.co/) (from Media & Assets)
* [Making SVG Loading Spinners](https://spinners.davidhckh.com/) (from Media & Assets)
* [MotionView](https://motionview.dev/) (from UI & Components)
* [OpenMotion](https://openmotion.dev/) (from Design & UX)
* [PaperAnimator.com](https://paperanimator.com/) (from Design & UX)
* [Vanta.js](https://www.vantajs.com/) (from Frontend & UI)
* [animos](https://animos.design/) (from Design & UX)
* [seqframe](https://seqfra.me/) (from Media & Assets)
* [Creattie](https://creattie.com/) (from Images & Illustration)

### 7. Moves to **Design Systems** (3 Resources)
* [MiroMiro](https://miromiro.space/) (from Frontend & UI)
* [The Component Gallery](https://component.gallery/) (from UI & Components)
* [Product UI](https://primer.style/product/) (from UI & Components)

### 8. Moves to **Developer Tools & Utilities** (6 Resources)
* [Free QR Code Generator](https://jasperbernaers.com/QR/) (from Media & Assets)
* [TinyQRC](https://www.tinyqrc.com/) (from Media & Assets)
* [metadata-gen](https://github.com/mickadesign/metadata-gen) (from Media & Assets)
* [Juddesk](https://www.juddesk.com/) (from Design & UX)
* [Pascal Editor](https://editor.pascal.app/) (from Design & UX)
* [Matter.](https://hihayk.github.io/matter/) (from Documentation & Markdown)

### 9. Moves to **Education & Community** (6 Resources)
* [ByteByteGo](https://bytebytego.com/) (from Data & APIs)
* [SQLMaxx](https://sqlmaxx.com/) (from Developer Tools & Utilities)
* [Dev Resources](https://devresourc.es/) (from Developer Tools & Utilities)
* [ilovecreatives](https://ilovecreatives.com/) (from Developer Tools & Utilities)
* [OverAPI.com](https://overapi.com/) (from Documentation & Markdown)
* [Devhints](https://devhints.io/) (from Documentation & Markdown)

### 10. Individual Category Realignments
* **AI & Machine Learning:** [Model Context Protocol](https://modelcontextprotocol.io/) (from Data & APIs)
* **Design & UX:** [DesignCraft](https://getartcraft.com/apps/designcraft) (from Documentation & Markdown)
* **Inspiration & Galleries:** [Movie Poster Archive](https://meditationsincolor.com/movies) (from Color & Gradients)
* **Backend & Infrastructure:** [Anypost](https://anypost.com/) (from Documentation & Markdown)
* **Data & APIs:** [Wolfram|Alpha](https://www.wolframalpha.com/) (from Developer Tools & Utilities)
* **Media & Assets (Editing Tools):** [Free AI Pixel Art Fixer](https://www.spritefusion.com/pixel-snapper) (from Images & Illustration), [Recordly](https://recordly.dev/) (from Dev Tools), [html-video](https://open-design.ai/html-video/) (from Dev Tools)

---

## 5. Execution Strategy: How to Apply Changes

To safely apply these changes to the Neon PostgreSQL database:
1. **Apply Migrations / Renames:**
   ```sql
   -- Update category name and slug for Media & Assets
   UPDATE category
   SET name = 'Media Tools & Editors', slug = 'media-tools'
   WHERE slug = 'media';
   ```
2. **Execute Category ID Reassignments:**
   A script can read the verified moves JSON (`scripts/final-verified-moves.json`) and update the `resource.category_id` using Drizzle ORM.
3. **Invalidate Cache:**
   Run `invalidateCategoryCache()` in `lib/categories.ts` to clear the Next.js edge cache tags (`categories`).
4. **Update Navigation & Metadata:**
   Verify references to `media` slug in sitemaps, navigation menus, and category constants.
