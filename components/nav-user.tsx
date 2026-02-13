"use client"

import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSession } from "@/hooks/rq/use-auth-query"
import { logout } from "@/lib/auth-utils"
import { generateAvatarUrl } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton"

export function UserInfoSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded-lg" />

      <div className="grid flex-1 text-left text-sm leading-tight">
        <Skeleton className="h-4 w-[120px]" /> 
        <Skeleton className="h-3 w-[180px]" /> 
      </div>
    </div>
  )
}

export function NavUser() {
  const { isMobile } = useSidebar()

  const { data: session } = useSession()

  const name = `${session?.first_name || ""} ${session?.last_name || ""}`

  function logoutHandler() {
    logout()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {session ? (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={generateAvatarUrl(name)} alt={session?.email} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs">{session?.email}</span>
                  </div>
                </>
              ) : (
                <UserInfoSkeleton />
              )}

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={generateAvatarUrl(name)} alt={name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs">{session?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href="/profile">
                <DropdownMenuItem>
                  <BadgeCheck />
                  Profile
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutHandler}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
