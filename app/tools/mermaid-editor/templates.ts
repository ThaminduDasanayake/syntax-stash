export type DiagramType = "flowchart" | "sequence" | "class" | "state" | "er" | "gantt" | "pie";

export const DIAGRAM_TEMPLATES: Record<DiagramType, string> = {
  flowchart: `flowchart TD
    A([Start]) --> B{Is it working?}
    B -- Yes --> C[✅ Ship it]
    B -- No --> D[Debug]
    D --> E{Fixed?}
    E -- Yes --> B
    E -- No --> F[🔥 Panic]
    F --> D`,

  sequence: `sequenceDiagram
    participant Client
    participant API
    participant DB

    Client->>+API: POST /login
    API->>+DB: SELECT user WHERE email=?
    DB-->>-API: User row
    API-->>-Client: 200 { token }

    Client->>+API: GET /profile (Bearer token)
    API-->>-Client: 200 { name, email }`,

  class: `classDiagram
    class Animal {
      +String name
      +int age
      +makeSound() void
    }

    class Dog {
      +String breed
      +fetch() void
    }

    class Cat {
      +bool isIndoor
      +purr() void
    }

    Animal <|-- Dog
    Animal <|-- Cat`,

  state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Loading : fetch()
    Loading --> Success : data received
    Loading --> Error : request failed
    Success --> Idle : reset()
    Error --> Idle : retry()
    Error --> [*] : dismiss()`,

  er: `erDiagram
    USER {
        uuid id PK
        string email
        string name
        bool isActive
    }
    POST {
        uuid id PK
        uuid userId FK
        string title
        text body
        timestamp publishedAt
    }
    COMMENT {
        uuid id PK
        uuid postId FK
        uuid userId FK
        text content
    }

    USER ||--o{ POST : writes
    POST ||--o{ COMMENT : has
    USER ||--o{ COMMENT : writes`,

  gantt: `gantt
    title Project Roadmap
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements     :done,    req, 2024-01-01, 7d
    Design           :done,    des, after req, 5d
    section Development
    Backend API      :active,  api, 2024-01-15, 14d
    Frontend         :         fe,  after api, 10d
    section Release
    QA Testing       :         qa,  after fe, 5d
    Launch           :milestone, launch, after qa, 0d`,

  pie: `pie title Browser Market Share 2024
    "Chrome"  : 65.4
    "Safari"  : 19.1
    "Edge"    : 4.5
    "Firefox" : 3.1
    "Other"   : 7.9`,
};

export const DIAGRAM_LABELS: Record<DiagramType, string> = {
  flowchart: "Flowchart",
  sequence: "Sequence",
  class: "Class",
  state: "State",
  er: "Entity-Relationship",
  gantt: "Gantt",
  pie: "Pie chart",
};
