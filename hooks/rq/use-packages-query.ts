import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { httpV1 } from "@/lib/xior"
import type { Package, PackageResponse } from "@/types/packages"

export function getPackageListOptions() {
  return queryOptions({
    queryKey: ["packages", "list"],
    queryFn: () => {
      return httpV1
        .request<PackageResponse>({
          method: "GET",
          url: "/packages",
          params: {
            page: 1,
            page_size: 10_000,
          },
        })
        .then((res) => res.data)
    },
  })
}

function createPackageOptions() {
  return mutationOptions({
    mutationKey: ["packages", "add"],
    mutationFn: (payload: any) => {
      return httpV1
        .request<Package>({
          method: "POST",
          url: "/packages",
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success("Package created successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["packages"] })
    },
  })
}

function updatePackageOptions() {
  return mutationOptions({
    mutationKey: ["packages", "update"],
    mutationFn: ({ payload, uid }: { payload: Partial<Package>; uid: string }) => {
      return httpV1
        .request<Package>({
          method: "PUT",
          url: `/packages/${uid}`,
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success("Package updated successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["packages"] })
    },
  })
}

function deletePackageOptions() {
  return mutationOptions({
    mutationKey: ["packages", "delete"],
    mutationFn: (uid: string) => {
      return httpV1
        .request({
          method: "DELETE",
          url: `/packages/${uid}`,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success("Package deleted successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["packages"] })
    },
  })
}

export function useGetPackageList() {
  return useQuery(getPackageListOptions())
}

export function useCreatePackage() {
  return useMutation(createPackageOptions())
}

export function useDeletePackage() {
  return useMutation(deletePackageOptions())
}

export function useUpdatePackage() {
  return useMutation(updatePackageOptions())
}
