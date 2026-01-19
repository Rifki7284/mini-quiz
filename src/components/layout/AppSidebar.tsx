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
import { UserProfile } from "@/types/profile/userProfile";
import { ApiResponse } from "@/types/common/apiResponse";
import { usePathname, useRouter } from "next/navigation";

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
    title: "Security",
    url: "/profile/security",
    icon: Shield,
  },
];

const itemsQuiz = [
  {
    title: "History",
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
  const router = useRouter();
  const pathname = usePathname();
  const Logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#E95B0F] text-white flex items-center justify-center">
            <Book className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#E95B0F]">
              Quiz App
            </span>
            <span className="text-xs text-[#012F61] font-medium">
              Learning Platform
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#012F61] font-semibold text-xs uppercase tracking-wide px-3 mb-2">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${pathname.trim() == item.url ? "bg-[#E95B0F]/10 text-[#E95B0F] hover:bg-[#E95B0F]/10 hover:text-[#E95B0F] data-[active=true]:bg-[#E95B0F] data-[active=true]:text-white transition-colors" : ""}`}
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[#012F61] font-semibold text-xs uppercase tracking-wide px-3 mb-2">
            Quiz
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsQuiz.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${pathname.trim() == item.url ? "bg-[#E95B0F]/10 text-[#E95B0F] hover:bg-[#E95B0F]/10 hover:text-[#E95B0F] data-[active=true]:bg-[#E95B0F] data-[active=true]:text-white transition-colors" : ""}`}
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[#012F61] font-semibold text-xs uppercase tracking-wide px-3 mb-2">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsSetting.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                 className={`${pathname.trim() == item.url ? "bg-[#E95B0F]/10 text-[#E95B0F] hover:bg-[#E95B0F]/10 hover:text-[#E95B0F] data-[active=true]:bg-[#E95B0F] data-[active=true]:text-white transition-colors" : ""}`}
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-9 w-9 rounded-full bg-[#E95B0F] flex items-center justify-center text-sm font-semibold text-white shrink-0">
              {user?.name?.[0] ?? "U"}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-[#012F61] truncate">
                {user?.name ?? "User"}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user?.email ?? "-"}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 hover:bg-[#E95B0F]/10 hover:border-[#E95B0F] hover:text-[#E95B0F]"
                >
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel className="text-[#012F61]">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={Logout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
