"use client"

import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { useGetPackageList } from "@/hooks/rq/use-packages-query"
import { generateAvatarUrl } from "@/lib/utils"
import { usePackagesStore } from "@/stores/packages-store"
import { columns } from "./columns"
import { PackagesTableRowActions } from "./packages-table-row-actions"
import { PackagesTableToolbar } from "./packages-table-toolbar"
import { UpsertPackagesDialog } from "./upsert-packages-dialog"
import { ViewPackagesDialog } from "./view-packages-dialog"

export function PackagesTable() {
  const { data: packageData, isLoading } = useGetPackageList()
  const { setIsViewPackageDialogOpen, setSelectedPackage } = usePackagesStore()

  const { table, render } = useDataTable({
    columns,
    data: packageData?.results,
    loading: isLoading,
  })

  return (
    <div className="space-y-4">
      <PackagesTableToolbar table={table} />

      <div className="block md:hidden">
        <DataTableCardView
          loading={isLoading}
          table={table}
          mapRow={(row) => {
            const pkg = row.original
            return {
              title: pkg.name,
              description: `${pkg.speed_mbps} Mbps · ${pkg.price}`,
              avatar: generateAvatarUrl(pkg.name),
              uid: pkg.uid,
            }
          }}
          renderRowActions={(row) => <PackagesTableRowActions row={row} />}
          onItemClick={(_item, row) => {
            if (row) {
              setIsViewPackageDialogOpen(true)
              setSelectedPackage(row.original)
            }
          }}
        />
      </div>

      <div className="hidden md:block">{render}</div>

      <UpsertPackagesDialog />
      <ViewPackagesDialog />
    </div>
  )
}
