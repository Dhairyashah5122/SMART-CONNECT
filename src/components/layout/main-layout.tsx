"use client"

import * as React from "react"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  BarChart2,
  Briefcase,
  ClipboardList,
  GitMerge,
  PieChart,
  Users,
  Settings,
  UserCircle,
  Shield,
} from "lucide-react"
import { Logo } from "@/components/icons/logo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function AppHeader({ pageTitle }: { pageTitle: string }) {
  const { isMobile } = useSidebar();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      {isMobile && <SidebarTrigger />}
      <h1 className="text-lg font-semibold md:text-xl">{pageTitle}</h1>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircle className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </div>
    </header>
  )
}

function MainSidebarContent() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { href: "/", icon: BarChart2, label: "Dashboard", tooltip: "Dashboard" },
    { href: "/surveys", icon: ClipboardList, label: "Surveys", tooltip: "Surveys" },
    { href: "/students", icon: Users, label: "Students", tooltip: "Students" },
    { href: "/projects", icon: Briefcase, label: "Talent Matching", tooltip: "Talent Matching" },
    { href: "/analysis", icon: GitMerge, label: "Comparative Analysis", tooltip: "Analysis" },
    { href: "/reports", icon: PieChart, label: "Reporting", tooltip: "Reporting" },
    { href: "/admin/dashboard", icon: Shield, label: "Admin", tooltip: "Admin" },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-8 text-primary" />
          <span className="text-lg font-semibold">SynergyScope</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.tooltip}>
                  <Link href={item.href}>
                    <>
                      <item.icon />
                      <span>{item.label}</span>
                    </>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-2">
               <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/40x40" alt="@shadcn" />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 text-xs">
                <div className="font-medium">SynergyScope</div>
                <div className="text-muted-foreground">admin@synergy.com</div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

const pageTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/surveys': 'Survey Administration',
  '/students': 'Student Roster',
  '/projects': 'Talent Matching',
  '/analysis': 'Comparative Analysis',
  '/reports': 'Reporting',
  '/admin/dashboard': 'Admin Dashboard',
  '/mentor/dashboard': 'Mentor Dashboard',
  '/student/dashboard': 'Student Dashboard',
};

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || 'SynergyScope';

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <MainSidebarContent />
      </Sidebar>
      <SidebarInset className="flex flex-col bg-background">
        <AppHeader pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
