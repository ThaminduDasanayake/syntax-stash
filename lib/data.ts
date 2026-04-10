export type Tool = {
  title: string;
  url: string;
  description: string;
  category: string;
};

export const categories = [
  "All",
  "UI & Styling",
  "Machine Learning",
  "Learning",
  "APIs & Data",
  "Utilities",
];

export const tools: Tool[] = [
  {
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description:
      "A utility-first CSS framework for rapidly building modern websites without ever leaving your HTML.",
    category: "UI & Styling",
  },
  {
    title: "shadcn/ui",
    url: "https://ui.shadcn.com",
    description:
      "Beautifully designed components built with Radix UI and Tailwind CSS. Copy and paste into your apps.",
    category: "UI & Styling",
  },
  {
    title: "Hugging Face",
    url: "https://huggingface.co",
    description:
      "The AI community's hub for sharing models, datasets, and applications. Thousands of pretrained models.",
    category: "Machine Learning",
  },
  {
    title: "Replicate",
    url: "https://replicate.com",
    description:
      "Run AI models in the cloud with a simple API. No infrastructure required.",
    category: "Machine Learning",
  },
  {
    title: "The Odin Project",
    url: "https://www.theodinproject.com",
    description:
      "A free, open-source curriculum for learning web development from scratch to employable.",
    category: "Learning",
  },
  {
    title: "roadmap.sh",
    url: "https://roadmap.sh",
    description:
      "Community-driven roadmaps, articles, and guides for developers to navigate their career paths.",
    category: "Learning",
  },
  {
    title: "Public APIs",
    url: "https://publicapis.dev",
    description:
      "A collective list of free APIs for use in software and web development. Searchable and categorized.",
    category: "APIs & Data",
  },
  {
    title: "JSONPlaceholder",
    url: "https://jsonplaceholder.typicode.com",
    description:
      "Free fake and reliable API for testing and prototyping. No registration required.",
    category: "APIs & Data",
  },
  {
    title: "Regex101",
    url: "https://regex101.com",
    description:
      "Build, test, and debug regular expressions interactively with real-time explanation and match highlighting.",
    category: "Utilities",
  },
  {
    title: "Excalidraw",
    url: "https://excalidraw.com",
    description:
      "Virtual whiteboard for sketching hand-drawn like diagrams. Great for quick architecture drawings.",
    category: "Utilities",
  },
];
