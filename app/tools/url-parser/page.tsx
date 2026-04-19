"use client";

import { Link, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { TextAreaField } from "@/components/ui/textarea-field";
import { ErrorAlert } from "@/components/error-alert";

interface ParsedURL {
  protocol: string;
  host: string;
  path: string;
  port: string;
  queryParams: Record<string, string>;
}

export default function URLParserPage() {
  const [input, setInput] = useState("https://example.com/path?key1=value1&key2=value2");
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  const parsed = useMemo<ParsedURL | null>(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    try {
      const url = new URL(trimmed);
      const params: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      setQueryParams(params);
      setError("");

      return {
        protocol: url.protocol.replace(":", ""),
        host: url.hostname,
        path: url.pathname || "/",
        port: url.port || "",
        queryParams: params,
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid URL");
      return null;
    }
  }, [input]);

  const rebuiltURL = useMemo<string>(() => {
    if (!parsed) return "";

    const { protocol, host, path, port, queryParams: originalParams } = parsed;
    const baseURL = `${protocol}://${host}${port ? `:${port}` : ""}${path}`;

    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (key && value !== undefined) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    return queryString ? `${baseURL}?${queryString}` : baseURL;
  }, [parsed, queryParams]);

  const handleQueryParamChange = (key: string, value: string, newKey?: string) => {
    const updated = { ...queryParams };
    if (newKey && newKey !== key) {
      delete updated[key];
      updated[newKey] = value;
    } else {
      updated[key] = value;
    }
    setQueryParams(updated);
  };

  const handleAddQueryParam = () => {
    const newKey = `param${Object.keys(queryParams).length + 1}`;
    setQueryParams({ ...queryParams, [newKey]: "" });
  };

  const handleRemoveQueryParam = (key: string) => {
    const updated = { ...queryParams };
    delete updated[key];
    setQueryParams(updated);
  };

  return (
    <ToolLayout
      icon={Link}
      title="URL"
      highlight="Parser & Builder"
      description="Parse, analyze, and rebuild URLs with editable query parameters."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Input */}
        <TextAreaField
          label="URL Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a complete URL here..."
          rows={6}
          action={
            <ClearButton
              onClick={() => setInput("")}
              disabled={!input}
            />
          }
        />

        {/* Right: Output and Analysis */}
        <div className="space-y-4">
          {error && <ErrorAlert message={error} />}

          {parsed && (
            <>
              <InputField
                label="Protocol"
                value={parsed.protocol}
                readOnly
              />
              <InputField
                label="Host"
                value={parsed.host}
                readOnly
              />
              <InputField
                label="Path"
                value={parsed.path}
                readOnly
              />
              <InputField
                label="Port"
                value={parsed.port}
                readOnly
                placeholder="(default)"
              />
            </>
          )}
        </div>
      </div>

      {/* Query Parameters Section */}
      {parsed && (
        <div className="mt-8 border-t pt-8">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Query Parameters</h3>
          </div>

          <div className="space-y-3">
            {Object.entries(queryParams).length === 0 ? (
              <p className="text-sm text-muted-foreground">No query parameters</p>
            ) : (
              Object.entries(queryParams).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <InputField
                    placeholder="Parameter name"
                    value={key}
                    onChange={(e) => handleQueryParamChange(key, value, e.target.value)}
                    className="flex-1"
                    containerClassName=""
                  />
                  <InputField
                    placeholder="Parameter value"
                    value={value}
                    onChange={(e) => handleQueryParamChange(key, e.target.value)}
                    className="flex-1"
                    containerClassName=""
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQueryParam(key)}
                    className="mt-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddQueryParam}
            className="mt-4"
          >
            + Add Parameter
          </Button>
        </div>
      )}

      {/* Rebuilt URL Output */}
      {parsed && rebuiltURL && (
        <div className="mt-8 border-t pt-8">
          <TextAreaField
            label="Rebuilt URL"
            value={rebuiltURL}
            readOnly
            rows={3}
            action={
              <CopyButton
                value={rebuiltURL}
                disabled={!rebuiltURL}
              />
            }
          />
        </div>
      )}
    </ToolLayout>
  );
}
