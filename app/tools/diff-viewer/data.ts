export const PLACEHOLDER_ORIGINAL = `function greet(name) {
  console.log("Hello, " + name);
  return name;
}

const result = greet("world");
console.log(result);`;

export const PLACEHOLDER_MODIFIED = `function greet(name, greeting = "Hello") {
  console.log(\`\${greeting}, \${name}!\`);
  return { name, greeting };
}

const result = greet("world", "Hi");
console.log(result.name);`;
