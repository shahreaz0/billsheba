"use client"

import type { Table } from "@tanstack/react-table"
import { format } from "date-fns"
import { Download, Plus, X } from "lucide-react"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { exportTableToCSV } from "@/lib/export-csv"
import { usePaymentsStore } from "@/stores/payments-store"
import type { Payment } from "@/types/payments"
import { PaymentsStats } from "./payments-stats"
import { PaymentsStatusTabs } from "./payments-status-tabs"

type DataTableToolbarProps = {
  table: Table<Payment>
  collectors: { label: string; value: string }[]
}

export function PaymentsTableToolbar({ table, collectors }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0

  const {
    setPaymentMutationType,
    setIsUpsertPaymentDialogOpen,
    paymentFilters,
    setPaymentFilters,
  } = usePaymentsStore()

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PaymentsStatusTabs />

        <div className="flex items-center gap-2 w-full md:w-auto">
          <DataTableSearch
            table={table}
            searchField="customer"
            className="flex-1 md:w-[200px]"
          />

          <DateRangePicker
            date={{
              from: paymentFilters.start_date
                ? new Date(paymentFilters.start_date)
                : undefined,
              to: paymentFilters.end_date ? new Date(paymentFilters.end_date) : undefined,
            }}
            onDateChange={(date) => {
              setPaymentFilters((prev) => ({
                ...prev,
                start_date: date?.from ? format(date.from, "yyyy-MM-dd") : "",
                end_date: date?.to ? format(date.to, "yyyy-MM-dd") : "",
              }))
            }}
          />

          {table.getColumn("entry_by") && (
            <DataTableFacetedFilter
              column={table.getColumn("entry_by")}
              title="Collected By"
              options={collectors}
            />
          )}

          {(isFiltered || paymentFilters.start_date || paymentFilters.end_date) && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters()
                setPaymentFilters((prev) => ({
                  ...prev,
                  start_date: "",
                  end_date: "",
                }))
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <PaymentsStats table={table} />

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex flex-1 md:flex-none bg-white"
            onClick={() => exportTableToCSV(table, "payments-export.csv")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => {
              setIsUpsertPaymentDialogOpen(true)
              setPaymentMutationType("add")
            }}
            size="sm"
            className="flex flex-1 md:flex-none md:ml-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
