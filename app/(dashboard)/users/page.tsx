import type { Metadata } from "next"
import { UsersTable } from "./components/users-table"

export const metadata: Metadata = {
  title: "Users",
  description: "Manage your users",
}

export default async function UsersPage() {
  return <UsersTable />
}
