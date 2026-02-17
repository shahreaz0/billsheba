"use client"

import * as React from "react"
import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetCustomerList } from "@/hooks/rq/use-customers-query"
import { useGetOrganizationList } from "@/hooks/rq/use-organizations-query"
import { generateAvatarUrl } from "@/lib/utils"
import { useCustomersStore } from "@/stores/customers-store"
import { columns } from "./columns"
import { CustomersTableRowActions } from "./customers-table-row-actions"
import { CustomersTableToolbar } from "./customers-table-toolbar"
import { UpsertCustomersDialog } from "./upsert-customers-dialog"
import { ViewCustomersDialog } from "./view-customers-dialog"

export function CustomersTable() {
  const { data: customersData, isLoading } = useGetCustomerList()
  const { data: organizationData } = useGetOrganizationList()
  const { setIsViewCustomerDialogOpen, setSelectedCustomer } = useCustomersStore()

  const organization = organizationData?.results?.[0]
  const showExpiryDate = organization?.billing_cycle !== "MONTHLY"

  const { table, render } = useDataTable({
    columns,
    data: customersData?.results,
    loading: isLoading,
  })

  const [status, setStatus] = React.useState("all")

  React.useEffect(() => {
    table.setColumnVisibility((prev) => ({
      ...prev,
      subscription_end_date: showExpiryDate,
    }))
  }, [showExpiryDate, table])

  React.useEffect(() => {
    if (status === "all") {
      table.getColumn("is_active")?.setFilterValue(undefined)
    } else {
      table.getColumn("is_active")?.setFilterValue([status])
    }
  }, [status, table])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs value={status} onValueChange={setStatus} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3 md:w-[300px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="true">Active</TabsTrigger>
            <TabsTrigger value="false">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
        <CustomersTableToolbar table={table} />
      </div>

      {/* mobile: card view */}
      <div className="block md:hidden">
        <DataTableCardView
          loading={isLoading}
          table={table}
          mapRow={(row) => {
            const customer = row.original
            return {
              title: customer.name,
              description: customer.username,
              avatar: generateAvatarUrl(customer.username || customer.name),
              uid: customer.uid,
            }
          }}
          renderRowActions={(row) => <CustomersTableRowActions row={row} />}
          onItemClick={(_item, row) => {
            if (row) {
              setIsViewCustomerDialogOpen(true)
              setSelectedCustomer(row.original)
            }
          }}
        />
      </div>

      {/* desktop: table */}
      <div className="hidden md:block">{render}</div>

      <UpsertCustomersDialog />
      <ViewCustomersDialog />
    </div>
  )
}
