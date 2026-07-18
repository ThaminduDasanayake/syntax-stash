export const SAMPLES = {
  format:
    '{\n  "name": "syntax-stash",\n  "version": 1,\n  "features": ["fast", "local", "focused"]\n}',

  organize: `[
  { "name": "Alice", "age": 28, "city": "New York", "salary": 75000 },
  { "name": "Bob", "age": 34, "city": "San Francisco", "salary": 95000 },
  { "name": "Charlie", "age": 23, "city": "Austin", "salary": 65000 },
  { "name": "Diana", "age": 31, "city": "New York", "salary": 85000 },
  { "name": "Eve", "age": 29, "city": "Seattle", "salary": 88000 }
]`,

  query: JSON.stringify(
    {
      meta: { generated: "2026-04-19T21:39:21Z", total: 4 },
      store: {
        bicycle: { color: "red", inStock: true, price: 399.95 },
        book: [
          {
            title: "Moby Dick",
            author: "Herman Melville",
            category: "fiction",
            inStock: true,
            isbn: "0-553-21311-3",
            price: 8.99,
          },
          {
            title: "Sayings of the Century",
            author: "Nigel Rees",
            category: "reference",
            inStock: true,
            price: 8.95,
          },
          {
            title: "Sword of Honour",
            author: "Evelyn Waugh",
            category: "fiction",
            inStock: false,
            price: 12.99,
          },
          {
            title: "The Lord of the Rings",
            author: "J. R. R. Tolkien",
            category: "fiction",
            inStock: true,
            isbn: "0-395-19395-8",
            price: 22.99,
          },
        ],
      },
    },
    null,
    2,
  ),

  tree: JSON.stringify(
    {
      meta: { page: 1, perPage: 20, total: 2 },
      posts: [
        { id: 1, title: "Notes on the Analytical Engine", publishedAt: "1843-08-01", views: 4201 },
        { id: 2, title: "Translations and Commentary", publishedAt: null, views: 0 },
      ],
      user: {
        id: "usr_42",
        email: "ada@example.com",
        isActive: true,
        name: "Ada Lovelace",
        profile: {
          avatarUrl: null,
          bio: "Mathematician & first programmer",
          joinedAt: "1815-12-10T00:00:00Z",
        },
        tags: ["admin", "early-adopter"],
      },
    },
    null,
    2,
  ),
} as const;

export type SampleKey = keyof typeof SAMPLES;
