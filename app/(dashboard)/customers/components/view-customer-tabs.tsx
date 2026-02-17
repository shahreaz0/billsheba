"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomersDetailsTab } from "./customers-details-tab"
import { CustomersPaymentHistoryTab } from "./customers-payment-history-tab"

export function ViewCustomerTabs() {
  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="history">Payment History</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <CustomersDetailsTab />
      </TabsContent>
      <TabsContent value="history">
        <CustomersPaymentHistoryTab />
      </TabsContent>
    </Tabs>
  )
}
