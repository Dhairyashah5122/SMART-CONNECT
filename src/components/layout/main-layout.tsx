"use client"
import * as React from "react"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  SidebarProvider,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  Sidebar,
} from "@/components/ui/sidebar"
import {
  BarChart2,
  Briefcase,
  Users,
  Settings,
  Building,
  GraduationCap,
  FileText,
  User,
  Shield,
  LayoutDashboard,
  LogOut,
  Star,
  BookOpen,
  Database,
} from "lucide-react"
import { Logo } from "@/components/icons/logo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"

function AppHeader() {
  const { isMobile } = useSidebar();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
    })
    logout();
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {isMobile && <SidebarTrigger />}
       <div className="relative flex-1 md:grow-0">
        <h1 className="text-lg font-semibold">SMART CONNECTION</h1>
      </div>
      <div className="flex-1" />
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
               <AvatarImage src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.email}`} data-ai-hint="person" />
              <AvatarFallback>
                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {user?.role} Account
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile"><User className="mr-2 h-4 w-4"/>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings"><Settings className="mr-2 h-4 w-4"/>Settings</Link>
            </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4"/>Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

function MainSidebarContent() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isActive = (path: string) => pathname === path || (pathname.startsWith(path) && path !== '/');

  const mainMenuItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/analysis", icon: BarChart2, label: "Analysis" },
    { href: "/data-mining", icon: Database, label: "Data Mining" },
    { href: "/projects", icon: Briefcase, label: "Projects" },
    { href: "/courses", icon: BookOpen, label: "Courses" },
    { href: "/students", icon: GraduationCap, label: "Students" },
    { href: "/mentors", icon: User, label: "Mentors" },
    { href: "/companies", icon: Building, label: "Companies" },
    { href: "/surveys", icon: FileText, label: "Surveys" },
    { href: "/talent-matching", icon: Users, label: "Talent Matching" },
    { href: "/reports", icon: BarChart2, label: "Reports" },
    { href: "/showcase", icon: Star, label: "Showcase" },
  ];
  
  const adminMenuItems = [
    { href: "/admin/users", icon: Users, label: "User Management" },
    { href: "/admin/dashboard", icon: Shield, label: "Admin Dashboard" },
  ];

  const secondaryMenuItems = [
    { href: "/mentor/dashboard", icon: User, label: "Mentor" },
    { href: "/student/dashboard", icon: GraduationCap, label: "Student" },
  ];

  return (
    <>
      <SidebarHeader className="border-b">
         <div className="flex h-14 items-center gap-2 px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6" />
              <span>SMART CONNECTION</span>
            </Link>
          </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
            <SidebarMenuButton asChild className="w-full justify-start text-left h-auto py-2">
                <div>
                    <p className="font-semibold">Smart Capstone</p>
                    <p className="text-xs text-muted-foreground">Innovate Inc.</p>
                </div>
            </SidebarMenuButton>
        </SidebarMenu>
        <Separator className="my-2" />
        <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">Navigation</p>
        <SidebarMenu>
          {mainMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        {/* Admin Section - Only show if user is admin */}
        {user?.role === 'admin' && (
          <>
            <Separator className="my-2" />
            <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">Administration</p>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}
        
        <Separator className="my-2" />
         <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">Dashboards</p>
         <SidebarMenu>
          {secondaryMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Separator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton asChild isActive={isActive('/settings')} tooltip="Settings">
                <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Sidebar variant="sidebar" collapsible="icon">
                <MainSidebarContent />
            </Sidebar>
            <SidebarInset className="flex flex-col bg-muted/40">
                <AppHeader />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/login', '/nda', '/signup', '/forgot-password', '/unauthorized'];

  if (noLayoutRoutes.includes(pathname)) {
      return <>{children}</>;
  }

  return <LayoutWithSidebar>{children}</LayoutWithSidebar>;
}
