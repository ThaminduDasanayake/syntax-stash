"use client";

import { BookMarked, Box, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { resourceCategories } from "@/lib/resources-data";
import { internalTools } from "@/lib/tools-data";
import { slugify } from "@/lib/utils";

const AppSidebar = () => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const categorySlug = (cat: string) => `/category/${slugify(cat)}`;

  // Memoize the tool grouping so it only calculates once on mount
  const groupedTools = useMemo(() => {
    const grouped = internalTools.reduce(
      (acc, tool) => {
        if (!acc[tool.category]) {
          acc[tool.category] = [];
        }
        acc[tool.category].push(tool);
        return acc;
      },
      {} as Record<string, typeof internalTools>,
    );

    return Object.entries(grouped);
  }, []);

  return (
    <Sidebar>
      {/* Branding */}
      <SidebarHeader className="border-sidebar-border border-b p-4">
        <div>
          <Link
            href="/"
            onClick={() => setOpenMobile(false)}
            className="text-sidebar-foreground block text-left font-mono text-base font-semibold tracking-tight"
          >
            syntax<span className="text-primary">-</span>stash
          </Link>
          <p className="text-muted-foreground mt-0.5 text-[11px]">Developer swiss army knife</p>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="space-y-6 px-2 py-4">
        {/* Home */}
        <SidebarGroup className="p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/"}
                className="h-9 cursor-pointer"
                render={<Link href={"/"} onClick={() => setOpenMobile(false)} />}
              >
                <Home className="text-foreground/80" />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {groupedTools.map(([category, tools]) => (
          <SidebarGroup key={category} className="p-0 pb-4">
            <SidebarGroupLabel className="text-muted-foreground mb-2 flex h-auto items-center gap-1.5 px-2 text-[10px] font-semibold tracking-wider uppercase">
              {category}
            </SidebarGroupLabel>
            <SidebarMenu>
              {tools.map((tool) => {
                const Icon = tool.icon || Box;
                return (
                  <SidebarMenuItem key={tool.url}>
                    <SidebarMenuButton
                      isActive={pathname === tool.url}
                      className="h-9 cursor-pointer"
                      render={<Link href={tool.url} onClick={() => setOpenMobile(false)} />}
                    >
                      <Icon className="text-primary" />
                      <span>{tool.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}

        {/* Divider */}
        <div className="border-sidebar-border mx-4 border-t" />

        {/* Section 2: Resource Stash */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-muted-foreground mb-2 flex h-auto items-center gap-1.5 px-2 text-[10px] font-semibold tracking-wider uppercase">
            <BookMarked size={11} className="text-secondary" />
            Resource Stash
          </SidebarGroupLabel>
          <SidebarMenu>
            {resourceCategories.map((cat) => {
              const href = categorySlug(cat);
              return (
                <SidebarMenuItem key={cat}>
                  <SidebarMenuButton
                    isActive={pathname === href}
                    className="group flex h-9 cursor-pointer justify-between"
                    render={<Link href={href} onClick={() => setOpenMobile(false)} />}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="truncate">{cat}</span>
                      <ChevronRight
                        size={12}
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
                      />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-sidebar-border border-t p-3">
        <p className="text-muted-foreground text-center font-mono text-[10px]">
          syntax-stash · handmade
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
