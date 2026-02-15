import xior from "xior"
import errorRetry from "xior/plugins/error-retry"
import setupTokenRefresh from "xior/plugins/token-refresh"
import { attemptRefresh, shouldRefresh } from "./auth-utils"
import { cookie } from "./cookie"

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

httpV1.interceptors.request.use((config) => {
  const token = cookie.get("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
