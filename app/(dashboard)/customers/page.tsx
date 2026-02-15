import type { Metadata } from "next"
import { CustomersTable } from "./components/customers-table"

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage your customers",
}

export default async function CustomersPage() {
  return <CustomersTable />
}
