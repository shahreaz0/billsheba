"use client"

import type { Table } from "@tanstack/react-table"
import { Plus, X } from "lucide-react"
import * as React from "react"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useOrganizationsStore } from "@/stores/organizations-store"
import { organizationStatus } from "../data/data"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function OrganizationsTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { setOrganizationMutationType, setIsUpsertOrganizationDialogOpen } =
    useOrganizationsStore()
  const [searchField, setSearchField] = React.useState("name")

  return (
    <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-2">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <Select defaultValue="name" onValueChange={setSearchField}>
          <SelectTrigger size="sm" className="w-full md:w-[105px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="address">Address</SelectItem>
          </SelectContent>
        </Select>

        <DataTableSearch table={table} searchField={searchField} />

        {table.getColumn("subscription_status") && (
          <DataTableFacetedFilter
            column={table.getColumn("subscription_status")}
            title="Status"
            options={organizationStatus}
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

      <Button
        onClick={() => {
          setIsUpsertOrganizationDialogOpen(true)
          setOrganizationMutationType("add")
        }}
        size="sm"
        className="mr-2 hidden"
      >
        <Plus />
        Add Organization
      </Button>

      <DataTableViewOptions table={table} />
    </div>
  )
}
