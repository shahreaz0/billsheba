import type { Row, Table } from "@tanstack/react-table"
import { format } from "date-fns"
import type { Payment } from "@/types/payments"

export interface ExportOptions {
  columnIds?: string[]
}

interface ColumnConfig {
  id: string
  accessor?: (row: Row<Payment>) => string
}

function formatHeaderName(id: string): string {
  if (id === "payment_date") return "Payment Date"
  if (id === "created_at") return "Created At"
  if (id === "updated_at") return "Updated At"
  if (id === "paid") return "Status"

  if (id.includes("_")) {
    return id
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }
  return id.charAt(0).toUpperCase() + id.slice(1)
}

function getColumnsConfig(table: Table<Payment>, options?: ExportOptions) {
  let columnIds = options?.columnIds

  if (!columnIds) {
    columnIds = table
      .getAllColumns()
      .filter((col) => col.id !== "actions" && col.id !== "select")
      .map((col) => col.id)
  }

  const headers: string[] = []
  const columnExponents: ColumnConfig[] = []

  for (const id of columnIds) {
    if (id === "entry_by") {
      headers.push("Collected By Name", "Collected By Phone")
      columnExponents.push(
        {
          id: "entry_by_name",
          accessor: (row) => {
            const eb = row.original.entry_by
            if (!eb) return ""
            return `${eb.first_name || ""} ${eb.last_name || ""}`.trim() || "None"
          },
        },
        {
          id: "entry_by_phone",
          accessor: (row) => row.original.entry_by?.phone || "",
        },
      )
    } else if (id === "customer") {
      headers.push("Customer Name", "Customer Phone", "Customer Username")
      columnExponents.push(
        {
          id: "customer_name",
          accessor: (row) => row.original.customer?.name || "",
        },
        {
          id: "customer_phone",
          accessor: (row) => row.original.customer?.phone || "",
        },
        {
          id: "customer_username",
          accessor: (row) => row.original.customer?.username || "",
        },
      )
    } else if (["payment_date", "created_at", "updated_at"].includes(id)) {
      headers.push(formatHeaderName(id))
      columnExponents.push({
        id,
        accessor: (row) => {
          const val = row.getValue(id) as string | Date | null
          if (!val) return ""
          try {
            return format(new Date(val), "dd MMM yyyy hh:mm a")
          } catch {
            return String(val)
          }
        },
      })
    } else if (id === "paid") {
      headers.push("Status")
      columnExponents.push({
        id,
        accessor: (row) => (row.original.paid ? "Paid" : "Unpaid"),
      })
    } else {
      headers.push(formatHeaderName(id))
      columnExponents.push({ id })
    }
  }

  return { headers, columnExponents }
}

function formatCSVValue(val: unknown): string {
  if (val === null || val === undefined) {
    return ""
  }
  const stringVal = String(val)
  if (stringVal.includes(",") || stringVal.includes('"') || stringVal.includes("\n")) {
    return `"${stringVal.replaceAll('"', '""')}"`
  }
  return stringVal
}

export function exportTableToCSV(
  table: Table<Payment>,
  filename: string,
  options?: ExportOptions,
) {
  const rows = table.getFilteredRowModel().rows
  const { headers, columnExponents } = getColumnsConfig(table, options)

  const csvContent =
    headers.join(",") +
    "\n" +
    rows
      .map((row) => {
        return columnExponents
          .map((exp) => {
            const val = exp.accessor ? exp.accessor(row) : row.getValue(exp.id)
            return formatCSVValue(val)
          })
          .join(",")
      })
      .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  link.remove()
}
