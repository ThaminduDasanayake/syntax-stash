export type ServiceTemplate = {
  id: string;
  name: string;
  image: string;
  defaultPorts: { host: string; container: string }[];
  defaultEnv: { key: string; value: string }[];
  defaultVolumes: { host: string; container: string }[];
};

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    id: "elasticsearch",
    defaultEnv: [
      { key: "discovery.type", value: "single-node" },
      { key: "xpack.security.enabled", value: "false" },
    ],
    defaultPorts: [
      { container: "9200", host: "9200" },
      { container: "9300", host: "9300" },
    ],
    defaultVolumes: [{ container: "/usr/share/elasticsearch/data", host: "es_data" }],
    image: "elasticsearch:8.12.0",
    name: "Elasticsearch",
  },
  {
    id: "go",
    defaultEnv: [{ key: "GO_ENV", value: "development" }],
    defaultPorts: [{ container: "8080", host: "8080" }],
    defaultVolumes: [{ container: "/app", host: "." }],
    image: "golang:1.22-alpine",
    name: "Go",
  },
  {
    id: "mongodb",
    defaultEnv: [
      { key: "MONGO_INITDB_ROOT_PASSWORD", value: "example" },
      { key: "MONGO_INITDB_ROOT_USERNAME", value: "root" },
    ],
    defaultPorts: [{ container: "27017", host: "27017" }],
    defaultVolumes: [{ container: "/data/db", host: "mongo_data" }],
    image: "mongo:7.0",
    name: "MongoDB",
  },
  {
    id: "mysql",
    defaultEnv: [
      { key: "MYSQL_DATABASE", value: "mydb" },
      { key: "MYSQL_PASSWORD", value: "mypassword" },
      { key: "MYSQL_ROOT_PASSWORD", value: "rootpassword" },
      { key: "MYSQL_USER", value: "myuser" },
    ],
    defaultPorts: [{ container: "3306", host: "3306" }],
    defaultVolumes: [{ container: "/var/lib/mysql", host: "mysql_data" }],
    image: "mysql:8.0",
    name: "MySQL",
  },
  {
    id: "nginx",
    defaultEnv: [],
    defaultPorts: [
      { container: "80", host: "80" },
      { container: "443", host: "443" },
    ],
    defaultVolumes: [{ container: "/etc/nginx/nginx.conf", host: "./nginx.conf" }],
    image: "nginx:alpine",
    name: "Nginx",
  },
  {
    id: "node",
    defaultEnv: [{ key: "NODE_ENV", value: "development" }],
    defaultPorts: [{ container: "3000", host: "3000" }],
    defaultVolumes: [{ container: "/app", host: "." }],
    image: "node:20-alpine",
    name: "Node.js",
  },
  {
    id: "postgres",
    defaultEnv: [
      { key: "POSTGRES_DB", value: "mydb" },
      { key: "POSTGRES_PASSWORD", value: "secret" },
      { key: "POSTGRES_USER", value: "postgres" },
    ],
    defaultPorts: [{ container: "5432", host: "5432" }],
    defaultVolumes: [{ container: "/var/lib/postgresql/data", host: "postgres_data" }],
    image: "postgres:16-alpine",
    name: "PostgreSQL",
  },
  {
    id: "python",
    defaultEnv: [{ key: "PYTHONUNBUFFERED", value: "1" }],
    defaultPorts: [{ container: "8000", host: "8000" }],
    defaultVolumes: [{ container: "/app", host: "." }],
    image: "python:3.12-slim",
    name: "Python",
  },
  {
    id: "rabbitmq",
    defaultEnv: [
      { key: "RABBITMQ_DEFAULT_PASS", value: "guest" },
      { key: "RABBITMQ_DEFAULT_USER", value: "guest" },
    ],
    defaultPorts: [
      { container: "5672", host: "5672" },
      { container: "15672", host: "15672" },
    ],
    defaultVolumes: [],
    image: "rabbitmq:3-management-alpine",
    name: "RabbitMQ",
  },
  {
    id: "redis",
    defaultEnv: [],
    defaultPorts: [{ container: "6379", host: "6379" }],
    defaultVolumes: [{ container: "/data", host: "redis_data" }],
    image: "redis:7-alpine",
    name: "Redis",
  },
];
