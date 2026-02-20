"use client"

import type { Table } from "@tanstack/react-table"
import { Plus, X } from "lucide-react"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/rq/use-auth-query"
import { useUsersStore } from "@/stores/users-store"
import { genders, kinds } from "../data/data"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function UsersTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { setUserMutationType, setIsUpsertUserDialogOpen } = useUsersStore()

  const { data: session } = useSession()

  return (
    <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-2">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        {/* <Select defaultValue="first_name" onValueChange={setSearchField}>
          <SelectTrigger size="sm" className="w-full md:w-[142px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="first_name">Name</SelectItem>
            <SelectItem value="email">Email & Phone</SelectItem>
          </SelectContent>
        </Select> */}

        <DataTableSearch table={table} searchField="first_name" />

        {table.getColumn("gender") && (
          <DataTableFacetedFilter
            column={table.getColumn("gender")}
            title="Gender"
            options={genders}
          />
        )}
        {table.getColumn("kind") && (
          <DataTableFacetedFilter
            column={table.getColumn("kind")}
            title="Kind"
            options={kinds}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>

      {session?.kind === "ADMIN" && (
        <Button
          onClick={() => {
            setIsUpsertUserDialogOpen(true)
            setUserMutationType("add")
          }}
          size="sm"
          className="md:mr-2"
        >
          <Plus />
          Add User
        </Button>
      )}

      {/* <DataTableViewOptions table={table} /> */}
    </div>
  )
}
