"use client";

import { Check, Container, Copy, Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

import { SERVICE_TEMPLATES } from "./templates";

type Port = { host: string; container: string };
type EnvVar = { key: string; value: string };
type Volume = { host: string; container: string };

type Service = {
  id: string;
  templateId: string;
  name: string;
  image: string;
  ports: Port[];
  env: EnvVar[];
  volumes: Volume[];
};

function makeService(templateId: string): Service {
  const tpl = SERVICE_TEMPLATES.find((t) => t.id === templateId) ?? SERVICE_TEMPLATES[0];
  return {
    id: crypto.randomUUID(),
    templateId: tpl.id,
    name: tpl.id,
    image: tpl.image,
    ports: tpl.defaultPorts.map((p) => ({ ...p })),
    env: tpl.defaultEnv.map((e) => ({ ...e })),
    volumes: tpl.defaultVolumes.map((v) => ({ ...v })),
  };
}

function buildYaml(services: Service[]): string {
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

export default function DockerComposePage() {
  const [services, setServices] = useState<Service[]>([makeService("postgres")]);
  const [selectedTemplate, setSelectedTemplate] = useState("node");
  const { copied, copy } = useCopyToClipboard();

  const yaml = useMemo(() => buildYaml(services), [services]);

  // Port validation — check for duplicate host ports
  const usedHostPorts = services.flatMap((s) =>
    s.ports.filter((p) => p.host).map((p) => p.host),
  );
  const duplicatePorts = usedHostPorts.filter(
    (p, i) => usedHostPorts.indexOf(p) !== i,
  );

  function addService() {
    setServices((prev) => [...prev, makeService(selectedTemplate)]);
  }

  function removeService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  function updateService<K extends keyof Service>(id: string, field: K, value: Service[K]) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  }

  // ── Port helpers
  function addPort(svcId: string) {
    const svc = services.find((s) => s.id === svcId)!;
    updateService(svcId, "ports", [...svc.ports, { host: "", container: "" }]);
  }
  function removePort(svcId: string, idx: number) {
    const svc = services.find((s) => s.id === svcId)!;
    updateService(svcId, "ports", svc.ports.filter((_, i) => i !== idx));
  }
  function updatePort(svcId: string, idx: number, field: keyof Port, val: string) {
    const svc = services.find((s) => s.id === svcId)!;
    updateService(
      svcId,
      "ports",
      svc.ports.map((p, i) => (i === idx ? { ...p, [field]: val } : p)),
    );
  }

  // ── Env helpers
  function addEnv(svcId: string) {
    const svc = services.find((s) => s.id === svcId)!;
    updateService(svcId, "env", [...svc.env, { key: "", value: "" }]);
  }
  function removeEnv(svcId: string, idx: number) {
    const svc = services.find((s) => s.id === svcId)!;
    updateService(svcId, "env", svc.env.filter((_, i) => i !== idx));
  }
  function updateEnv(svcId: string, idx: number, field: keyof EnvVar, val: string) {
    const svc = services.find((s) => s.id === svcId)!;
    updateService(
      svcId,
      "env",
      svc.env.map((e, i) => (i === idx ? { ...e, [field]: val } : e)),
    );
  }

  // ── Volume helpers
  function addVolume(svcId: string) {
    const svc = services.find((s) => s.id === svcId)!;
    updateService(svcId, "volumes", [...svc.volumes, { host: "", container: "" }]);
  }
  function removeVolume(svcId: string, idx: number) {
    const svc = services.find((s) => s.id === svcId)!;
    updateService(svcId, "volumes", svc.volumes.filter((_, i) => i !== idx));
  }
  function updateVolume(svcId: string, idx: number, field: keyof Volume, val: string) {
    const svc = services.find((s) => s.id === svcId)!;
    updateService(
      svcId,
      "volumes",
      svc.volumes.map((v, i) => (i === idx ? { ...v, [field]: val } : v)),
    );
  }

  return (
    <ToolLayout
      icon={Container}
      title="Docker Compose"
      highlight="Builder"
      description="Add services from templates, configure ports, environment variables, and volumes. Generates a docker-compose.yml file instantly."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Service editor */}
        <div className="space-y-6">
          {/* Add service */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Add Service
            </Label>
            <div className="flex gap-2">
              <Select value={selectedTemplate} onValueChange={(v) => v && setSelectedTemplate(v)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TEMPLATES.map((tpl) => (
                    <SelectItem key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addService} className="shrink-0 rounded-full font-semibold">
                <Plus size={14} /> Add
              </Button>
            </div>
          </div>

          {/* Duplicate port warning */}
          {duplicatePorts.length > 0 && (
            <div className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 rounded-lg border px-4 py-3 text-xs">
              Duplicate host ports detected: {duplicatePorts.join(", ")}. This will cause a conflict.
            </div>
          )}

          {/* Service cards */}
          {services.length === 0 ? (
            <div className="border-border text-muted-foreground rounded-xl border border-dashed py-12 text-center text-sm">
              No services yet. Add one above.
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((svc) => (
                <Card key={svc.id}>
                  <CardContent className="space-y-4">
                    {/* Name + image */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-foreground text-sm font-semibold capitalize">{svc.name}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeService(svc.id)}
                        className="shrink-0 rounded-full text-xs"
                      >
                        <Trash2 size={12} /> Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Service Name</Label>
                        <Input
                          value={svc.name}
                          onChange={(e) => updateService(svc.id, "name", e.target.value)}
                          placeholder="service-name"
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Image</Label>
                        <Input
                          value={svc.image}
                          onChange={(e) => updateService(svc.id, "image", e.target.value)}
                          placeholder="image:tag"
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* Ports */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Ports</Label>
                        <button
                          onClick={() => addPort(svc.id)}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                        >
                          <Plus size={11} /> Add
                        </button>
                      </div>
                      {svc.ports.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            value={p.host}
                            onChange={(e) => updatePort(svc.id, idx, "host", e.target.value)}
                            placeholder="host"
                            className="font-mono text-xs"
                          />
                          <span className="text-muted-foreground text-xs">:</span>
                          <Input
                            value={p.container}
                            onChange={(e) => updatePort(svc.id, idx, "container", e.target.value)}
                            placeholder="container"
                            className="font-mono text-xs"
                          />
                          <button
                            onClick={() => removePort(svc.id, idx)}
                            className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Environment */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Environment</Label>
                        <button
                          onClick={() => addEnv(svc.id)}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                        >
                          <Plus size={11} /> Add
                        </button>
                      </div>
                      {svc.env.map((e, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            value={e.key}
                            onChange={(ev) => updateEnv(svc.id, idx, "key", ev.target.value)}
                            placeholder="KEY"
                            className="font-mono text-xs"
                          />
                          <span className="text-muted-foreground text-xs">=</span>
                          <Input
                            value={e.value}
                            onChange={(ev) => updateEnv(svc.id, idx, "value", ev.target.value)}
                            placeholder="value"
                            className="font-mono text-xs"
                          />
                          <button
                            onClick={() => removeEnv(svc.id, idx)}
                            className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Volumes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Volumes</Label>
                        <button
                          onClick={() => addVolume(svc.id)}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                        >
                          <Plus size={11} /> Add
                        </button>
                      </div>
                      {svc.volumes.map((v, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            value={v.host}
                            onChange={(e) => updateVolume(svc.id, idx, "host", e.target.value)}
                            placeholder="./local or named"
                            className="font-mono text-xs"
                          />
                          <span className="text-muted-foreground text-xs">:</span>
                          <Input
                            value={v.container}
                            onChange={(e) => updateVolume(svc.id, idx, "container", e.target.value)}
                            placeholder="/container/path"
                            className="font-mono text-xs"
                          />
                          <button
                            onClick={() => removeVolume(svc.id, idx)}
                            className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right — YAML output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              docker-compose.yml
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(yaml)}
              className="rounded-full font-semibold"
            >
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
            </Button>
          </div>
          <Textarea
            readOnly
            value={yaml}
            rows={30}
            className="font-mono text-xs"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
