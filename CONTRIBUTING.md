# Contributing to Syntax Stash

Thank you for your interest in contributing to **Syntax Stash**! We welcome contributions of all kinds — adding new developer tools, curating quality resources, improving documentation, or fixing bugs.

---

## 🚀 Quick Start

1. **Fork the Repository**
   Click the **Fork** button at the top right of [GitHub](https://github.com/ThaminduDasanayake/syntax-stash).

2. **Clone your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/syntax-stash.git
   cd syntax-stash
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ How to Add a New Resource

All curated resource links are stored in `lib/resource-data/`.

1. Open `lib/resource-data/` and locate the appropriate category file (e.g. `frontend-resources.ts`, `dev-resources.ts`, etc.).
2. Add a new item object matching the `Tool` interface:
   ```ts
   {
     title: "Example Tool",
     subtitle: "Brief tagline describing what it does",
     description: "A detailed 1-2 sentence description of why it is useful.",
     url: "https://example.com",
     category: "Frontend & UI",
     author: "Author Name",
     authorLink: "https://github.com/author",
     tags: ["css", "ui", "react"],
   }
   ```
3. Run `npm run lint` and `npx tsc --noEmit` to verify code format and type safety.

---

## 🔧 How to Add an In-Browser Tool

1. Create your tool component under `app/tools/[your-tool-name]/page.tsx`.
2. Register the tool entry in `lib/tools-data.ts` under `internalTools`:
   ```ts
   {
     title: "Your Tool Title",
     slug: "your-tool-name",
     category: "Developer Tools & Utilities",
     description: "What your in-browser utility does.",
     icon: "ToolboxIcon",
   }
   ```

---

## 🧪 Code Style & Checks

Before submitting a Pull Request, please ensure all checks pass:

```bash
# Type-check TypeScript files
npx tsc --noEmit

# Run ESLint check
npm run lint

# Automatically fix linting and sorting
npm run lint:fix

# Check formatting with Prettier
npm run format:check
```

---

## 📬 Submitting a Pull Request

1. Create a descriptive branch: `git checkout -b feat/add-new-resource`
2. Commit your changes: `git commit -m "feat: add New Resource to Frontend category"`
3. Push to your fork: `git push origin feat/add-new-resource`
4. Open a Pull Request against the `main` branch of the official repository.

Thank you for helping make Syntax Stash better for the developer community!
