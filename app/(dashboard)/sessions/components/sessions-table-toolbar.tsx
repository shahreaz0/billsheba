"use client"

import type { Table } from "@tanstack/react-table"
import { RefreshCw, X } from "lucide-react"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetActiveSessions } from "@/hooks/rq/use-sessions-query"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const serviceTypes = [
  {
    label: "PPPoE",
    value: "pppoe",
  },
  {
    label: "DHCP",
    value: "dhcp",
  },
  {
    label: "Static",
    value: "static",
  },
]

export function SessionsTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const { refetch, isFetching, data } = useGetActiveSessions()
  const totalSessions = data?.sessions?.length || 0

  return (
    <div className="flex gap-2 md:items-center md:justify-between flex-col md:flex-row">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        {/* <Select defaultValue="name" onValueChange={setSearchField}>
          <SelectTrigger size="sm" className="w-full md:w-[120px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Username</SelectItem>
            <SelectItem value="address">IP Address</SelectItem>
            <SelectItem value="caller-id">MAC Address</SelectItem>
          </SelectContent>
        </Select> */}

        <DataTableSearch table={table} searchField="name" />

        {table.getColumn("service") && (
          <DataTableFacetedFilter
            column={table.getColumn("service")}
            title="Service"
            options={serviceTypes}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isFetching ? (
          <Skeleton className="h-7 w-32 rounded-md" />
        ) : (
          <Badge className="rounded-md px-3">
            <span className="font-semibold">{totalSessions}</span> Active{" "}
            {totalSessions === 1 ? "Session" : "Sessions"}
          </Badge>
        )}
        <Button
          onClick={() => refetch()}
          size="sm"
          variant="outline"
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>

        {/* <DataTableViewOptions table={table} /> */}
      </div>
    </div>
  )
}
