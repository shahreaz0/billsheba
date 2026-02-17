"use client"

import {
  CreditCard,
  LayoutDashboard,
  Package2,
  Settings2,
  User as UserIcon,
  Users as UsersIcon,
  Wifi,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: UsersIcon },
  { href: "/packages", label: "Packages", icon: Package2 },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/users", label: "Users", icon: UserIcon },
  { href: "/sessions", label: "Sessions", icon: Wifi },
  { href: "/settings", label: "Settings", icon: Settings2 },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-50 block md:hidden"
    >
      <div className="mx-auto max-w-screen-lg px-safe w-full">
        <div className="backdrop-blur-sm bg-card/80 border-t border-border flex justify-between items-center px-4 py-2 rounded-t-lg">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground",
                  pathname === item.href && "text-primary outline-none",
                )}
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="h-5 w-5" aria-hidden={true}>
                  <title>{item.label}</title>
                </Icon>
                <span className="sr-only">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
