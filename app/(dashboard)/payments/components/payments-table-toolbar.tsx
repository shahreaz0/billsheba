"use client"

import type { Table } from "@tanstack/react-table"
import { Plus, X } from "lucide-react"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { Button } from "@/components/ui/button"
import { usePaymentsStore } from "@/stores/payments-store"
import { PaymentsStats } from "./payments-stats"
import { PaymentsStatusTabs } from "./payments-status-tabs"

type DataTableToolbarProps<TData> = {
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
    <div className="space-y-4 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PaymentsStatusTabs />

        <div className="flex w-full md:w-auto items-center justify-between flex-col md:flex-row gap-4 md:gap-2">
          <div className="flex flex-1 items-center gap-2 flex-wrap min-w-0">
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
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <PaymentsStats table={table} />

        <Button
          onClick={() => {
            setIsUpsertPaymentDialogOpen(true)
            setPaymentMutationType("add")
          }}
          size="sm"
          className="shrink-0 md:ml-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>
    </div>
  )
}
