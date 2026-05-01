export const DEFAULT_MARKDOWN = `# Markdown Live Preview

Write your markdown on the left and see it rendered in real time.

## Text Formatting

This is **bold**, this is *italic*, and this is ~~strikethrough~~.

You can also use \`inline code\` in your text.

## Lists

### Unordered

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered

1. Step one
2. Step two
3. Step three

### Task List

- [x] Write the markdown
- [x] Preview it live
- [ ] Export when ready

## Links & Images

Visit [GitHub](https://github.com) for more info.

![Placeholder image](https://placehold.co/600x400?text=Markdown+Preview)

## Blockquote

> The best way to predict the future is to invent it.
>
> — Alan Kay

## Table

| Feature | Supported |
|---------|-----------|
| Headings | Yes |
| Bold / Italic | Yes |
| Tables | Yes |
| Code blocks | Yes |
| Task lists | Yes |
| Images | Yes |

## Code Block

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

## Horizontal Rule

---

*Start editing on the left to see your changes here instantly.*`;
