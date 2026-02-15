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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteOrganization } from "@/hooks/rq/use-organizations-query"
import { useOrganizationsStore } from "@/stores/organizations-store"
import type { Organization } from "@/types/organizations"

// import { organizationStatus } from "../data/data"

interface OrganizationsTableRowActionsProps {
  row: Row<Organization>
}

export function OrganizationsTableRowActions({ row }: OrganizationsTableRowActionsProps) {
  const {
    setOrganizationMutationType,
    setIsUpsertOrganizationDialogOpen,
    setIsViewOrganizationDialogOpen,
    setSelectedOrganization,
  } = useOrganizationsStore()

  const { mutate: triggerDeleteOrganization } = useDeleteOrganization()

  const [open, setOpen] = useState(false)

  function onDeleteHandler() {
    triggerDeleteOrganization(row.original.uid)
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
              setIsViewOrganizationDialogOpen(true)
              setSelectedOrganization(row.original)
            }}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsUpsertOrganizationDialogOpen(true)
              setOrganizationMutationType("edit")
              setSelectedOrganization(row.original)
            }}
          >
            Edit
          </DropdownMenuItem>

          {/* <DropdownMenuSeparator /> */}

          {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={(val) => {
                    setPosition(val as "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING")
                  }}
                >
                  {organizationStatus.map((s) => (
                    <DropdownMenuRadioItem key={s.value} value={s.value}>
                      <s.icon className="h-3 w-3 mr-2" /> {s.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub> */}

          {/* <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setOpen(true)
            }}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAlertDialog
        open={open}
        setOpen={setOpen}
        resource="organization"
        onDelete={onDeleteHandler}
      />
    </>
  )
}
