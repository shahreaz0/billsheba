"use client"

import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { useGetUserList } from "@/hooks/rq/use-users-query"
import { generateAvatarUrl } from "@/lib/utils"
import { useUsersStore } from "@/stores/users-store"
import { columns } from "./columns"
import { UpsertUsersDialog } from "./upsert-users-dialog"
import { UsersTableRowActions } from "./users-table-row-actions"
import { UsersTableToolbar } from "./users-table-toolbar"
import { ViewUsersDialog } from "./view-users-dialog"

export function UsersTable() {
  const { data: usersData, isLoading } = useGetUserList()
  const { setIsViewUserDialogOpen, setSelectedUser } = useUsersStore()

  const { table, render } = useDataTable({
    columns,
    data: usersData?.results,
    loading: isLoading,
  })

  return (
    <div className="space-y-4">
      <UsersTableToolbar table={table} />

      <div className="block md:hidden">
        <DataTableCardView
          loading={isLoading}
          table={table}
          mapRow={(row) => {
            const user = row.original
            return {
              title: `${user.first_name} ${user.last_name}`,
              description: user.email,
              avatar: generateAvatarUrl(user.email || user.first_name),
              uid: user.uid,
            }
          }}
          renderRowActions={(row) => <UsersTableRowActions row={row} />}
          onItemClick={(_item, row) => {
            if (row) {
              setIsViewUserDialogOpen(true)
              setSelectedUser(row.original)
            }
          }}
        />
      </div>

      <div className="hidden md:block">{render}</div>

      <UpsertUsersDialog />
      <ViewUsersDialog />
    </div>
  )
}
