"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import type { Package } from "@/types/packages"
import { PackagesTableRowActions } from "./packages-table-row-actions"

export const columns: ColumnDef<Package>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => {
      return `${row.name} ${row.speed_mbps} ${row.price} ${row.description}`
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div className="w-[80px]">{row.original.name}</div>,
  },
  {
    accessorKey: "speed_mbps",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Speed (mbps)" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("speed_mbps")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price (BDT)" />,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
  },

  {
    id: "actions",
    cell: ({ row }) => <PackagesTableRowActions row={row} />,
  },
]
