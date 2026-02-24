"use client"

import { CircleCheckIcon, CircleXIcon } from "lucide-react"
import React, { Suspense } from "react"
import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { Badge } from "@/components/ui/badge"
import { useGetPaymentList } from "@/hooks/rq/use-payment-query"
import { cn, generateAvatarUrl } from "@/lib/utils"
import { usePaymentsStore } from "@/stores/payments-store"
import { columns } from "./columns"
import { PaymentsTableRowActions } from "./payments-table-row-actions"
import { PaymentsTableToolbar } from "./payments-table-toolbar"
import { PaymentsUpsertDialog } from "./payments-upsert-dialog"
import { ViewPaymentsDialog } from "./view-payments-dialog"

export function PaymentsTable() {
  const { data: paymentsData, isLoading } = useGetPaymentList()
  const { setIsViewPaymentDialogOpen, setSelectedPayment, paymentFilters } =
    usePaymentsStore()

  const { status } = paymentFilters

  const filteredData = React.useMemo(() => {
    if (!paymentsData?.results) return []
    if (status === "all") return paymentsData.results
    return paymentsData.results.filter((payment) => payment.paid.toString() === status)
  }, [paymentsData?.results, status])

  const collectors = React.useMemo(() => {
    if (!paymentsData?.results) return []
    const _collectors = paymentsData.results.map((payment) => {
      const { first_name, last_name } = payment.entry_by || {}
      const label =
        first_name || last_name ? `${first_name || ""} ${last_name || ""}` : "None"
      return {
        label: label,
        value: label,
      }
    })

    const uniqueCollectorValues = new Set()
    return _collectors.filter((collector) => {
      if (uniqueCollectorValues.has(collector.value)) {
        return false
      }
      uniqueCollectorValues.add(collector.value)
      return true
    })
  }, [paymentsData?.results])

  const { table, render } = useDataTable({
    columns,
    data: filteredData,
    loading: isLoading,
  })

  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <PaymentsTableToolbar table={table} collectors={collectors} />

        <div className="block md:hidden">
          <DataTableCardView
            loading={isLoading}
            table={table}
            mapRow={(row) => {
              const p = row.original

              const collectorName = `${p.entry_by?.last_name || "unknown"}`
              return {
                title: p.customer.username || p.customer.name,
                description: `Collected By ${collectorName} · ${p.payment_method}`,
                avatar: generateAvatarUrl(p.customer.username || p.customer.name),
                uid: p.uid,
                side: (
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-medium">৳{p.amount}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        p.paid
                          ? "bg-emerald-500 text-white dark:bg-emerald-600"
                          : "bg-red-500 text-white dark:bg-red-600",
                      )}
                    >
                      {p.paid ? <CircleCheckIcon /> : <CircleXIcon />}
                      {p.paid ? "Paid" : "Unpaid"}
                    </Badge>
                  </div>
                ),
              }
            }}
            renderRowActions={(row) => <PaymentsTableRowActions row={row} />}
            onItemClick={(_item, row) => {
              if (row) {
                setIsViewPaymentDialogOpen(true)
                setSelectedPayment(row.original)
              }
            }}
          />
        </div>

        <div className="hidden md:block">{render}</div>

        <PaymentsUpsertDialog />
        <ViewPaymentsDialog />
      </Suspense>
    </div>
  )
}
