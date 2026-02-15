import type { Metadata } from "next"
import { PackagesTable } from "./components/packages-table"

export const metadata: Metadata = {
  title: "Packages",
  description: "Manage your packages",
}

export default async function PackagesPage() {
  return <PackagesTable />
}
