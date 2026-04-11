export type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  template: string;
  variables: string[];
};

export const promptTemplates: PromptTemplate[] = [
  {
    id: "code-refactor",
    title: "Code Refactor",
    description:
      "Refactor code in any language with a specific goal in mind, following best practices.",
    template:
      "Act as an expert [Language] developer. Refactor the following code to achieve [Goal]. Ensure the code is modular, well-commented, and follows best practices. Here is the code: \n\n[Code]",
    variables: ["Language", "Goal", "Code"],
  },
  {
    id: "explain-ml-concept",
    title: "Explain ML Concept",
    description:
      "Break down a machine learning concept with analogies tailored to any audience level.",
    template:
      "Explain the machine learning concept of [Concept] to someone with a [Audience Level] understanding of mathematics. Provide a real-world analogy and a simple use case.",
    variables: ["Concept", "Audience Level"],
  },
  {
    id: "react-nextjs-component",
    title: "React/Next.js Component Generator",
    description:
      "Generate a modern, functional Next.js component with Tailwind CSS and TypeScript.",
    template:
      "Write a modern, functional Next.js React component named [Component Name]. It must use Tailwind CSS and TypeScript. Requirements: [Requirements].",
    variables: ["Component Name", "Requirements"],
  },
];
