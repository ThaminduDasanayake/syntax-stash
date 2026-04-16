export interface CodeFile {
  filename: string;
  language: string;
  code: string;
  html: string;
}

type Instruction = {
  text: string;
  code?: string[];
};

export interface Snippet {
  id: string;
  title: string;
  description: string;
  languages: string[];
  setup?: string;
  instructions?: Instruction[];
  files: CodeFile[];
}
