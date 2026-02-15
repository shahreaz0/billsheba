import { toast } from "sonner"
import xior, { type XiorResponse } from "xior"
import { cookie } from "./cookie"

export function setAuthCookies(data: {
  access_token: string
  access_token_exp: number
  refresh_token?: string
  refresh_token_exp?: number
}) {
  const now = Math.floor(Date.now() / 1000)
  const accessMaxAge = data.access_token_exp - now
  cookie.set("token", data.access_token, { maxAge: accessMaxAge })

  if (data.refresh_token && data.refresh_token_exp) {
    const refreshMaxAge = data.refresh_token_exp - now
    cookie.set("refresh_token", data.refresh_token, { maxAge: refreshMaxAge })
  }
}

export function logout() {
  console.log("Logging out...")
  localStorage.clear()
  cookie.remove("token")
  cookie.remove("refresh_token")

  toast.success("Successfully logged out")
  window.location.href = "/"
}

export function shouldRefresh(response: XiorResponse) {
  const token = cookie.get("token")

  return Boolean(token && response?.status && [401, 403].includes(response.status))
}

export async function attemptRefresh() {
  try {
    const refreshToken = cookie.get("refresh_token")

    const { data } = await xior.request<{
      access_token: string
      access_token_exp: number
    }>({
      method: "POST",
      url: "https://api.billsheba.com/api/v1/users/login/refresh",
      data: {
        refresh_token: refreshToken,
      },
    })

    setAuthCookies(data)
  } catch (_error) {
    logout()
  }
}
