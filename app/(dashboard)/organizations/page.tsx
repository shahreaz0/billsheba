import type { Metadata } from "next"
import { OrganizationsTable } from "./components/organizations-table"

export const metadata: Metadata = {
  title: "Organizations",
  description: "Manage your organizations",
}

export default async function OrganizationsPage() {
  return <OrganizationsTable />
}
