import { createStore } from "stan-js"

import type { Payment } from "@/types/payments"

export const { useStore: usePaymentsStore, reset: resetPaymentsStore } = createStore({
  isViewPaymentDialogOpen: false,
  isUpsertPaymentDialogOpen: false,
  paymentMutationType: "" as "add" | "edit",
  selectedPayment: {} as Payment,
  paymentFilters: {
    year: new Date().getFullYear().toString(),
    status: "all",
    start_date: "",
    end_date: "",
  },
})
