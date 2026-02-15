"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { BadgeCheckIcon, BadgeXIcon, Globe, Mail, Phone } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn, generateAvatarUrl, getInitials } from "@/lib/utils"
import type { Organization } from "@/types/organizations"
import { OrganizationsTableRowActions } from "./organizations-table-row-actions"

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Organization" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 items-center">
          <Avatar className="rounded-md">
            <AvatarImage
              src={row.original.logo || generateAvatarUrl(row.original.name)}
            />
            <AvatarFallback className="text-xs font-light">
              {getInitials(row.original.name)}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="max-w-[500px] truncate font-medium">{row.original.name}</div>
            <div className="max-w-[500px] truncate text-xs text-slate-500">
              {row.original.address}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Phone className="h-3 w-3 text-slate-500" />
            <span className="text-xs">{row.original.phone}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="h-3 w-3 text-slate-500" />
            <span className="text-xs">{row.original.email}</span>
          </div>
          {row.original.website && (
            <div className="flex items-center space-x-1">
              <Globe className="h-3 w-3 text-slate-500" />
              <span className="text-xs">{row.original.website}</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "customers",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customers" />,
    cell: ({ row }) => {
      return (
        <div>
          <div className="max-w-[500px] truncate font-medium">
            {row.original.total_customer} / {row.original.allowed_customer}
          </div>
          <div className="max-w-[500px] truncate text-xs text-slate-500">
            {Math.round(
              (row.original.total_customer / row.original.allowed_customer) * 100,
            )}
            % capacity
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "subscription_status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.subscription_status
      const statusConfig = {
        ACTIVE: {
          variant: "default" as const,
          className: "bg-emerald-500 text-white dark:bg-emerald-600",
          icon: BadgeCheckIcon,
          label: "Active",
        },
        EXPIRED: {
          variant: "destructive" as const,
          className: "bg-red-500 text-white dark:bg-red-600",
          icon: BadgeXIcon,
          label: "Expired",
        },
        CANCELLED: {
          variant: "secondary" as const,
          className: "bg-gray-500 text-white dark:bg-gray-600",
          icon: BadgeXIcon,
          label: "Cancelled",
        },
        PENDING: {
          variant: "outline" as const,
          className: "bg-yellow-500 text-white dark:bg-yellow-600",
          icon: BadgeCheckIcon,
          label: "Pending",
        },
      }

      const config = statusConfig[status] || statusConfig.PENDING
      const Icon = config.icon

      return (
        <Badge variant={config.variant} className={cn(config.className)}>
          <Icon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "billing_cycle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Billing Cycle" />
    ),
  },
  {
    accessorKey: "subscription_end_date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expires" />,
    cell: ({ row }) => {
      const endDate = row.original.subscription_end_date
      if (!endDate) return <span className="text-slate-500">-</span>

      const date = new Date(endDate)
      const now = new Date()
      const isExpired = date < now

      return (
        <div className={cn("text-sm", isExpired ? "text-red-500" : "text-slate-700")}>
          {format(date, "PP")}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: OrganizationsTableRowActions,
  },
]
