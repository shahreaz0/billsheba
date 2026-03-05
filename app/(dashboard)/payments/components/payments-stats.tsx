"use client"

import type { Table } from "@tanstack/react-table"
import { usePaymentsStore } from "@/stores/payments-store"
import type { Payment } from "@/types/payments"

type PaymentsStatsProps = {
  table: Table<Payment>
}

export function PaymentsStats({ table }: PaymentsStatsProps) {
  const { paymentFilters } = usePaymentsStore()
  const { status } = paymentFilters

  const rows = table.getFilteredRowModel().rows

  const totals = rows.reduce(
    (acc, row) => {
      const typedRow = row.original
      const amount = Number(typedRow.amount) || 0
      const billAmount = Number(typedRow.bill_amount) || 0

      if (typedRow.paid) {
        acc.paid += amount
      } else {
        acc.unpaid += billAmount
      }
      return acc
    },
    { paid: 0, unpaid: 0 },
  )

  const totalAmount = totals.paid + totals.unpaid

  return (
    <div className="flex items-center gap-4 text-sm font-medium border rounded-md px-4 py-1.5 bg-muted/20 w-full md:w-auto">
      <div>
        Total Payments: <span className="text-muted-foreground">{rows.length}</span>
      </div>

      <div className="w-[1px] h-4 bg-border"></div>
      <div>
        Total Amount:{" "}
        <span className="text-muted-foreground whitespace-nowrap">
          {status === "all" ? (
            <>
              ৳{totals.paid.toLocaleString()} + ৳{totals.unpaid.toLocaleString()} = ৳
              {totalAmount.toLocaleString()}
            </>
          ) : (
            <>৳{totalAmount.toLocaleString()}</>
          )}
        </span>
      </div>
    </div>
  )
}
