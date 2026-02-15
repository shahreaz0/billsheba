"use client"

import type { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { DeleteAlertDialog } from "@/components/core/delete-alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeletePayment } from "@/hooks/rq/use-payment-query"
import { usePaymentsStore } from "@/stores/payments-store"
import type { Payment } from "@/types/payments"

interface PaymentsTableRowActionsProps {
  row: Row<Payment>
}

export function PaymentsTableRowActions({ row }: PaymentsTableRowActionsProps) {
  const {
    setPaymentMutationType,
    setIsUpsertPaymentDialogOpen,
    setIsViewPaymentDialogOpen,
    setSelectedPayment,
  } = usePaymentsStore()

  const { mutate: triggerDeletePayment } = useDeletePayment()

  const [open, setOpen] = useState(false)

  function onDeleteHandler() {
    triggerDeletePayment(row.original.uid)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setIsViewPaymentDialogOpen(true)
              setSelectedPayment(row.original)
            }}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsUpsertPaymentDialogOpen(true)
              setPaymentMutationType("edit")
              setSelectedPayment(row.original)
            }}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setOpen(true)
            }}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAlertDialog
        open={open}
        setOpen={setOpen}
        resource="payment"
        onDelete={onDeleteHandler}
      />
    </>
  )
}
