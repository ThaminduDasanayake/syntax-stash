"use client";

import { FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { TextAreaField } from "@/components/ui/textarea-field";

interface GitignoreSnippet {
  id: string;
  name: string;
  description: string;
  content: string;
}

const GITIGNORE_SNIPPETS: GitignoreSnippet[] = [
  {
    id: "nodejs",
    name: "Node.js",
    description: "npm, node_modules, lockfiles",
    content: `# Dependencies
node_modules/
npm-debug.log
yarn-error.log
yarn-debug.log
pnpm-debug.log
lerna-debug.log

# Runtime
.env
.env.local
.env.*.local

# Build
dist/
build/
.next/
out/

# Cache
.cache/
.eslintcache`,
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "Next.js specific files",
    content: `# Next.js build
.next/
out/
.vercel

# Next.js production
.env.production.local
.env.*.local

# Next.js cache
.swc`,
  },
  {
    id: "python",
    name: "Python",
    description: "Python virtual envs, packages",
    content: `# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
venv/
env/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/

# Python egg info
*.egg-info/
.installed.cfg
*.egg

# PyCharm
.idea/

# mypy
.mypy_cache/
.dmypy.json
dmypy.json

# pytest
.pytest_cache/`,
  },
  {
    id: "java",
    name: "Java",
    description: "Java build files, Maven/Gradle",
    content: `# Compiled class files
*.class

# Log files
*.log

# BlueJ files
*.ctxt

# Mobile Tools for Java (J2ME)
.mtj.tmp/

# Package Files
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar

# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
release.properties

# Gradle
.gradle/
build/
gradle-app.setting
.gradletasknamecache`,
  },
  {
    id: "macos",
    name: "macOS",
    description: "macOS system files",
    content: `# macOS
.DS_Store
.AppleDouble
.LSOverride
*.swp
*.swo
*~
.DS_Store
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk`,
  },
  {
    id: "windows",
    name: "Windows",
    description: "Windows system and application files",
    content: `# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk
*.exe
*.dll
*.sys`,
  },
  {
    id: "vscode",
    name: "VS Code",
    description: "Visual Studio Code settings",
    content: `# VS Code
.vscode/
*.code-workspace

# VS Code extensions
.vscode/extensions/

# Local workspace settings
.vscode/settings.json
.vscode/launch.json
.vscode/extensions.json`,
  },
  {
    id: "jetbrains",
    name: "JetBrains IDEs",
    description: "IntelliJ IDEA, WebStorm, etc.",
    content: `# JetBrains IDEs
.idea/
.idea_modules/
*.iml
*.iws
*.ipr
out/

# JetBrains specific files
.DS_Store
*.jks
*.keystore

# Local environment override
.idea/misc.xml
.idea/codeStyles/Project.xml`,
  },
  {
    id: "django",
    name: "Django",
    description: "Django framework files",
    content: `# Django
*.log
local_settings.py
db.sqlite3
/media
/static
.env

# Django migrations
*/migrations/*.py
!*/migrations/__init__.py`,
  },
  {
    id: "ruby",
    name: "Ruby/Rails",
    description: "Ruby on Rails applications",
    content: `# Gems
Gemfile.lock
vendor/bundle/

# Rails
log/
tmp/
public/uploads/
.byebug_history

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/`,
  },
  {
    id: "react",
    name: "React",
    description: "React and CRA files",
    content: `# React
node_modules/
npm-debug.log
yarn-error.log

# Build
build/
dist/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`,
  },
  {
    id: "golang",
    name: "Go",
    description: "Go programming language",
    content: `# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.so.*
*.dylib

# Test binary, built with 'go test -c'
*.test

# Output of the go coverage tool
*.out

# Go workspace file
go.work`,
  },
];

export default function GitignoreGeneratorPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSnippets = useMemo(() => {
    return GITIGNORE_SNIPPETS.filter(
      (snippet) =>
        snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const generatedGitignore = useMemo(() => {
    if (selectedIds.size === 0) return "";

    const selectedSnippets = GITIGNORE_SNIPPETS.filter((s) =>
      selectedIds.has(s.id),
    );

    return selectedSnippets
      .map((snippet) => `# ${snippet.name}\n${snippet.content}`)
      .join("\n\n");
  }, [selectedIds]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    setSelectedIds(new Set(GITIGNORE_SNIPPETS.map((s) => s.id)));
  };

  const clearAll = () => {
    setSelectedIds(new Set());
  };

  return (
    <ToolLayout
      icon={FileText}
      title=".gitignore"
      highlight="Generator"
      description="Generate .gitignore files for your project with common patterns for popular stacks."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Selection */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold">
              Select environments & frameworks
            </h3>
            <InputField
              placeholder="Search stacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
              containerClassName=""
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              className="text-xs"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              disabled={selectedIds.size === 0}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>

          {/* Toggle Grid */}
          <div className="grid gap-2">
            {filteredSnippets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matches found</p>
            ) : (
              filteredSnippets.map((snippet) => (
                <button
                  key={snippet.id}
                  onClick={() => toggleSelection(snippet.id)}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    selectedIds.has(snippet.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-medium">{snippet.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {snippet.description}
                  </div>
                </button>
              ))
            )}
          </div>

          {selectedIds.size > 0 && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground">
                {selectedIds.size} stack{selectedIds.size !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}
        </div>

        {/* Right: Output */}
        <div className="space-y-4">
          <TextAreaField
            label={
              generatedGitignore
                ? "Generated .gitignore"
                : "Select stacks to generate"
            }
            value={generatedGitignore}
            readOnly
            rows={24}
            placeholder="Your .gitignore will appear here..."
            action={
              <CopyButton
                value={generatedGitignore}
                disabled={!generatedGitignore}
              />
            }
          />
        </div>
      </div>
    </ToolLayout>
  );
}
