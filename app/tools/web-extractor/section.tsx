import { CaretDownIcon } from "@phosphor-icons/react";
import { ReactNode, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SectionProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Section({ title, count, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="mx-auto w-full">
      <CardContent className="p-2.5">
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="data-[state=open]:bg-muted/50 rounded-md"
        >
          <CollapsibleTrigger className="w-full">
            <Button variant="ghost" className="group w-full justify-between px-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{title}</span>
                {count !== undefined && (
                  <Badge variant="secondary" className="font-mono text-xs">
                    {count}
                  </Badge>
                )}
              </div>
              <CaretDownIcon className="transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          {/* Constrained height for long lists */}
          <CollapsibleContent className="p-3 pt-2">
            <div className="custom-scrollbar max-h-87.5 overflow-y-auto pr-2">{children}</div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
