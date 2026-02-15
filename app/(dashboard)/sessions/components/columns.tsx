"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { cn, formatUptime } from "@/lib/utils"
import type { Session } from "@/types/sessions"

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => `${row.name} ${row.address} ${row["caller-id"]}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.name}</div>
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => <DataTableColumnHeader column={column} title="IP Address" />,
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.original.address}</div>
    },
  },
  {
    accessorKey: "caller-id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="MAC Address" />,
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.original["caller-id"]}</div>
    },
  },
  {
    accessorKey: "service",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Service" />,
    cell: ({ row }) => {
      return (
        <Badge
          variant="secondary"
          className={cn(
            row.original.service === "pppoe"
              ? "bg-blue-500 text-white dark:bg-blue-600"
              : "bg-gray-500 text-white dark:bg-gray-600",
          )}
        >
          {row.original.service.toUpperCase()}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "uptime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Uptime" />,
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          <div>{formatUptime(row.original.uptime)}</div>{" "}
        </div>
      )
    },
  },
  {
    accessorKey: "session-id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Session ID" />,
    cell: ({ row }) => {
      return (
        <div className="font-mono text-xs text-slate-500">
          {row.original["session-id"]}
        </div>
      )
    },
  },
]
