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
    id: "node",
    name: "Node.js",
    image: "node:20-alpine",
    defaultPorts: [{ host: "3000", container: "3000" }],
    defaultEnv: [{ key: "NODE_ENV", value: "development" }],
    defaultVolumes: [{ host: ".", container: "/app" }],
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    image: "postgres:16-alpine",
    defaultPorts: [{ host: "5432", container: "5432" }],
    defaultEnv: [
      { key: "POSTGRES_DB", value: "mydb" },
      { key: "POSTGRES_USER", value: "postgres" },
      { key: "POSTGRES_PASSWORD", value: "secret" },
    ],
    defaultVolumes: [{ host: "postgres_data", container: "/var/lib/postgresql/data" }],
  },
  {
    id: "mysql",
    name: "MySQL",
    image: "mysql:8.0",
    defaultPorts: [{ host: "3306", container: "3306" }],
    defaultEnv: [
      { key: "MYSQL_ROOT_PASSWORD", value: "rootpassword" },
      { key: "MYSQL_DATABASE", value: "mydb" },
      { key: "MYSQL_USER", value: "myuser" },
      { key: "MYSQL_PASSWORD", value: "mypassword" },
    ],
    defaultVolumes: [{ host: "mysql_data", container: "/var/lib/mysql" }],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    image: "mongo:7.0",
    defaultPorts: [{ host: "27017", container: "27017" }],
    defaultEnv: [
      { key: "MONGO_INITDB_ROOT_USERNAME", value: "root" },
      { key: "MONGO_INITDB_ROOT_PASSWORD", value: "example" },
    ],
    defaultVolumes: [{ host: "mongo_data", container: "/data/db" }],
  },
  {
    id: "redis",
    name: "Redis",
    image: "redis:7-alpine",
    defaultPorts: [{ host: "6379", container: "6379" }],
    defaultEnv: [],
    defaultVolumes: [{ host: "redis_data", container: "/data" }],
  },
  {
    id: "nginx",
    name: "Nginx",
    image: "nginx:alpine",
    defaultPorts: [
      { host: "80", container: "80" },
      { host: "443", container: "443" },
    ],
    defaultEnv: [],
    defaultVolumes: [{ host: "./nginx.conf", container: "/etc/nginx/nginx.conf" }],
  },
  {
    id: "python",
    name: "Python",
    image: "python:3.12-slim",
    defaultPorts: [{ host: "8000", container: "8000" }],
    defaultEnv: [{ key: "PYTHONUNBUFFERED", value: "1" }],
    defaultVolumes: [{ host: ".", container: "/app" }],
  },
  {
    id: "go",
    name: "Go",
    image: "golang:1.22-alpine",
    defaultPorts: [{ host: "8080", container: "8080" }],
    defaultEnv: [{ key: "GO_ENV", value: "development" }],
    defaultVolumes: [{ host: ".", container: "/app" }],
  },
  {
    id: "rabbitmq",
    name: "RabbitMQ",
    image: "rabbitmq:3-management-alpine",
    defaultPorts: [
      { host: "5672", container: "5672" },
      { host: "15672", container: "15672" },
    ],
    defaultEnv: [
      { key: "RABBITMQ_DEFAULT_USER", value: "guest" },
      { key: "RABBITMQ_DEFAULT_PASS", value: "guest" },
    ],
    defaultVolumes: [],
  },
  {
    id: "elasticsearch",
    name: "Elasticsearch",
    image: "elasticsearch:8.12.0",
    defaultPorts: [
      { host: "9200", container: "9200" },
      { host: "9300", container: "9300" },
    ],
    defaultEnv: [
      { key: "discovery.type", value: "single-node" },
      { key: "xpack.security.enabled", value: "false" },
    ],
    defaultVolumes: [{ host: "es_data", container: "/usr/share/elasticsearch/data" }],
  },
];
