type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  starter: string;
  category: "coding" | "writing" | "analysis";
};

export const promptTemplates: PromptTemplate[] = [
  {
    id: "code-refactor",
    title: "Code Refactor",
    description: "Best practices for refactoring",
    starter:
      "Act as an expert software engineer. Refactor the following code to make it more modular, maintainable, and performant. Adhere to the language's standard conventions and best practices.\n\nTech Stack:\n\n\nCode:\n",
    category: "coding",
  },
  {
    id: "explain-concept",
    title: "Explain Concept",
    description: "Feynman technique explanation",
    starter:
      "Explain the concept of [insert topic] as if I am a junior developer. Use a real-world analogy, provide a short code example if applicable, and list common pitfalls.",
    category: "analysis",
  },
  {
    id: "api-design",
    title: "REST API Design",
    description: "Generate API specs",
    starter:
      "Design a RESTful API for a [insert application type]. Define the endpoints, HTTP methods, status codes, and provide a JSON schema for the request/response bodies.\n\nTech Stack / Framework:\n",
    category: "coding",
  },
  {
    id: "code-review",
    title: "Code Review",
    description: "Thorough code review prompt",
    starter:
      "Act as a senior engineer conducting a code review. Analyze the following code for bugs, performance issues, security vulnerabilities, and readability. Provide actionable suggestions with corrected code snippets.\n\nTech Stack / Rules:\n\n\nCode:\n",
    category: "coding",
  },
  {
    id: "technical-writing",
    title: "Technical Docs",
    description: "Generate documentation",
    starter:
      "Write clear, concise technical documentation for the following feature. Include an overview, usage examples, parameter descriptions, and edge cases to watch for.\n\nFeature Context:\n\n\nFeature / Code:\n",
    category: "writing",
  },
  {
    id: "debug-assistant",
    title: "Debug Assistant",
    description: "Systematic debugging prompt",
    starter:
      "I am encountering the following error. Act as a debugging expert. Identify the root cause, explain why it happens, and provide a step-by-step fix with corrected code.\n\nEnvironment / Tech Stack:\n\n\nError Message:\n\n\nCode Context:\n",
    category: "analysis",
  },
];

export const PLACEHOLDER = `You are an expert {{role}} with deep knowledge of {{domain}}.

## Task
Your task is to help {{user_name}} accomplish the following:
{{task_description}}

## Constraints
- Skill level of the audience: **{{skill_level}}**
- Response format: **{{output_format}}**
- Language: **{{language}}**

## Guidelines
- Be **clear** and **concise**
- Provide concrete examples where helpful

Begin your response now.`;
