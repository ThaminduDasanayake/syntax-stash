"use client";

import {
  CaretRightIcon,
  FolderIcon,
  FolderOpenIcon,
  HouseIcon,
  ToolboxIcon,
} from "@phosphor-icons/react";
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
import { iconMap } from "@/lib/icons";
import { resourceCategories } from "@/lib/resource-data";
import { internalTools } from "@/lib/tools-data";
import { slugify } from "@/lib/utils";

const AppSidebar = () => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const categorySlug = (cat: string) => `/resources/${slugify(cat)}`;
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
    <Sidebar collapsible="icon" className="border-border border-r-2!">
      {/* Branding */}
      <SidebarHeader className="border-sidebar-border border-b-2 transition-all duration-300 ease-in-out">
        <Link
          href="/"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-3 overflow-hidden p-3 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-3"
        >
          <div className="bg-muted flex shrink-0 items-center justify-center p-0.5">
            <Image src={logo} unoptimized className="h-7 w-7" alt="syntax-stash" />
          </div>
          <div className="sidebar-text-collapse grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-mono text-lg font-bold tracking-tighter uppercase">
              syntax<span className="text-primary">_</span>stash
            </span>
            <span className="text-muted-foreground truncate text-xs">
              Developer swiss army knife
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="space-y-6 px-4 py-6">
        {/* Home */}
        <SidebarGroup className="p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Home"
                isActive={pathname === "/"}
                className="data-[active=true]:bg-primary hover:bg-muted h-10 cursor-pointer rounded-none font-mono text-sm tracking-wide group-data-[collapsible=icon]:justify-center data-[active=true]:text-black"
              >
                <Link href={"/"} onClick={() => setOpenMobile(false)}>
                  <HouseIcon className="size-5! shrink-0" weight="bold" />
                  <span className="font-bold uppercase group-data-[collapsible=icon]:hidden">
                    Main Dashboard
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {groupedTools.map(([category, tools]) => (
          <SidebarGroup key={category} className="p-0 pb-4">
            <SidebarGroupLabel className="text-muted-foreground mb-3 flex h-auto items-center gap-1.5 px-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
              <span className="sidebar-text-collapse">
                {"//"} {category}
              </span>
            </SidebarGroupLabel>

            <SidebarMenu>
              {tools.map((tool) => {
                const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;
                const href = `/tools/${tool.slug}`;
                return (
                  <SidebarMenuItem key={tool.slug}>
                    <SidebarMenuButton
                      asChild
                      tooltip={tool.title}
                      isActive={pathname === href}
                      className="data-[active=true]:border-primary data-[active=true]:bg-muted data-[active=true]:text-primary hover:bg-muted h-9 cursor-pointer rounded-none font-mono text-xs tracking-wide group-data-[collapsible=icon]:justify-center data-[active=true]:border-l-4"
                    >
                      <Link href={href} onClick={() => setOpenMobile(false)}>
                        <Icon className="size-5! shrink-0 opacity-70" />
                        <span className="group-data-[collapsible=icon]:hidden">{tool.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}

        {/* Divider */}
        <div className="border-sidebar-border mx-2 border-t-2 border-dashed opacity-50" />

        {/*  Resource Stash */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-muted-foreground mb-3 flex h-auto items-center gap-1.5 px-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
            <span className="sidebar-text-collapse">{"//"} RESOURCE STASH</span>
          </SidebarGroupLabel>
          <SidebarMenu>
            {resourceCategories.map((cat) => {
              const href = categorySlug(cat);
              const isActive = pathname === href;

              return (
                <SidebarMenuItem key={cat}>
                  <SidebarMenuButton
                    asChild
                    tooltip={cat}
                    isActive={isActive}
                    className="group data-[active=true]:bg-primary hover:bg-muted flex h-9 cursor-pointer justify-between rounded-none font-mono text-xs tracking-wide group-data-[collapsible=icon]:justify-center data-[active=true]:text-black"
                  >
                    <Link href={href} onClick={() => setOpenMobile(false)}>
                      {isActive ? (
                        <FolderOpenIcon weight="duotone" className="size-5! shrink-0" />
                      ) : (
                        <FolderIcon weight="duotone" className="size-5! shrink-0 opacity-70" />
                      )}

                      <div className="sidebar-text-collapse flex w-full items-center justify-between group-data-[collapsible=icon]:hidden">
                        <span className="truncate uppercase">{cat}</span>
                        <CaretRightIcon
                          className={`shrink-0 transition-transform duration-200 ${
                            isActive ? "rotate-90" : "rotate-0"
                          }`}
                        />
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="sidebar-text-collapse bg-muted/50 border-t-2 p-4">
        <p className="text-muted-foreground text-center font-mono text-[10px] font-bold tracking-widest uppercase">
          V1.0.0 // ONLINE
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
