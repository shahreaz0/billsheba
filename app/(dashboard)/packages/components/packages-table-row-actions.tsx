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
import { useDeletePackage } from "@/hooks/rq/use-packages-query"
import { usePackagesStore } from "@/stores/packages-store"
import type { Package } from "@/types/packages"

interface PackagesTableRowActionsProps {
  row: Row<Package>
}

export function PackagesTableRowActions({ row }: PackagesTableRowActionsProps) {
  const {
    setPackageMutationType,
    setIsUpsertPackageDialogOpen,
    setIsViewPackageDialogOpen,
    setSelectedPackage,
  } = usePackagesStore()

  const [open, setOpen] = useState(false)

  const { mutate: triggerDeletePackage, isPending } = useDeletePackage()

  function onDeleteHandler() {
    triggerDeletePackage(row.original.uid)
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
              setIsViewPackageDialogOpen(true)
              setSelectedPackage(row.original)
            }}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsUpsertPackageDialogOpen(true)
              setPackageMutationType("edit")
              setSelectedPackage(row.original)
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
        resource="package"
        onDelete={onDeleteHandler}
        loading={isPending}
      />
    </>
  )
}
