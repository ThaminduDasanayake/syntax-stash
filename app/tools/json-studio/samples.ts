export const SAMPLES = {
  format: '{\n  "name": "syntax-stash",\n  "version": 1,\n  "features": ["fast", "local", "focused"]\n}',

  tree: JSON.stringify(
    {
      user: {
        id: "usr_42",
        name: "Ada Lovelace",
        email: "ada@example.com",
        isActive: true,
        tags: ["admin", "early-adopter"],
        profile: {
          bio: "Mathematician & first programmer",
          avatarUrl: null,
          joinedAt: "1815-12-10T00:00:00Z",
        },
      },
      posts: [
        { id: 1, title: "Notes on the Analytical Engine", publishedAt: "1843-08-01", views: 4201 },
        { id: 2, title: "Translations and Commentary", publishedAt: null, views: 0 },
      ],
      meta: { total: 2, page: 1, perPage: 20 },
    },
    null,
    2,
  ),

  query: JSON.stringify(
    {
      store: {
        book: [
          { category: "reference", author: "Nigel Rees", title: "Sayings of the Century", price: 8.95, inStock: true },
          { category: "fiction", author: "Evelyn Waugh", title: "Sword of Honour", price: 12.99, inStock: false },
          { category: "fiction", author: "Herman Melville", title: "Moby Dick", isbn: "0-553-21311-3", price: 8.99, inStock: true },
          { category: "fiction", author: "J. R. R. Tolkien", title: "The Lord of the Rings", isbn: "0-395-19395-8", price: 22.99, inStock: true },
        ],
        bicycle: { color: "red", price: 399.95, inStock: true },
      },
      meta: { generated: "2026-04-19T21:39:21Z", total: 4 },
    },
    null,
    2,
  ),

  organize: `[
  { "name": "Alice", "age": 28, "city": "New York", "salary": 75000 },
  { "name": "Bob", "age": 34, "city": "San Francisco", "salary": 95000 },
  { "name": "Charlie", "age": 23, "city": "Austin", "salary": 65000 },
  { "name": "Diana", "age": 31, "city": "New York", "salary": 85000 },
  { "name": "Eve", "age": 29, "city": "Seattle", "salary": 88000 }
]`,
} as const;

export type SampleKey = keyof typeof SAMPLES;
