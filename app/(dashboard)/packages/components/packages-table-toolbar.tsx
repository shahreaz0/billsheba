"use client"

import type { Table } from "@tanstack/react-table"
import { Plus, X } from "lucide-react"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Button } from "@/components/ui/button"

import { usePackagesStore } from "@/stores/packages-store"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function PackagesTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { setPackageMutationType, setIsUpsertPackageDialogOpen } = usePackagesStore()

  return (
    <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-2">
      <div className="flex flex-1 items-center flex-wrap gap-2">
        {/* <Select defaultValue="name" onValueChange={setSearchField}>
          <SelectTrigger size="sm" className="w-full md:w-[120px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="speed_mbps">Speed</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="description">Description</SelectItem>
          </SelectContent>
        </Select> */}

        <DataTableSearch table={table} searchField="name" />

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
          setIsUpsertPackageDialogOpen(true)
          setPackageMutationType("add")
        }}
        size="sm"
        className="md:mr-2"
      >
        <Plus />
        Add Package
      </Button>

      <DataTableViewOptions table={table} />
    </div>
  )
}
