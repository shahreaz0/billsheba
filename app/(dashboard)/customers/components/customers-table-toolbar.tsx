"use client"

import type { Table } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Button } from "@/components/ui/button"

import { useCustomersStore } from "@/stores/customers-store"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function CustomersTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const { setCustomerMutationType, setIsUpsertCustomerDialogOpen } = useCustomersStore()

  return (
    <div className="flex gap-2 md:items-center md:justify-between flex-col md:flex-row">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <DataTableSearch
          table={table}
          searchField="username"
          placeholder="Search (name, username, phone)"
        />
      </div>

      <Button
        onClick={() => {
          setIsUpsertCustomerDialogOpen(true)
          setCustomerMutationType("add")
        }}
        size="sm"
        className="mr-2"
      >
        <Plus />
        Add Customer
      </Button>

      <DataTableViewOptions table={table} />
    </div>
  )
}
