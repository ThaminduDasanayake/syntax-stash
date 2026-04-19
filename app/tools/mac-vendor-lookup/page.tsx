"use client";

import { Wifi } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { TextAreaField } from "@/components/ui/textarea-field";
import { ErrorAlert } from "@/components/error-alert";

interface OUIEntry {
  oui: string;
  vendor: string;
}

const OUI_DICTIONARY: OUIEntry[] = [
  { oui: "00:00:0C", vendor: "Cisco" },
  { oui: "00:13:10", vendor: "Cisco Systems" },
  { oui: "00:14:6C", vendor: "Cisco Systems" },
  { oui: "00:15:63", vendor: "Cisco Systems" },
  { oui: "00:1A:92", vendor: "Apple Inc." },
  { oui: "00:1E:C2", vendor: "Apple Inc." },
  { oui: "00:22:55", vendor: "Apple Inc." },
  { oui: "00:25:86", vendor: "Apple Inc." },
  { oui: "00:50:F2", vendor: "Microsoft Corporation" },
  { oui: "00:0A:95", vendor: "Intel Corporation" },
  { oui: "00:1B:21", vendor: "Intel Corporation" },
  { oui: "00:A0:C9", vendor: "Intel Corporation" },
  { oui: "00:1E:E5", vendor: "Hewlett-Packard" },
  { oui: "00:1F:3A", vendor: "Ubiquiti Networks" },
  { oui: "00:25:B3", vendor: "Cisco Meraki" },
  { oui: "00:30:48", vendor: "Supermicro Computer" },
  { oui: "00:48:54", vendor: "Hewlett-Packard" },
  { oui: "00:90:27", vendor: "HP ProCurve" },
  { oui: "08:00:27", vendor: "VirtualBox" },
  { oui: "08:ED:B7", vendor: "Google LLC" },
  { oui: "0C:54:15", vendor: "Motorola Solutions" },
  { oui: "18:31:BF", vendor: "Samsung Electronics" },
  { oui: "34:36:3B", vendor: "Intel Corporation" },
  { oui: "3C:37:86", vendor: "Apple Inc." },
  { oui: "44:2A:60", vendor: "Apple Inc." },
  { oui: "54:26:96", vendor: "Apple Inc." },
  { oui: "5C:CF:7F", vendor: "Apple Inc." },
  { oui: "6C:40:08", vendor: "ASUS" },
  { oui: "78:4F:43", vendor: "Huawei Technologies" },
  { oui: "7C:7A:91", vendor: "Apple Inc." },
  { oui: "88:71:00", vendor: "Apple Inc." },
  { oui: "8A:6D:08", vendor: "Raspberry Pi Foundation" },
  { oui: "B8:27:EB", vendor: "Raspberry Pi Foundation" },
  { oui: "BC:92:6B", vendor: "Apple Inc." },
  { oui: "C8:69:CD", vendor: "Apple Inc." },
  { oui: "D4:6E:0E", vendor: "Apple Inc." },
  { oui: "D8:A0:E1", vendor: "Apple Inc." },
  { oui: "DC:37:14", vendor: "Cisco Systems" },
  { oui: "E4:F4:C6", vendor: "Apple Inc." },
  { oui: "E8:9D:87", vendor: "Apple Inc." },
  { oui: "EC:22:80", vendor: "Apple Inc." },
  { oui: "F0:D1:A9", vendor: "Apple Inc." },
  { oui: "F4:5C:89", vendor: "Apple Inc." },
];

interface MACLookupResult {
  normalized: string;
  oui: string;
  vendor: string | null;
  error: string | null;
}

export default function MACVendorLookupPage() {
  const [input, setInput] = useState("00:1A:92:00:00:01");

  const result = useMemo<MACLookupResult>(() => {
    const trimmed = input.trim();

    if (!trimmed) {
      return {
        normalized: "",
        oui: "",
        vendor: null,
        error: null,
      };
    }

    // MAC address regex: accepts XX:XX:XX:XX:XX:XX, XX-XX-XX-XX-XX-XX, or XXXXXXXXXXXX
    const macRegex = /^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$/;

    if (!macRegex.test(trimmed)) {
      return {
        normalized: "",
        oui: "",
        vendor: null,
        error: "Invalid MAC address format. Use XX:XX:XX:XX:XX:XX, XX-XX-XX-XX-XX-XX, or XXXXXXXXXXXX",
      };
    }

    // Normalize to colon format
    const cleaned = trimmed.replace(/[-]/g, ":");
    const normalized = cleaned.match(/[0-9A-Fa-f]{2}/g)?.join(":").toUpperCase() || "";

    if (normalized.length !== 17) {
      return {
        normalized: "",
        oui: "",
        vendor: null,
        error: "MAC address must be 6 bytes (48 bits)",
      };
    }

    // Extract OUI (first 3 bytes)
    const oui = normalized.substring(0, 8).toUpperCase();

    // Look up vendor
    const ouiEntry = OUI_DICTIONARY.find(
      (entry) => entry.oui.toUpperCase() === oui,
    );

    return {
      normalized,
      oui,
      vendor: ouiEntry?.vendor || null,
      error: null,
    };
  }, [input]);

  return (
    <ToolLayout
      icon={Wifi}
      title="MAC Address"
      highlight="Vendor Lookup"
      description="Look up MAC address vendors by OUI. Accepts colons, dashes, or plain text formats."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Input */}
        <TextAreaField
          label="MAC Address Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter MAC address (e.g., 00:1A:92:00:00:01 or 00-1A-92-00-00-01)"
          rows={6}
          action={
            <ClearButton
              onClick={() => setInput("")}
              disabled={!input}
            />
          }
        />

        {/* Right: Output */}
        <div className="space-y-4">
          {result.error && <ErrorAlert message={result.error} />}

          {result.normalized && !result.error && (
            <>
              <InputField
                label="Normalized MAC Address"
                value={result.normalized}
                readOnly
              />

              <InputField
                label="OUI (Organizationally Unique Identifier)"
                value={result.oui}
                readOnly
              />

              <InputField
                label="Vendor Name"
                value={result.vendor || "Unknown (OUI not in dictionary)"}
                readOnly
                className={result.vendor ? "" : "text-muted-foreground"}
              />

              {result.vendor && (
                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                  <p className="text-xs font-medium text-green-700 dark:text-green-400">
                    ✓ Vendor found in OUI database
                  </p>
                </div>
              )}
            </>
          )}

          {!input.trim() && !result.error && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                Enter a MAC address to see the normalized format, OUI, and vendor name.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* OUI Dictionary Reference */}
      <div className="mt-12 border-t pt-8">
        <h3 className="mb-4 text-sm font-semibold">OUI Dictionary Reference</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {OUI_DICTIONARY.map((entry) => (
            <div
              key={entry.oui}
              className="rounded-lg border bg-card p-3 text-sm"
            >
              <div className="font-mono font-semibold">{entry.oui}</div>
              <div className="text-xs text-muted-foreground">{entry.vendor}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
