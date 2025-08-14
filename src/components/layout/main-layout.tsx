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
  Users,
  Settings,
  UserCircle,
} from "lucide-react"
import { Logo } from "@/components/icons/logo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

function AppHeader({ pageTitle }: { pageTitle: string }) {
  const { isMobile } = useSidebar();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      {isMobile && <SidebarTrigger />}
      <div className="flex items-center gap-2">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Logo className="size-6" />
                <span className="font-semibold">AI-Powered Capstone Dashboard</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

    </header>
  )
}

function MainSidebarContent() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || (pathname.startsWith(path) && path !== '/');

  const menuItems = [
    { href: "/", icon: BarChart2, label: "Dashboard", tooltip: "Dashboard" },
    { href: "/projects", icon: Briefcase, label: "Projects", tooltip: "Projects" },
    { href: "/students", icon: Users, label: "Students", tooltip: "Students" },
    { href: "/users", icon: Users, label: "Users", tooltip: "Users" },
  ];

  return (
    <>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.tooltip}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
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
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

const pageTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/surveys': 'Survey Administration',
  '/students': 'Student Roster',
  '/projects': 'Projects',
  '/talent-matching': 'Talent Matching',
  '/analysis': 'Comparative Analysis',
  '/reports': 'Reporting',
  '/admin/dashboard': 'Admin Dashboard',
  '/mentor/dashboard': 'Mentor Dashboard',
  '/student/dashboard': 'Student Dashboard',
  '/companies': 'Company Management',
};

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || 'SynergyScope';

  if (pathname === '/login') {
    return <>{children}</>
  }

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

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
    )
}
