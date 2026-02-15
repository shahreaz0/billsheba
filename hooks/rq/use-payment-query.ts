import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { httpV1 } from "@/lib/xior"
import { usePaymentsStore } from "@/stores/payments-store"
import type { Payment, PaymentFilters, PaymentResponse } from "@/types/payments"

export function getPaymentListOptions(filters: PaymentFilters) {
  return queryOptions({
    queryKey: ["payments", "list", filters],
    queryFn: () => {
      return httpV1
        .request<PaymentResponse>({
          method: "GET",
          url: "/payments",
          params: {
            page: 1,
            page_size: 10_000,
            ...filters,
          },
        })
        .then((res) => res.data)
    },
  })
}

function createPaymentOptions() {
  return mutationOptions({
    mutationKey: ["payments", "add"],
    mutationFn: (payload: any) => {
      return httpV1
        .request<Payment>({
          method: "POST",
          url: "/payments",
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success("Payment created successfully")
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["payments"] })
    },
  })
}

function updatePaymentOptions() {
  return mutationOptions({
    mutationKey: ["payments", "update"],
    mutationFn: ({ payload, uid }: { payload: Partial<Payment>; uid: string }) => {
      return httpV1
        .request<Payment>({
          method: "PUT",
          url: `/payments/${uid}`,
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success("Payment updated successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["payments"] })
    },
  })
}

function deletePaymentOptions() {
  return mutationOptions({
    mutationKey: ["payments", "delete"],
    mutationFn: (uid: string) => {
      return httpV1
        .request({
          method: "DELETE",
          url: `/payments/${uid}`,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success("Payment deleted successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["payments"] })
    },
  })
}

export function useGetPaymentList() {
  const { paymentFilters } = usePaymentsStore()

  return useQuery(getPaymentListOptions(paymentFilters))
}

export function useCreatePayment() {
  return useMutation(createPaymentOptions())
}

export function useUpdatePayment() {
  return useMutation(updatePaymentOptions())
}

export function useDeletePayment() {
  return useMutation(deletePaymentOptions())
}
