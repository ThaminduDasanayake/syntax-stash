import { SERVICE_TEMPLATES } from "@/app/tools/docker-compose-studio/templates";
import { DockerService, ParseResult, Service } from "@/app/tools/docker-compose-studio/types";

export function makeService(templateId: string): Service {
  const tpl = SERVICE_TEMPLATES.find((t) => t.id === templateId) ?? SERVICE_TEMPLATES[0];
  return {
    id: crypto.randomUUID(),
    env: tpl.defaultEnv.map((e) => ({ ...e })),
    image: tpl.image,
    name: tpl.id,
    ports: tpl.defaultPorts.map((p) => ({ ...p })),
    templateId: tpl.id,
    volumes: tpl.defaultVolumes.map((v) => ({ ...v })),
  };
}

export function buildYaml(services: Service[]): string {
  if (services.length === 0) return "# Add a service to generate docker-compose.yml";

  const lines: string[] = ["services:"];

  for (const svc of services) {
    const safeName = svc.name.replace(/[^a-zA-Z0-9_-]/g, "_") || "service";
    lines.push(`  ${safeName}:`);
    lines.push(`    image: ${svc.image}`);

    if (svc.ports.length > 0) {
      lines.push("    ports:");
      for (const p of svc.ports) {
        if (p.host && p.container) {
          lines.push(`      - "${p.host}:${p.container}"`);
        }
      }
    }

    if (svc.env.length > 0) {
      const validEnv = svc.env.filter((e) => e.key);
      if (validEnv.length > 0) {
        lines.push("    environment:");
        for (const e of validEnv) {
          lines.push(`      - ${e.key}=${e.value}`);
        }
      }
    }

    if (svc.volumes.length > 0) {
      const validVols = svc.volumes.filter((v) => v.host && v.container);
      if (validVols.length > 0) {
        lines.push("    volumes:");
        for (const v of validVols) {
          lines.push(`      - ${v.host}:${v.container}`);
        }
      }
    }
  }

  // Named volumes section
  const namedVolumes = services
    .flatMap((s) => s.volumes)
    .filter((v) => v.host && !v.host.startsWith(".") && !v.host.startsWith("/"))
    .map((v) => v.host);
  const uniqueVols = [...new Set(namedVolumes)];
  if (uniqueVols.length > 0) {
    lines.push("");
    lines.push("volumes:");
    for (const vol of uniqueVols) {
      lines.push(`  ${vol}:`);
    }
  }

  return lines.join("\n");
}

export function tokenize(raw: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];

    if (ch === "\\" && !inSingle && i + 1 < raw.length) {
      const next = raw[i + 1];
      if (next === "\n" || next === "\r") {
        i += 2;
        continue;
      }
      current += next;
      i += 2;
      continue;
    }

    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      i++;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      i++;
      continue;
    }

    if ((ch === " " || ch === "\t" || ch === "\n") && !inSingle && !inDouble) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      i++;
      continue;
    }
    current += ch;
    i++;
  }
  if (current) tokens.push(current);
  return tokens;
}

export function extractValue(token: string, rest: string[]): [string, number] {
  const eq = token.indexOf("=");
  if (eq !== -1) return [0, token.slice(eq + 1)];
  return [1, rest[0] ?? ""];
}

