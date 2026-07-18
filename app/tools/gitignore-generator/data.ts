interface GitignoreSnippet {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const GITIGNORE_SNIPPETS: GitignoreSnippet[] = [
  {
    id: "django",
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
    description: "Django framework files",
    name: "Django",
  },
  {
    id: "golang",
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
    description: "Go programming language",
    name: "Go",
  },
  {
    id: "java",
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
    description: "Java build files, Maven/Gradle",
    name: "Java",
  },
  {
    id: "jetbrains",
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
    description: "IntelliJ IDEA, WebStorm, etc.",
    name: "JetBrains IDEs",
  },
  {
    id: "macos",
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
    description: "macOS system files",
    name: "macOS",
  },
  {
    id: "nextjs",
    content: `# Next.js build
.next/
out/
.vercel

# Next.js production
.env.production.local
.env.*.local

# Next.js cache
.swc`,
    description: "Next.js specific files",
    name: "Next.js",
  },
  {
    id: "nodejs",
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
    description: "npm, node_modules, lockfiles",
    name: "Node.js",
  },
  {
    id: "python",
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
    description: "Python virtual envs, packages",
    name: "Python",
  },
  {
    id: "react",
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
    description: "React and CRA files",
    name: "React",
  },
  {
    id: "ruby",
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
    description: "Ruby on Rails applications",
    name: "Ruby/Rails",
  },
  {
    id: "vscode",
    content: `# VS Code
.vscode/
*.code-workspace

# VS Code extensions
.vscode/extensions/

# Local workspace settings
.vscode/settings.json
.vscode/launch.json
.vscode/extensions.json`,
    description: "Visual Studio Code settings",
    name: "VS Code",
  },
  {
    id: "windows",
    content: `# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk
*.exe
*.dll
*.sys`,
    description: "Windows system and application files",
    name: "Windows",
  },
];
