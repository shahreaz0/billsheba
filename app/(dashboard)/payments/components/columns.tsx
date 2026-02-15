"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CircleCheckIcon, CircleXIcon } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn, generateAvatarUrl, getInitials } from "@/lib/utils"
import type { Payment } from "@/types/payments"
import { paymentMethods } from "../data/data"
import { PaymentsTableRowActions } from "./payments-table-row-actions"

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "customer",
    accessorFn: (row) =>
      `${row.customer.username} ${row.customer.name} ${row.customer.phone}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 items-center">
          <Avatar className="rounded-md">
            <AvatarImage src={generateAvatarUrl(row.original.customer.name)} />
            <AvatarFallback className="text-xs font-light">
              {getInitials(row.original.customer.name)}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="max-w-[500px] truncate font-medium">
              {row.original.customer.name}
            </div>
            <div className="max-w-[500px] truncate text-xs text-slate-500">
              {row.original.customer.phone}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "entry_by",
    accessorFn: (row) => {
      const { first_name, last_name, phone } = row.entry_by || {}

      const name =
        first_name || last_name ? `${first_name || ""} ${last_name || ""}` : "None"

      return `${name} ${phone}`
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Collected By" />
    ),
    cell: ({ row }) => {
      const { first_name, last_name, phone } = row.original.entry_by || {}

      const name =
        first_name || last_name ? `${first_name || ""} ${last_name || ""}` : "None"

      return (
        <div className="flex space-x-2 items-center">
          <Avatar className="rounded-md">
            <AvatarImage src={generateAvatarUrl(name)} />
            <AvatarFallback className="text-xs font-light">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="max-w-[500px] truncate font-medium">{name}</div>
            <div className="max-w-[500px] truncate text-xs text-slate-500">{phone}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "billing_month",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bill Amount (BDT)" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <div className="max-w-[500px] truncate font-medium">
            {row.original.bill_amount}
          </div>
          <div className="max-w-[500px] truncate text-xs text-slate-500">
            {row.original.billing_month}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "payment_method",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
    cell: ({ row }) => {
      const status = paymentMethods.find(
        (method) => method.value === row.getValue("payment_method"),
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex items-center">
          {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <p>{status.label}</p>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "amount",
    // accessorFn: (row) => `${row.entry_by?.first_name} ${row.entry_by?.last_name}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount (BDT)" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <div className="max-w-[500px] truncate font-medium">{row.original.amount}</div>
          {/* <div className="max-w-[500px] truncate text-xs text-slate-500">
            {row.original.billing_month}
          </div> */}
        </div>
      )
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return (
        <Badge
          variant="secondary"
          className={cn(
            row.original.paid
              ? "bg-emerald-500 text-white dark:bg-emerald-600"
              : "bg-red-500 text-white dark:bg-red-600",
          )}
        >
          {row.original.paid ? (
            <>
              <CircleCheckIcon /> Paid
            </>
          ) : (
            <>
              <CircleXIcon /> Unpaid
            </>
          )}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const isActive = row.getValue(id) ? "true" : "false"

      return value.includes(isActive)
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <PaymentsTableRowActions row={row} />,
  },
]
