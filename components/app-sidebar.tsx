"use client";

import { BookMarked, Box, ChevronRight, Folder, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import logo from "@/app/logo.svg";
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
    <Sidebar collapsible="icon">
      {/* Branding */}
      <SidebarHeader className="border-sidebar-border border-b transition-all duration-300 ease-in-out">
        <Link
          href="/"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-2 overflow-hidden p-3 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-3"
        >
          <Image
            src={logo}
            unoptimized
            className="h-10 w-10 max-w-none shrink-0"
            alt="syntax-stash"
          />
          <div className="sidebar-text-collapse grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-mono text-base font-semibold tracking-tight">
              syntax<span className="text-primary">-</span>stash
            </span>
            <span className="text-muted-foreground truncate text-[11px]">
              Developer swiss army knife
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="space-y-6 px-2 py-4">
        {/* Home */}
        <SidebarGroup className="p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Home"
                isActive={pathname === "/"}
                className="h-9 cursor-pointer"
                render={<Link href={"/"} onClick={() => setOpenMobile(false)} />}
              >
                <Home className="text-primary" />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {groupedTools.map(([category, tools]) => (
          <SidebarGroup key={category} className="p-0 pb-4">
            <SidebarGroupLabel className="text-muted-foreground mb-2 flex h-auto items-center gap-1.5 px-2 text-[10px] font-semibold tracking-wider uppercase">
              <span className="sidebar-text-collapse">{category}</span>
            </SidebarGroupLabel>
            <SidebarMenu>
              {tools.map((tool) => {
                const Icon = tool.icon || Box;
                return (
                  <SidebarMenuItem key={tool.url}>
                    <SidebarMenuButton
                      tooltip={tool.title}
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

        {/*  Resource Stash */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-muted-foreground mb-2 flex h-auto items-center gap-1.5 px-2 text-[10px] font-semibold tracking-wider uppercase">
            <BookMarked className="text-secondary shrink-0" />
            <span className="sidebar-text-collapse">Resource Stash</span>
          </SidebarGroupLabel>
          <SidebarMenu>
            {resourceCategories.map((cat) => {
              const href = categorySlug(cat);
              return (
                <SidebarMenuItem key={cat}>
                  <SidebarMenuButton
                    tooltip={cat}
                    isActive={pathname === href}
                    className="group flex h-9 cursor-pointer justify-between"
                    render={<Link href={href} onClick={() => setOpenMobile(false)} />}
                  >
                    <Folder className="text-muted-foreground shrink-0" />

                    <div className="sidebar-text-collapse flex w-full items-center justify-between">
                      <span className="truncate">{cat}</span>
                      <ChevronRight className="shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
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
