import { TagIcon } from "@phosphor-icons/react";
import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  icon = <TagIcon weight="duotone" size={22} className="text-muted-foreground" />,
  title,
  description,
}: {
  icon?: ReactNode | null;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex h-32 flex-col items-center justify-center">
        <div className="bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-full">
          {icon}
        </div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}
