import xior from "xior"
import errorRetry from "xior/plugins/error-retry"
import setupTokenRefresh from "xior/plugins/token-refresh"
import { attemptRefresh, shouldRefresh } from "./auth-utils"

export const httpV1 = xior.create({
  baseURL: "https://api.billsheba.com/api/v1",
  cache: "no-store",
})

httpV1.plugins.use(
  errorRetry({
    enableRetry: (_config, error) => {
      if (error?.response && shouldRefresh(error.response)) {
        return true
      }
    },
  }),
)

setupTokenRefresh(httpV1, {
  shouldRefresh,
  refreshToken: async () => {
    console.log("Refreshing token...")
    await attemptRefresh()
  },
})

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return null
}

httpV1.interceptors.request.use((config) => {
  const token = getCookie("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
