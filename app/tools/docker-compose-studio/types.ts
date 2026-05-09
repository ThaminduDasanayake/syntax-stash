export type Port = { host: string; container: string };
export type EnvVar = { key: string; value: string };
export type Volume = { host: string; container: string };

export type Service = {
  id: string;
  templateId: string;
  name: string;
  image: string;
  ports: Port[];
  env: EnvVar[];
  volumes: Volume[];
};

export interface DockerService {
  name: string;
  image: string;
  ports: string[];
  volumes: string[];
  environment: string[];
  network: string;
  restart: string;
  detach: boolean;
  rm: boolean;
  tty: boolean;
  privileged: boolean;
  user: string;
  workdir: string;
  hostname: string;
  entrypoint: string;
  command: string[];
  labels: string[];
  capAdd: string[];
  capDrop: string[];
  memLimit: string;
  cpuShares: string;
}

export type ParseResult = { ok: true; service: DockerService } | { ok: false; error: string };

export type TabType = "builder" | "cli";