export function parseDockerRun(cmd: string): ParseResult {
  const raw = cmd.trim();
  if (!raw) return { error: "No command entered.", ok: false };

  const tokens = tokenize(raw);
  let i = 0;

  if (tokens[i] === "docker") i++;
  if (tokens[i] !== "run")
    return { error: `Expected "docker run", got "${tokens[i] ?? "(empty)"}"`, ok: false };
  i++;

  const svc: DockerService = {
    capAdd: [],
    capDrop: [],
    command: [],
    cpuShares: "",
    detach: false,
    entrypoint: "",
    environment: [],
    hostname: "",
    image: "",
    labels: [],
    memLimit: "",
    name: "",
    network: "",
    ports: [],
    privileged: false,
    restart: "",
    rm: false,
    tty: false,
    user: "",
    volumes: [],
    workdir: "",
  };

  while (i < tokens.length) {
    const tok = tokens[i];
    const rest = tokens.slice(i + 1);

    if (tok === "-d" || tok === "--detach") {
      svc.detach = true;
      i++;
      continue;
    }
    if (tok === "--rm") {
      svc.rm = true;
      i++;
      continue;
    }
    if (tok === "-t" || tok === "--tty" || tok === "-it" || tok === "-ti") {
      svc.tty = true;
      i++;
      continue;
    }
    if (tok === "--privileged") {
      svc.privileged = true;
      i++;
      continue;
    }

    const valueFlagMap: Array<[(v: string) => void, RegExp]> = [
      [
        (v) => {
          svc.capAdd.push(v);
        },
        /^--cap-add(?:=|$)/,
      ],
      [
        (v) => {
          svc.capDrop.push(v);
        },
        /^--cap-drop(?:=|$)/,
      ],
      [
        (v) => {
          svc.cpuShares = v;
        },
        /^--cpu-shares(?:=|$)/,
      ],
      [
        (v) => {
          svc.entrypoint = v;
        },
        /^--entrypoint(?:=|$)/,
      ],
      [
        (v) => {
          svc.environment.push(v);
        },
        /^(?:-e|--env)(?:=|$)/,
      ],
      [
        (v) => {
          svc.hostname = v;
        },
        /^(?:-h|--hostname)(?:=|$)/,
      ],
      [
        (v) => {
          svc.labels.push(v);
        },
        /^(?:-l|--label)(?:=|$)/,
      ],
      [
        (v) => {
          svc.memLimit = v;
        },
        /^(?:-m|--memory)(?:=|$)/,
      ],
      [
        (v) => {
          svc.name = v;
        },
        /^--name(?:=|$)/,
      ],
      [
        (v) => {
          svc.network = v;
        },
        /^--network(?:=|$)/,
      ],
      [
        (v) => {
          svc.ports.push(v);
        },
        /^(?:-p|--publish)(?:=|$)/,
      ],
      [
        (v) => {
          svc.restart = v;
        },
        /^--restart(?:=|$)/,
      ],
      [
        (v) => {
          svc.user = v;
        },
        /^(?:-u|--user)(?:=|$)/,
      ],
      [
        (v) => {
          svc.volumes.push(v);
        },
        /^(?:-v|--volume)(?:=|$)/,
      ],
      [
        (v) => {
          svc.workdir = v;
        },
        /^(?:-w|--workdir)(?:=|$)/,
      ],
    ];

    let matched = false;
    for (const [setter, pattern] of valueFlagMap) {
      if (pattern.test(tok)) {
        const [val, consumed] = extractValue(tok, rest);
        setter(val);
        i += 1 + consumed;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    if (tok.startsWith("-")) {
      i++;
      if (rest[0] && !rest[0].startsWith("-")) i++;
      continue;
    }

    svc.image = tok;
    i++;
    svc.command = tokens.slice(i);
    break;
  }

  if (!svc.image) return { error: "Could not find an image name in the command.", ok: false };
  return { ok: true, service: svc };
}

export function indent(level: number, text: string): string {
  return "  ".repeat(level) + text;
}

export function deriveServiceName(image: string): string {
  return image.split("/").pop()?.split(":")[0] ?? "app";
}

export function generateCompose(svc: DockerService): string {
  const serviceName = svc.name || deriveServiceName(svc.image);
  const lines: string[] = [
    "",
    `version: "3.8"`,
    indent(1, `${serviceName}:`),
    indent(2, `image: ${svc.image}`),
    "services:",
  ];

  if (svc.hostname) lines.push(indent(2, `hostname: ${svc.hostname}`));
  if (svc.restart) lines.push(indent(2, `restart: ${svc.restart}`));
  if (svc.user) lines.push(indent(2, `user: "${svc.user}"`));
  if (svc.workdir) lines.push(indent(2, `working_dir: ${svc.workdir}`));
  if (svc.privileged) lines.push(indent(2, `privileged: true`));
  if (svc.tty) lines.push(indent(2, `tty: true`));
  if (svc.entrypoint) lines.push(indent(2, `entrypoint: ${svc.entrypoint}`));

  if (svc.command.length > 0) {
    if (svc.command.length === 1) lines.push(indent(2, `command: ${svc.command[0]}`));
    else {
      lines.push(indent(2, "command:"));
      svc.command.forEach((c) => lines.push(indent(3, `- ${c}`)));
    }
  }

  if (svc.ports.length > 0) {
    lines.push(indent(2, "ports:"));
    svc.ports.forEach((p) => lines.push(indent(3, `- "${p}"`)));
  }
  if (svc.volumes.length > 0) {
    lines.push(indent(2, "volumes:"));
    svc.volumes.forEach((v) => lines.push(indent(3, `- ${v}`)));
  }

  if (svc.environment.length > 0) {
    lines.push(indent(2, "environment:"));
    svc.environment.forEach((e) => {
      const eqIdx = e.indexOf("=");
      if (eqIdx === -1) lines.push(indent(3, `${e}:`));
      else {
        const key = e.slice(0, eqIdx);
        const val = e.slice(eqIdx + 1);
        const needsQuote = /[:,#{}[\]|>&*!%@`]/.test(val) || val === "";
        lines.push(indent(3, `${key}: ${needsQuote ? `"${val}"` : val}`));
      }
    });
  }

  if (svc.labels.length > 0) {
    lines.push(indent(2, "labels:"));
    svc.labels.forEach((l) => lines.push(indent(3, `- "${l}"`)));
  }
  if (svc.capAdd.length > 0) {
    lines.push(indent(2, "cap_add:"));
    svc.capAdd.forEach((c) => lines.push(indent(3, `- ${c}`)));
  }
  if (svc.capDrop.length > 0) {
    lines.push(indent(2, "cap_drop:"));
    svc.capDrop.forEach((c) => lines.push(indent(3, `- ${c}`)));
  }
  if (svc.memLimit) lines.push(indent(2, `mem_limit: ${svc.memLimit}`));
  if (svc.cpuShares) lines.push(indent(2, `cpu_shares: ${svc.cpuShares}`));

  if (svc.network) {
    lines.push(indent(2, "networks:"));
    lines.push(indent(3, `- ${svc.network}`));
  }

  const namedVolumes = svc.volumes
    .map((v) => v.split(":")[0])
    .filter((src) => src && !src.startsWith("/") && !src.startsWith("."));
  if (namedVolumes.length > 0) {
    lines.push("", "volumes:");
    namedVolumes.forEach((v) => lines.push(indent(1, `${v}:`)));
  }

  if (svc.network) {
    lines.push("", "networks:", indent(1, `${svc.network}:`));
  }

  return lines.join("\n");
}
