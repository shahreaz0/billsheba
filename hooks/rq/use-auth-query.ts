import {
  queryOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { XiorError } from "xior"
import { setAuthCookies } from "@/lib/auth-utils"
import { httpV1 } from "@/lib/xior"
import type { Session } from "@/types/auth"
import type { LoginResponse } from "@/types/logins"
import type { RegisterPayload, RegisterResponse } from "@/types/register"

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: { phone: string; password: string }) => {
      return httpV1
        .request<LoginResponse>({
          method: "post",
          url: "/users/login",
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: async (data) => {
      toast.success("Successfully logged in")

      setAuthCookies(data)

      router.refresh()
      router.push("/")
    },
  })
}

export function useRegister() {
  const router = useRouter()
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: RegisterPayload) => {
      return httpV1
        .request<RegisterResponse>({
          method: "post",
          url: "/users/register",
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      router.push("/dashboard")
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

export function useForgotPassword() {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (payload: {
      phone: string
      otp?: string
      password?: string
      confirm_password?: string
    }) => {
      return httpV1
        .request<{
          phone: string
          otp: string
        }>({
          method: "post",
          url: "/users/forget-password",
          data: payload,
        })
        .then((res) => res.data)
    },
  })
}

export function sessionOptions() {
  return queryOptions({
    queryKey: ["session"],
    queryFn: () => {
      return httpV1
        .request<Session>({ method: "GET", url: "/users/me" })
        .then((res) => res.data)
    },
    staleTime: 10 * 60 * 1000,
    retry: 0,
    refetchOnWindowFocus: false,
  })
}

export function useSession() {
  return useQuery(sessionOptions())
}

export function useSuspenseSession() {
  return useSuspenseQuery(sessionOptions())
}
