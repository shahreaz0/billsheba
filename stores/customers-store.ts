import { createStore } from "stan-js"

import type { Customer } from "@/types/customers"

export const { useStore: useCustomersStore, reset: resetCustomersStore } = createStore({
  isViewCustomerDialogOpen: false,
  isUpsertCustomerDialogOpen: false,
  customerMutationType: "" as "add" | "edit",
  selectedCustomer: {} as Customer,
})
