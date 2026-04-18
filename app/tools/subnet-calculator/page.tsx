"use client";

import { Network } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SubnetResult = {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  totalHosts: number;
  usableHosts: number;
  firstHost: string;
  lastHost: string;
  cidr: number;
};

function ipToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) | parseInt(octet, 10), 0) >>> 0;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

function parseSubnet(input: string): SubnetResult | null {
  const [ipPart, cidrPart] = input.trim().split("/");
  const cidr = parseInt(cidrPart, 10);

  if (!ipPart || isNaN(cidr) || cidr < 0 || cidr > 32) return null;

  const octets = ipPart.split(".");
  if (octets.length !== 4 || octets.some((o) => isNaN(Number(o)) || Number(o) > 255)) return null;

  const ipInt = ipToInt(ipPart);
  const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? totalHosts : Math.max(0, totalHosts - 2);
  const firstHost = cidr >= 31 ? intToIp(networkInt) : intToIp(networkInt + 1);
  const lastHost = cidr >= 31 ? intToIp(broadcastInt) : intToIp(broadcastInt - 1);

  return {
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    subnetMask: intToIp(maskInt),
    totalHosts,
    usableHosts,
    firstHost,
    lastHost,
    cidr,
  };
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border flex items-center justify-between rounded-lg border p-3">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-foreground font-mono text-sm font-medium">{value}</span>
    </div>
  );
}

export default function SubnetCalculatorPage() {
  const [input, setInput] = useState("192.168.1.0/24");

  const result = useMemo(() => parseSubnet(input), [input]);

  return (
    <ToolLayout
      icon={Network}
      title={
        <>
          Subnet <span className="text-primary">/</span> CIDR Calculator
        </>
      }
      description="Calculate network address, broadcast, subnet mask, and host ranges from any CIDR notation."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Input */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>CIDR Notation</Label>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="192.168.1.0/24"
              className="font-mono"
            />
            <p className="text-muted-foreground text-xs">
              Enter an IP address with CIDR prefix, e.g.{" "}
              <code className="text-primary">10.0.0.0/8</code>
            </p>
          </div>

          {!result && input.trim() && (
            <p className="text-destructive font-mono text-sm">
              Invalid CIDR — use format: 192.168.1.0/24
            </p>
          )}

          {result && (
            <Card>
              <CardContent>
                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  Summary
                </p>
                <p className="text-primary font-mono text-2xl font-bold">/{result.cidr}</p>
                <p className="text-muted-foreground mt-1 font-mono text-sm">
                  {result.totalHosts.toLocaleString()} total · {result.usableHosts.toLocaleString()}{" "}
                  usable hosts
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — Results */}
        <div className="space-y-3">
          {result ? (
            <>
              <StatRow label="Network Address" value={result.networkAddress} />
              <StatRow label="Broadcast Address" value={result.broadcastAddress} />
              <StatRow label="Subnet Mask" value={result.subnetMask} />
              <StatRow label="First Usable Host" value={result.firstHost} />
              <StatRow label="Last Usable Host" value={result.lastHost} />
              <StatRow label="Total Hosts" value={result.totalHosts.toLocaleString()} />
              <StatRow label="Usable Hosts" value={result.usableHosts.toLocaleString()} />
            </>
          ) : (
            <div className="border-border flex min-h-60 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">
                Enter a valid CIDR to see subnet details.
              </p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
