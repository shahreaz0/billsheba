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
import { useSession } from "@/hooks/rq/use-auth-query"
import { useDeleteUser } from "@/hooks/rq/use-users-query"
import { useUsersStore } from "@/stores/users-store"

interface UsersTableRowActionsProps {
  row: Row<any>
}

export function UsersTableRowActions({ row }: UsersTableRowActionsProps) {
  const {
    setUserMutationType,
    setIsUpsertUserDialogOpen,
    setIsViewUserDialogOpen,
    setSelectedUser,
  } = useUsersStore()

  const [open, setOpen] = useState(false)
  const { mutate: triggerDeleteUser } = useDeleteUser()

  const { data: session } = useSession()

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
              setIsViewUserDialogOpen(true)
              setSelectedUser(row.original)
            }}
          >
            View
          </DropdownMenuItem>

          {session?.kind === "ADMIN" && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setIsUpsertUserDialogOpen(true)
                  setUserMutationType("edit")
                  setSelectedUser(row.original)
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
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAlertDialog
        open={open}
        setOpen={setOpen}
        resource="user"
        onDelete={() => triggerDeleteUser(row.original.uid)}
      />
    </>
  )
}
