"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { generateAvatarUrl, getInitials } from "@/lib/utils"
import type { User } from "@/types/users"
import { genders, kinds } from "../data/data"
import { UsersTableRowActions } from "./users-table-row-actions"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "first_name",
    accessorFn: (row) => {
      const fullName = `${row.first_name || ""} ${row.last_name || ""}`
      return `${fullName} ${row.email} ${row.phone} ${row.gender} ${row.kind}`
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const fullName = `${row.original.first_name || ""} (${row.original.last_name || ""})`

      return (
        <div className="flex space-x-2 items-center">
          <Avatar className="rounded-md">
            <AvatarImage src={generateAvatarUrl(fullName)} />
            <AvatarFallback className="text-xs font-light">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="max-w-[500px] truncate font-medium">{fullName}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => {
      return (
        <div>
          <div className="max-w-[500px] truncate font-medium">{row.original.phone}</div>
          <div className="max-w-[500px] truncate text-xs text-slate-500">
            {row.original.email}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
    cell: ({ row }) => {
      const status = genders.find((gender) => gender.value === row.getValue("gender"))

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
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
    accessorKey: "kind",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kind" />,
    cell: ({ row }) => {
      const status = kinds.find((kind) => kind.value === row.getValue("kind"))

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
    id: "actions",
    cell: ({ row }) => <UsersTableRowActions row={row} />,
  },
]
