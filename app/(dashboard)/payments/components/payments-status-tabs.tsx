"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePaymentsStore } from "@/stores/payments-store"

export function PaymentsStatusTabs() {
  const { setPaymentFilters, paymentFilters } = usePaymentsStore()

  return (
    <Tabs
      value={paymentFilters.status}
      onValueChange={(value) => setPaymentFilters((prev) => ({ ...prev, status: value }))}
      className="w-full md:w-auto"
    >
      <TabsList className="grid w-full grid-cols-3 md:w-[300px]">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="true">Paid</TabsTrigger>
        <TabsTrigger value="false">Unpaid</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
