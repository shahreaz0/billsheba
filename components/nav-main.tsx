"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  CreditCard,
  LayoutDashboard,
  Package2,
  Settings2,
  User,
  Users,
  Wifi,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/hooks/rq/use-auth-query"
import { getCustomerListOptions } from "@/hooks/rq/use-customers-query"
import { getDashboardDataOptions } from "@/hooks/rq/use-dashboard-query"
import { getPackageListOptions } from "@/hooks/rq/use-packages-query"
import { getPaymentListOptions } from "@/hooks/rq/use-payment-query"
import { getSessionsOptions } from "@/hooks/rq/use-sessions-query"
import { getUserListOptions } from "@/hooks/rq/use-users-query"
import { usePaymentsStore } from "@/stores/payments-store"
import { Skeleton } from "./ui/skeleton"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    prefetchOptions: getDashboardDataOptions,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
    prefetchOptions: getCustomerListOptions,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
    prefetchOptions: getPaymentListOptions,
  },
  {
    title: "Sessions",
    url: "/sessions",
    icon: Wifi,
    prefetchOptions: getSessionsOptions,
  },

  {
    title: "Packages",
    url: "/packages",
    icon: Package2,
    prefetchOptions: getPackageListOptions,
  },
  {
    title: "Users",
    url: "/users",
    icon: User,
    prefetchOptions: getUserListOptions,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings2,
  },
]

function NavListSkeleton() {
  return (
    <div>
      {Array.from({ length: 7 }).map((_list, i) => (
        <Skeleton key={i} className="m-1 h-8" />
      ))}
    </div>
  )
}

export function NavMain() {
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { paymentFilters } = usePaymentsStore()

  const { data: session } = useSession()

  if (!session) {
    return <NavListSkeleton />
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navMain
          .filter((list) => {
            if (session.kind !== "ADMIN" && list.url === "/users") return false

            return true
          })
          .map((item) => (
            <SidebarMenuItem
              key={item.title}
              onMouseEnter={() => {
                if (item.prefetchOptions) {
                  queryClient.prefetchQuery(item.prefetchOptions(paymentFilters) as any)
                }
              }}
            >
              <Link href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={pathname === item.url}
                  className="cursor-pointer"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
