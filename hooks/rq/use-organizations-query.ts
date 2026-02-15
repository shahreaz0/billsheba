import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { httpV1 } from "@/lib/xior"
import type {
  CreateOrganization,
  Organization,
  OrganizationResponse,
} from "@/types/organizations"

export function getOrganizationListOptions() {
  return queryOptions({
    queryKey: ["organizations", "list"],
    queryFn: () => {
      return httpV1
        .request<OrganizationResponse>({
          method: "GET",
          url: "/organizations",
          params: {
            page: 1,
            page_size: 10_000,
          },
        })
        .then((res) => res.data)
    },
  })
}

function createOrganizationOptions() {
  return mutationOptions({
    mutationKey: ["organizations", "add"],
    mutationFn: (payload: CreateOrganization) => {
      return httpV1
        .request<Organization>({
          method: "POST",
          url: "/organizations",
          data: payload,
        })
        .then((res) => res.data)
    },

    onSuccess: () => {
      toast.success("Organization created successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["organizations"] })
    },
  })
}

function updateOrganizationOptions() {
  return mutationOptions({
    mutationKey: ["organizations", "update"],
    mutationFn: ({
      payload,
      uid,
    }: {
      payload: Partial<CreateOrganization>
      uid: string
    }) => {
      return httpV1
        .request<Organization>({
          method: "PUT",
          url: `/organizations/${uid}`,
          data: payload,
        })
        .then((res) => res.data)
    },

    onSuccess: () => {
      toast.success("Organization updated successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["organizations"] })
    },
  })
}

function deleteOrganizationOptions() {
  return mutationOptions({
    mutationKey: ["organizations", "delete"],
    mutationFn: (uid: string) => {
      return httpV1
        .request({
          method: "DELETE",
          url: `/organizations/${uid}`,
        })
        .then((res) => res.data)
    },

    onSuccess: () => {
      toast.success("Organization deleted successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["organizations"] })
    },
  })
}

// export function getOrganizationDetailsOptions(uid: string) {
//   return queryOptions({
//     queryKey: ["organizations", "details", uid],
//     queryFn: () =>
//       httpV1
//         .request<Organization>({
//           method: "GET",
//           url: `/organizations/${uid}`,
//         })
//         .then((res) => res.data),
//   })
// }

// export function useGetOrganizationDetails(uid: string | undefined | null) {
//   if (!uid) {
//     // Return a disabled query when uid is not provided
//     return useQuery({
//       queryKey: ["organizations", "details", uid],
//       queryFn: async () => null,
//       enabled: false,
//     })
//   }

//   return useQuery(getOrganizationDetailsOptions(uid))
// }

export function useGetOrganizationList() {
  return useQuery(getOrganizationListOptions())
}

export function useCreateOrganization() {
  return useMutation(createOrganizationOptions())
}

export function useUpdateOrganization() {
  return useMutation(updateOrganizationOptions())
}

export function useDeleteOrganization() {
  return useMutation(deleteOrganizationOptions())
}
