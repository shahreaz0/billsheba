"use client"

import type { Table } from "@tanstack/react-table"
import type { Payment } from "@/types/payments"

type PaymentsStatsProps = {
  table: Table<Payment>
}

export function PaymentsStats({ table }: PaymentsStatsProps) {
  return (
    <div className="flex items-center gap-4 text-sm font-medium border rounded-md px-4 py-1.5 bg-muted/20 w-full md:w-auto">
      <div>
        Total Payments:{" "}
        <span className="text-muted-foreground">
          {table.getFilteredRowModel().rows.length}
        </span>
      </div>

      <div className="w-[1px] h-4 bg-border"></div>
      <div>
        Total Amount:{" "}
        <span className="text-muted-foreground">
          ৳
          {table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => {
              const typedRow = row.original as Payment
              return sum + (Number(typedRow.bill_amount) || 0)
            }, 0)
            .toLocaleString()}
        </span>
      </div>
    </div>
  )
}
