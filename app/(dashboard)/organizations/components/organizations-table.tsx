"use client"

import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { useGetOrganizationList } from "@/hooks/rq/use-organizations-query"
import { generateAvatarUrl } from "@/lib/utils"
import { useOrganizationsStore } from "@/stores/organizations-store"
import { columns } from "./columns"
import { OrganizationsTableRowActions } from "./organizations-table-row-actions"
import { UpsertOrganizationsDialog } from "./upsert-organizations-dialog"
import { ViewOrganizationsDialog } from "./view-organizations-dialog"

export function OrganizationsTable() {
  const { data: organizationsData, isLoading } = useGetOrganizationList()
  const { setIsViewOrganizationDialogOpen, setSelectedOrganization } =
    useOrganizationsStore()

  const { table, render } = useDataTable({
    columns,
    data: organizationsData?.results,
    loading: isLoading,
    pagination: false,
  })

  return (
    <div className="space-y-4">
      <div className="block md:hidden">
        <DataTableCardView
          loading={isLoading}
          table={table}
          mapRow={(row) => {
            const org = row.original
            return {
              title: org.name,
              description: org.phone,
              avatar: generateAvatarUrl(org.name),
              uid: org.uid,
            }
          }}
          renderRowActions={(row) => <OrganizationsTableRowActions row={row} />}
          onItemClick={(_item, row) => {
            if (row) {
              setIsViewOrganizationDialogOpen(true)
              setSelectedOrganization(row.original)
            }
          }}
        />
      </div>

      <div className="hidden md:block">{render}</div>

      {/* <ViewOrganization /> */}
      <UpsertOrganizationsDialog />
      <ViewOrganizationsDialog />
    </div>
  )
}
