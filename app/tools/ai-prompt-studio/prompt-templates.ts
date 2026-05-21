type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  starter: string;
  category: "coding" | "writing" | "analysis";
};

export const promptTemplates: PromptTemplate[] = [
  {
    id: "blank-template",
    title: "Blank Template",
    description: "Multi-variable starter template",
    starter: `You are an expert {{role}} with deep knowledge of {{domain}}.

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

Begin your response now.`,
    category: "writing",
  },
  {
    id: "code-refactor",
    title: "Code Refactor",
    description: "Best practices for refactoring",
    starter:
      "Act as an expert software engineer specializing in {{tech_stack}}. Refactor the following code to make it more modular, maintainable, and performant. Adhere to the language's standard conventions and best practices.\n\n## Code\n{{code}}",
    category: "coding",
  },
  {
    id: "explain-concept",
    title: "Explain Concept",
    description: "Feynman technique explanation",
    starter:
      "Explain the concept of {{topic}} as if I am a junior developer. Use a real-world analogy, provide a short code example if applicable, and list common pitfalls to avoid.",
    category: "analysis",
  },
  {
    id: "code-review",
    title: "Code Review",
    description: "Thorough code review prompt",
    starter:
      "Act as a senior engineer conducting a code review for a {{tech_stack}} codebase. Analyze the following code for bugs, performance issues, security vulnerabilities, and readability. Provide actionable suggestions with corrected code snippets.\n\n## Code\n{{code}}",
    category: "coding",
  },
  {
    id: "technical-writing",
    title: "Technical Docs",
    description: "Generate documentation",
    starter:
      "Write clear, concise technical documentation for the following feature. Include an overview, usage examples, parameter descriptions, and edge cases to watch for.\n\n## Feature Context\n{{feature_context}}\n\n## Code\n{{code}}",
    category: "writing",
  },
  {
    id: "debug-assistant",
    title: "Debug Assistant",
    description: "Systematic debugging prompt",
    starter:
      "I am encountering the following error in a {{tech_stack}} project. Act as a debugging expert. Identify the root cause, explain why it happens, and provide a step-by-step fix with corrected code.\n\n## Error Message\n{{error_message}}\n\n## Code Context\n{{code_context}}",
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
