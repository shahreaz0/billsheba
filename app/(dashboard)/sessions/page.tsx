import type { Metadata } from "next"
import { SessionsTable } from "./components/sessions-table"

export const metadata: Metadata = {
  title: "Active Sessions",
  description: "View active network sessions",
}

export default async function SessionsPage() {
  return <SessionsTable />
}
