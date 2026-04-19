"use client";

import { Container } from "lucide-react";
import { useMemo, useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";

// ---------------------------------------------------------------------------
// Tokenizer — respects single and double quotes, handles backslash escapes
// ---------------------------------------------------------------------------

function tokenize(raw: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];

    if (ch === "\\" && !inSingle && i + 1 < raw.length) {
      // Backslash continuation — skip the backslash and any following newline
      const next = raw[i + 1];
      if (next === "\n" || next === "\r") {
        i += 2;
        continue;
      }
      // Otherwise keep the escaped char
      current += next;
      i += 2;
      continue;
    }

    if (ch === "'" && !inDouble) { inSingle = !inSingle; i++; continue; }
    if (ch === '"' && !inSingle) { inDouble = !inDouble; i++; continue; }

    if ((ch === " " || ch === "\t" || ch === "\n") && !inSingle && !inDouble) {
      if (current) { tokens.push(current); current = ""; }
      i++;
      continue;
    }

    current += ch;
    i++;
  }

  if (current) tokens.push(current);
  return tokens;
}

// ---------------------------------------------------------------------------
// Parsed service shape
// ---------------------------------------------------------------------------

interface DockerService {
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

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

type ParseResult =
  | { ok: true; service: DockerService }
  | { ok: false; error: string };

/** Takes `--flag` or `-f`, returns the value from the same token after `=`
 *  OR consumes the next token in the array (returned as 2nd element). */
function extractValue(
  token: string,
  prefix: string,
  rest: string[],
): [value: string, consumed: number] {
  const eq = token.indexOf("=");
  if (eq !== -1) return [token.slice(eq + 1), 0];
  const val = rest[0] ?? "";
  return [val, 1];
}

function parseDockerRun(cmd: string): ParseResult {
  const raw = cmd.trim();
  if (!raw) return { ok: false, error: "No command entered." };

  const tokens = tokenize(raw);
  let i = 0;

  // Must start with "docker run" (or just "run")
  if (tokens[i] === "docker") i++;
  if (tokens[i] !== "run") {
    return { ok: false, error: `Expected "docker run", got "${tokens[i] ?? "(empty)"}"` };
  }
  i++;

  const svc: DockerService = {
    name: "", image: "", ports: [], volumes: [], environment: [],
    network: "", restart: "", detach: false, rm: false, tty: false,
    privileged: false, user: "", workdir: "", hostname: "", entrypoint: "",
    command: [], labels: [], capAdd: [], capDrop: [], memLimit: "", cpuShares: "",
  };

  while (i < tokens.length) {
    const tok = tokens[i];
    const rest = tokens.slice(i + 1);

    // Boolean flags
    if (tok === "-d" || tok === "--detach")    { svc.detach = true; i++; continue; }
    if (tok === "--rm")                        { svc.rm = true; i++; continue; }
    if (tok === "-t" || tok === "--tty")       { svc.tty = true; i++; continue; }
    if (tok === "--privileged")               { svc.privileged = true; i++; continue; }
    // Combined -it / -ti
    if (tok === "-it" || tok === "-ti")       { svc.tty = true; i++; continue; }

    // Value flags — long form
    const valueFlagMap: Array<[pattern: RegExp, setter: (v: string) => void]> = [
      [/^--name(?:=|$)/, (v) => { svc.name = v; }],
      [/^(?:-p|--publish)(?:=|$)/, (v) => { svc.ports.push(v); }],
      [/^(?:-v|--volume)(?:=|$)/, (v) => { svc.volumes.push(v); }],
      [/^(?:-e|--env)(?:=|$)/, (v) => { svc.environment.push(v); }],
      [/^--network(?:=|$)/, (v) => { svc.network = v; }],
      [/^--restart(?:=|$)/, (v) => { svc.restart = v; }],
      [/^(?:-u|--user)(?:=|$)/, (v) => { svc.user = v; }],
      [/^(?:-w|--workdir)(?:=|$)/, (v) => { svc.workdir = v; }],
      [/^(?:-h|--hostname)(?:=|$)/, (v) => { svc.hostname = v; }],
      [/^--entrypoint(?:=|$)/, (v) => { svc.entrypoint = v; }],
      [/^(?:-l|--label)(?:=|$)/, (v) => { svc.labels.push(v); }],
      [/^--cap-add(?:=|$)/, (v) => { svc.capAdd.push(v); }],
      [/^--cap-drop(?:=|$)/, (v) => { svc.capDrop.push(v); }],
      [/^(?:-m|--memory)(?:=|$)/, (v) => { svc.memLimit = v; }],
      [/^--cpu-shares(?:=|$)/, (v) => { svc.cpuShares = v; }],
    ];

    let matched = false;
    for (const [pattern, setter] of valueFlagMap) {
      if (pattern.test(tok)) {
        const [val, consumed] = extractValue(tok, tok.split("=")[0], rest);
        setter(val);
        i += 1 + consumed;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Unknown flag — skip (with its value if `--flag value` style)
    if (tok.startsWith("-")) {
      i++;
      // Skip next token if it doesn't look like a flag
      if (rest[0] && !rest[0].startsWith("-")) i++;
      continue;
    }

    // First non-flag token is the image
    svc.image = tok;
    i++;
    // Remaining tokens are the container command
    svc.command = tokens.slice(i);
    break;
  }

  if (!svc.image) {
    return { ok: false, error: "Could not find an image name in the command." };
  }

  return { ok: true, service: svc };
}

// ---------------------------------------------------------------------------
// YAML generator
// ---------------------------------------------------------------------------

function indent(level: number, text: string): string {
  return "  ".repeat(level) + text;
}

function generateCompose(svc: DockerService): string {
  const serviceName = svc.name || deriveServiceName(svc.image);
  const lines: string[] = [];

  lines.push(`version: "3.8"`);
  lines.push("");
  lines.push("services:");
  lines.push(indent(1, `${serviceName}:`));
  lines.push(indent(2, `image: ${svc.image}`));

  if (svc.hostname)   lines.push(indent(2, `hostname: ${svc.hostname}`));
  if (svc.restart)    lines.push(indent(2, `restart: ${svc.restart}`));
  if (svc.user)       lines.push(indent(2, `user: "${svc.user}"`));
  if (svc.workdir)    lines.push(indent(2, `working_dir: ${svc.workdir}`));
  if (svc.privileged) lines.push(indent(2, `privileged: true`));
  if (svc.tty)        lines.push(indent(2, `tty: true`));

  if (svc.entrypoint) {
    lines.push(indent(2, `entrypoint: ${svc.entrypoint}`));
  }

  if (svc.command.length > 0) {
    if (svc.command.length === 1) {
      lines.push(indent(2, `command: ${svc.command[0]}`));
    } else {
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
      // KEY=VALUE → key: value ; KEY alone → KEY: (unset marker)
      const eqIdx = e.indexOf("=");
      if (eqIdx === -1) {
        lines.push(indent(3, `${e}:`));
      } else {
        const key = e.slice(0, eqIdx);
        const val = e.slice(eqIdx + 1);
        // Quote values that contain special YAML chars
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

  if (svc.memLimit)  lines.push(indent(2, `mem_limit: ${svc.memLimit}`));
  if (svc.cpuShares) lines.push(indent(2, `cpu_shares: ${svc.cpuShares}`));

  // Network
  if (svc.network) {
    lines.push(indent(2, "networks:"));
    lines.push(indent(3, `- ${svc.network}`));
  }

  // Top-level named volumes
  const namedVolumes = svc.volumes
    .map((v) => v.split(":")[0])
    .filter((src) => src && !src.startsWith("/") && !src.startsWith("."));

  if (namedVolumes.length > 0) {
    lines.push("");
    lines.push("volumes:");
    namedVolumes.forEach((v) => {
      lines.push(indent(1, `${v}:`));
    });
  }

  // Top-level networks
  if (svc.network) {
    lines.push("");
    lines.push("networks:");
    lines.push(indent(1, `${svc.network}:`));
  }

  return lines.join("\n");
}

function deriveServiceName(image: string): string {
  // "nginx:latest" → "nginx", "registry.io/org/app:v1" → "app"
  return image.split("/").pop()?.split(":")[0] ?? "app";
}

// ---------------------------------------------------------------------------
// Sample
// ---------------------------------------------------------------------------

const SAMPLE = `docker run -d \\
  --name postgres-db \\
  -p 5432:5432 \\
  -e POSTGRES_USER=admin \\
  -e POSTGRES_PASSWORD=secret \\
  -e POSTGRES_DB=myapp \\
  -v pgdata:/var/lib/postgresql/data \\
  -v ./init.sql:/docker-entrypoint-initdb.d/init.sql \\
  --network app-network \\
  --restart unless-stopped \\
  postgres:16-alpine`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DockerToComposePage() {
  const [input, setInput] = useState(SAMPLE);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { yaml: "", error: null };

    const parsed = parseDockerRun(trimmed);
    if (!parsed.ok) return { yaml: "", error: parsed.error };

    return { yaml: generateCompose(parsed.service), error: null };
  }, [input]);

  return (
    <ToolLayout
      icon={Container}
      title="Docker to"
      highlight="Compose"
      description="Instantly convert complex docker run commands into clean docker-compose.yml files."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — input */}
        <div className="space-y-4">
          <TextAreaField
            label="docker run Command"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`docker run -d --name my-app -p 8080:80 nginx`}
            rows={16}
            action={
              <ClearButton onClick={() => setInput("")} disabled={!input} />
            }
          />
          {result.error && <ErrorAlert message={result.error} />}
        </div>

        {/* Right — output */}
        <TextAreaField
          label="docker-compose.yml"
          value={result.yaml}
          readOnly
          rows={20}
          placeholder="Generated compose file will appear here…"
          action={
            <CopyButton value={result.yaml} disabled={!result.yaml} />
          }
        />
      </div>

      {/* Supported flags reference */}
      <div className="mt-8 border-t pt-8">
        <h3 className="mb-4 text-sm font-semibold">Supported Flags</h3>
        <div className="grid gap-3 text-xs md:grid-cols-2 lg:grid-cols-3">
          {[
            ["--name", "container_name / service name"],
            ["-p / --publish", "ports"],
            ["-v / --volume", "volumes + named volume declarations"],
            ["-e / --env", "environment (KEY=VALUE or KEY)"],
            ["--network", "networks"],
            ["--restart", "restart policy"],
            ["-u / --user", "user"],
            ["-w / --workdir", "working_dir"],
            ["-h / --hostname", "hostname"],
            ["--entrypoint", "entrypoint"],
            ["-l / --label", "labels"],
            ["--cap-add / --cap-drop", "cap_add / cap_drop"],
            ["-m / --memory", "mem_limit"],
            ["--cpu-shares", "cpu_shares"],
            ["-d / --detach", "(noted, not in compose)"],
            ["--privileged", "privileged: true"],
            ["-t / --tty", "tty: true"],
          ].map(([flag, output]) => (
            <div key={flag} className="rounded-lg bg-muted/50 p-3">
              <p className="font-mono font-medium text-primary">{flag}</p>
              <p className="mt-0.5 text-muted-foreground">→ {output}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
