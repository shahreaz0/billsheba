"use client"

import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { useGetActiveSessions } from "@/hooks/rq/use-sessions-query"
import { useSessionsStore } from "@/stores/sessions-store"
import { columns } from "./columns"
import { SessionsTableToolbar } from "./sessions-table-toolbar"
import { ViewSessionsDialog } from "./view-sessions-dialog"

export function SessionsTable() {
  const { data: sessionsData, isLoading } = useGetActiveSessions()
  const { setIsViewSessionDialogOpen, setSelectedSession } = useSessionsStore()

  const { table, render } = useDataTable({
    columns,
    data: sessionsData?.sessions,
    loading: isLoading,
  })

  return (
    <div className="space-y-4">
      <SessionsTableToolbar table={table} />

      {/* mobile: card view */}
      <div className="block md:hidden">
        <DataTableCardView
          loading={isLoading}
          table={table}
          mapRow={(row) => {
            const session = row.original
            const sessionId = session[".id"] || session["session-id"] || "unknown"
            return {
              title: session.name,
              description: session.address,
              uid: sessionId,
            }
          }}
          renderRowActions={() => null}
          onItemClick={(_item, row) => {
            if (row) {
              setIsViewSessionDialogOpen(true)
              setSelectedSession(row.original)
            }
          }}
        />
      </div>

      {/* desktop: table */}
      <div className="hidden md:block">{render}</div>

      <ViewSessionsDialog />
    </div>
  )
}
