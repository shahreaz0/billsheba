"use client"

import type { Table } from "@tanstack/react-table"
import { Plus, X } from "lucide-react"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { usePaymentsStore } from "@/stores/payments-store"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  collectors: { label: string; value: string }[]
}

export function PaymentsTableToolbar<TData>({
  table,
  collectors,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { setPaymentMutationType, setIsUpsertPaymentDialogOpen } = usePaymentsStore()

  return (
    <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-2">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <DataTableSearch table={table} searchField="customer" />

        {table.getColumn("entry_by") && (
          <DataTableFacetedFilter
            column={table.getColumn("entry_by")}
            title="Collected By"
            options={collectors}
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
          setIsUpsertPaymentDialogOpen(true)
          setPaymentMutationType("add")
        }}
        size="sm"
        className="md:mr-2"
      >
        <Plus />
        Add Payment
      </Button>

      <DataTableViewOptions table={table} />
    </div>
  )
}
