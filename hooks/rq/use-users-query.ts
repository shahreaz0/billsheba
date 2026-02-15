import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { XiorError } from "xior"
import { httpV1 } from "@/lib/xior"
import type { User, UserResponse } from "@/types/users"

export function getUserListOptions() {
  return queryOptions({
    queryKey: ["users", "list"],
    queryFn: () => {
      return httpV1
        .request<UserResponse>({
          method: "GET",
          url: "/users",
          params: {
            page: 1,
            page_size: 10_000,
          },
        })
        .then((res) => res.data)
    },
  })
}

function createUserOptions() {
  return mutationOptions({
    mutationKey: ["users", "add"],
    mutationFn: (payload: any) => {
      return httpV1
        .request<User>({
          method: "POST",
          url: "/users",
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success("User created successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

function updateUserOptions() {
  return mutationOptions({
    mutationKey: ["users", "update"],
    mutationFn: ({ payload, uid }: { payload: Partial<User>; uid: string }) => {
      return httpV1
        .request<User>({
          method: "PATCH",
          url: `/users/${uid}`,
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success("User updated successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

function deleteUserOptions() {
  return mutationOptions({
    mutationKey: ["users", "delete"],
    mutationFn: (uid: string) => {
      return httpV1
        .request({
          method: "DELETE",
          url: `/users/${uid}`,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success("User deleted successfully")
    },

    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationKey: ["change-password"],
    mutationFn: (payload: {
      old_password: string
      new_password: string
      confirm_new_password: string
    }) => {
      return httpV1
        .request({
          method: "post",
          url: "/users/me/change-password",
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success("Password changed successfully")
    },
    onError: (error) => {
      if (error instanceof XiorError) {
        toast.error("Registration failed. Please try again", {
          description: error.message,
        })
      }
    },
  })
}

export function useGetUserList() {
  return useQuery(getUserListOptions())
}

export function useCreateUser() {
  return useMutation(createUserOptions())
}

export function useUpdateUser() {
  return useMutation(updateUserOptions())
}

export function useDeleteUser() {
  return useMutation(deleteUserOptions())
}
