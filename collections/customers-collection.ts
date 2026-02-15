import { createCollection } from "@tanstack/db"
import { queryCollectionOptions } from "@tanstack/query-db-collection"
import { httpV1 } from "@/lib/xior"
import { getQueryClient } from "@/providers/rq-provider"
import type { CustomerResponse } from "@/types/customers"

export const customersCollection = createCollection(
  queryCollectionOptions({
    queryClient: getQueryClient(),
    queryKey: ["customers"],
    queryFn: () => {
      const results = httpV1
        .request<CustomerResponse>({
          method: "GET",
          url: "/customers",
          params: {
            page: 1,
            page_size: 10000,
          },
        })
        .then((res) => res.data.results)

      return results
    },
    getKey: (item) => item.uid,
    onInsert: async ({ transaction }) => {
      const { modified } = transaction.mutations[0]

      await httpV1.request({ method: "POST", url: "/customers", data: modified })
    },

    onUpdate: async ({ transaction }) => {
      const { modified, original } = transaction.mutations[0]

      await httpV1.request({
        method: "PUT",
        url: `/customers/${original.id}`,
        data: modified,
      })
    },

    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0]
      await httpV1.request({ method: "DELETE", url: `/customers/${original.id}` })
    },
  }),
)
