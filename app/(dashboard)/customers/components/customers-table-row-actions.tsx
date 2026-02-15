"use client"

import type { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useOptimistic, useState } from "react"
import { DeleteAlertDialog } from "@/components/core/delete-alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useDeleteCustomer,
  useToggleCustomerStatus,
} from "@/hooks/rq/use-customers-query"
import { useCustomersStore } from "@/stores/customers-store"
import type { Customer } from "@/types/customers"
import { customerStatus } from "../data/data"

interface CustomersTableRowActionsProps {
  row: Row<Customer>
}

export function CustomersTableRowActions({ row }: CustomersTableRowActionsProps) {
  const {
    setCustomerMutationType,
    setIsUpsertCustomerDialogOpen,
    setIsViewCustomerDialogOpen,
    setSelectedCustomer,
  } = useCustomersStore()

  const { mutate: triggerDeleteCustomer } = useDeleteCustomer()

  const { mutate: triggerToogleCustomerStatus } = useToggleCustomerStatus()

  const status = row.original.is_active ? "true" : "false"
  const [optimisticStatus, setOptimisticStatus] = useOptimistic<string>(status)
  const [open, setOpen] = useState(false)

  function onDeleteHandler() {
    triggerDeleteCustomer(row.original.uid)
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
              setIsViewCustomerDialogOpen(true)
              setSelectedCustomer(row.original)
            }}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsUpsertCustomerDialogOpen(true)
              setCustomerMutationType("edit")
              setSelectedCustomer(row.original)
            }}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={optimisticStatus}
                  onValueChange={(val) => {
                    setOptimisticStatus(val)
                    triggerToogleCustomerStatus(
                      {
                        username: row.original.username,
                        is_active: val === "true",
                      },
                      {
                        onError: () => {
                          setOptimisticStatus(status) // revert on error
                        },
                      },
                    )
                  }}
                >
                  {customerStatus.map((s) => (
                    <DropdownMenuRadioItem value={s.value} key={s.value}>
                      <s.icon /> {s.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

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

      {open && (
        <DeleteAlertDialog
          open={open}
          setOpen={setOpen}
          resource="customer"
          onDelete={onDeleteHandler}
        />
      )}
    </>
  )
}
