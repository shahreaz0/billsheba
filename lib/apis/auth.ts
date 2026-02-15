import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import { cookies } from "next/headers"
import xior from "xior"
import type { Session } from "@/types/auth"
import type { DashboardResponse } from "@/types/dashboard"

const http = xior.create({
  baseURL: "https://api.billsheba.com/api/v1",
})

http.interceptors.request.use(async (config) => {
  const cookieStore = await cookies()

  const token = cookieStore.get("token")?.value

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export async function getSession() {
  try {
    const res = await http
      .request<Session>({ method: "GET", url: "/users/me" })
      .then((res) => res.data)

    return res
  } catch (_error) {
    return null
  }
}

export async function getDashboardData() {
  "use cache: private"

  cacheLife("minutes")
  cacheTag("dashboard")

  try {
    const res = await http
      .request<DashboardResponse>({ method: "GET", url: "/dashboard" })
      .then((res) => res.data)
    return res
  } catch (_error) {
    return null
  }
}
