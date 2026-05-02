interface GitignoreSnippet {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const GITIGNORE_SNIPPETS: GitignoreSnippet[] = [
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
