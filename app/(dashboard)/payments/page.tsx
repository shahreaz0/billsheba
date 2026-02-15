import type { Metadata } from "next"
import { PaymentsTable } from "./components/payments-table"

export const metadata: Metadata = {
  title: "Payments",
  description: "Manage your payments",
}

export default async function PaymentsPage() {
  return <PaymentsTable />
}
