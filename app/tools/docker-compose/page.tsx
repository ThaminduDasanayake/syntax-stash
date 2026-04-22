"use client";

import { Container, Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  buildYaml,
  generateCompose,
  makeService,
  parseDockerRun,
} from "@/app/tools/docker-compose/helpers";
import { EnvVar, Port, Service, TabType, Volume } from "@/app/tools/docker-compose/types";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";

import { SERVICE_TEMPLATES } from "./templates";

const CLI_SAMPLE = `docker run -d \\
  --name postgres-db \\
  -p 5432:5432 \\
  -e POSTGRES_USER=admin \\
  -e POSTGRES_PASSWORD=secret \\
  -e POSTGRES_DB=myapp \\
  -v pgdata:/var/lib/postgresql/data \\
  --network app-network \\
  --restart unless-stopped \\
  postgres:16-alpine`;

export default function DockerComposePage() {
  const [activeTab, setActiveTab] = useState<TabType>("builder");

  // Builder State
  const [services, setServices] = useState<Service[]>([makeService("postgres")]);
  const [selectedTemplate, setSelectedTemplate] = useState("node");

  // CLI State
  const [cliInput, setCliInput] = useState(CLI_SAMPLE);

  // Memos
  const builderYaml = useMemo(() => buildYaml(services), [services]);

  const cliResult = useMemo(() => {
    const trimmed = cliInput.trim();
    if (!trimmed) return { yaml: "", error: null };

    const parsed = parseDockerRun(trimmed);
    if (!parsed.ok) return { yaml: "", error: parsed.error };

    return { yaml: generateCompose(parsed.service), error: null };
  }, [cliInput]);

  const currentYaml = activeTab === "builder" ? builderYaml : cliResult.yaml;

  // Builder Helpers
  const usedHostPorts = services.flatMap((s) => s.ports.filter((p) => p.host).map((p) => p.host));
  const duplicatePorts = usedHostPorts.filter((p, i) => usedHostPorts.indexOf(p) !== i);

  function addService() {
    setServices((prev) => [...prev, makeService(selectedTemplate)]);
  }
  function removeService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }
  function updateService<K extends keyof Service>(id: string, field: K, value: Service[K]) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function addPort(svcId: string) {
    updateService(svcId, "ports", [
      ...services.find((s) => s.id === svcId)!.ports,
      { host: "", container: "" },
    ]);
  }
  function removePort(svcId: string, idx: number) {
    updateService(
      svcId,
      "ports",
      services.find((s) => s.id === svcId)!.ports.filter((_, i) => i !== idx),
    );
  }
  function updatePort(svcId: string, idx: number, field: keyof Port, val: string) {
    updateService(
      svcId,
      "ports",
      services
        .find((s) => s.id === svcId)!
        .ports.map((p, i) => (i === idx ? { ...p, [field]: val } : p)),
    );
  }

  function addEnv(svcId: string) {
    updateService(svcId, "env", [
      ...services.find((s) => s.id === svcId)!.env,
      { key: "", value: "" },
    ]);
  }
  function removeEnv(svcId: string, idx: number) {
    updateService(
      svcId,
      "env",
      services.find((s) => s.id === svcId)!.env.filter((_, i) => i !== idx),
    );
  }
  function updateEnv(svcId: string, idx: number, field: keyof EnvVar, val: string) {
    updateService(
      svcId,
      "env",
      services
        .find((s) => s.id === svcId)!
        .env.map((e, i) => (i === idx ? { ...e, [field]: val } : e)),
    );
  }

  function addVolume(svcId: string) {
    updateService(svcId, "volumes", [
      ...services.find((s) => s.id === svcId)!.volumes,
      { host: "", container: "" },
    ]);
  }
  function removeVolume(svcId: string, idx: number) {
    updateService(
      svcId,
      "volumes",
      services.find((s) => s.id === svcId)!.volumes.filter((_, i) => i !== idx),
    );
  }
  function updateVolume(svcId: string, idx: number, field: keyof Volume, val: string) {
    updateService(
      svcId,
      "volumes",
      services
        .find((s) => s.id === svcId)!
        .volumes.map((v, i) => (i === idx ? { ...v, [field]: val } : v)),
    );
  }

  return (
    <ToolLayout
      icon={Container}
      title="Docker Compose"
      highlight="Studio"
      description="Build compose files visually or convert complex 'docker run' commands into YAML instantly."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Mode Switcher & Inputs */}
        <div className="flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabType)}
            className="flex w-full flex-col"
          >
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="builder" className="tab-trigger">
                Visual Builder
              </TabsTrigger>
              <TabsTrigger value="cli" className="tab-trigger">
                Docker Run Parser
              </TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="mt-0 space-y-6">
              {/* Add service */}
              <div className="space-y-2">
                <Label>Add Service</Label>
                <div className="flex gap-2">
                  <SelectField
                    value={selectedTemplate}
                    onValueChange={(v) => v && setSelectedTemplate(v)}
                    options={SERVICE_TEMPLATES.map((tpl) => ({ value: tpl.id, label: tpl.name }))}
                  />
                  <Button onClick={addService} className="font-semibold">
                    <Plus className="mr-1 size-4" /> Add
                  </Button>
                </div>
              </div>

              {/* Duplicate port warning */}
              {duplicatePorts.length > 0 && (
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-400">
                  Duplicate host ports detected: {duplicatePorts.join(", ")}. This will cause a
                  conflict.
                </div>
              )}

              {/* Service cards */}
              {services.length === 0 ? (
                <div className="border-border text-muted-foreground rounded-xl border border-dashed py-12 text-center text-sm">
                  No services yet. Add one above.
                </div>
              ) : (
                <div className="max-h-200 space-y-4 overflow-y-auto pr-2">
                  {services.map((svc) => (
                    <Card key={svc.id}>
                      <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-foreground text-sm font-semibold capitalize">
                            {svc.name}
                          </p>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeService(svc.id)}
                          >
                            <Trash2 /> Remove
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <InputField
                            label="Service Name"
                            labelClassName="text-xs"
                            value={svc.name}
                            onChange={(e) => updateService(svc.id, "name", e.target.value)}
                            placeholder="service-name"
                          />
                          <InputField
                            label="Image"
                            labelClassName="text-xs"
                            value={svc.image}
                            onChange={(e) => updateService(svc.id, "image", e.target.value)}
                            placeholder="image:tag"
                          />
                        </div>

                        {/* Ports */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Ports</Label>
                            <Button size="sm" variant="ghost" onClick={() => addPort(svc.id)}>
                              <Plus /> Add
                            </Button>
                          </div>
                          {svc.ports.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <InputField
                                value={p.host}
                                onChange={(e) => updatePort(svc.id, idx, "host", e.target.value)}
                                placeholder="host"
                              />
                              <span className="text-xs">:</span>
                              <InputField
                                value={p.container}
                                onChange={(e) =>
                                  updatePort(svc.id, idx, "container", e.target.value)
                                }
                                placeholder="container"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removePort(svc.id, idx)}
                              >
                                <Minus />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Environment */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Environment</Label>
                            <Button size="sm" variant="ghost" onClick={() => addEnv(svc.id)}>
                              <Plus /> Add
                            </Button>
                          </div>
                          {svc.env.map((e, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <InputField
                                value={e.key}
                                onChange={(ev) => updateEnv(svc.id, idx, "key", ev.target.value)}
                                placeholder="KEY"
                              />
                              <span className="text-xs">=</span>
                              <InputField
                                value={e.value}
                                onChange={(ev) => updateEnv(svc.id, idx, "value", ev.target.value)}
                                placeholder="value"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeEnv(svc.id, idx)}
                              >
                                <Minus />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Volumes */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Volumes</Label>
                            <Button size="sm" variant="ghost" onClick={() => addVolume(svc.id)}>
                              <Plus /> Add
                            </Button>
                          </div>
                          {svc.volumes.map((v, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <InputField
                                value={v.host}
                                onChange={(e) => updateVolume(svc.id, idx, "host", e.target.value)}
                                placeholder="./local or named"
                              />
                              <span className="text-xs">:</span>
                              <InputField
                                value={v.container}
                                onChange={(e) =>
                                  updateVolume(svc.id, idx, "container", e.target.value)
                                }
                                placeholder="/container/path"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeVolume(svc.id, idx)}
                              >
                                <Minus />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cli" className="mt-0 space-y-4">
              <TextAreaField
                label="Docker Run Command"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder={`docker run -d --name my-app -p 8080:80 nginx`}
                rows={16}
                action={<ClearButton onClick={() => setCliInput("")} disabled={!cliInput} />}
              />
              {cliResult.error && <ErrorAlert message={cliResult.error} />}

              <div className="border-border bg-card rounded-xl border p-4">
                <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                  Supported Flags Mapping
                </h3>
                <div className="grid gap-2 text-xs sm:grid-cols-2">
                  {[
                    ["--name", "container_name"],
                    ["-p / --publish", "ports"],
                    ["-v / --volume", "volumes"],
                    ["-e / --env", "environment"],
                    ["--network", "networks"],
                    ["--restart", "restart"],
                    ["-u / -w / -h", "user / dir / host"],
                    ["--entrypoint", "entrypoint"],
                    ["-l / --label", "labels"],
                    ["--cap-add / drop", "cap_add / drop"],
                    ["-m / --memory", "mem_limit"],
                    ["--cpu-shares", "cpu_shares"],
                    ["-d / -t / --priv", "tty / privileged"],
                  ].map(([flag, output]) => (
                    <div
                      key={flag}
                      className="bg-muted/50 flex flex-col justify-center rounded p-2"
                    >
                      <span className="text-primary font-mono font-medium">{flag}</span>
                      <span className="text-muted-foreground mt-0.5 text-[10px] tracking-wider uppercase">
                        → {output}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* YAML output */}
        <div className="h-full">
          <TextAreaField
            label="docker-compose.yml"
            readOnly
            value={currentYaml}
            rows={35}
            placeholder={
              activeTab === "builder"
                ? "Add a service to generate YAML..."
                : "Generated compose file will appear here…"
            }
            action={<CopyButton value={currentYaml} disabled={!currentYaml || !!cliResult.error} />}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
