"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Book,
  ChevronsUpDown,
  ClipboardClock,
  LayoutGrid,
  List,
  Shield,
  UserPen,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { UserProfile } from "@/types/profile/userProfile";
import { ApiResponse } from "@/types/common/apiResponse";
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutGrid,
  },
];
const itemsSetting = [
  {
    title: "Profile",
    url: "/profile",
    icon: UserPen,
  },
  {
    title:"Security",
    url:"/profile/security",
    icon:Shield,
  }
];
const itemsQuiz = [
  {
    title: "Subtests",
    url: "/subtests",
    icon: List,
  },
  {
    title: "Results",
    url: "/quiz/history",
    icon: ClipboardClock,
  },
];

export function AppSidebar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const getUser = async () => {
    try {
      const res = await fetch("/api/profile");
      const json: ApiResponse<UserProfile> = await res.json();
      setUser(json.data);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg p-2 bg-blue-600 text-white flex items-center justify-center font-bold">
            <Book />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Quiz App</span>
            <span className="text-xs text-muted-foreground">
              Learning Platform
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Quiz</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsQuiz.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsSetting.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold shrink-0">
              {user?.name?.[0] ?? "U"}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {user?.name ?? "User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email ?? "-"}
              </span>
            </div>
          </div>
          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {" "}
                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>signOut()}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
