import { createCollection } from "@tanstack/db"
import { queryCollectionOptions } from "@tanstack/query-db-collection"
import { httpV1 } from "@/lib/xior"
import { getQueryClient } from "@/providers/rq-provider"
import type { OrganizationResponse } from "@/types/organizations"

export const organizationsCollection = createCollection(
  queryCollectionOptions({
    queryClient: getQueryClient(),
    queryKey: ["organizations"],
    queryFn: () => {
      const results = httpV1
        .request<OrganizationResponse>({
          method: "GET",
          url: "/organizations",
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

      await httpV1.request({ method: "POST", url: "/organizations", data: modified })
    },

    onUpdate: async ({ transaction }) => {
      const { modified, original } = transaction.mutations[0]

      await httpV1.request({
        method: "PUT",
        url: `/organizations/${original.uid}`,
        data: modified,
      })
    },

    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0]
      await httpV1.request({ method: "DELETE", url: `/organizations/${original.uid}` })
    },
  }),
)
