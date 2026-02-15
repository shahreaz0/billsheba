import { toast } from "sonner"
import xior, { type XiorResponse } from "xior"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return null
}

export function setAuthCookies(data: {
  access_token: string
  access_token_exp: number
  refresh_token?: string
  refresh_token_exp?: number
}) {
  const now = Math.floor(Date.now() / 1000)
  const accessMaxAge = data.access_token_exp - now
  document.cookie = `token=${data.access_token}; path=/; max-age=${accessMaxAge}; secure; samesite=lax`

  if (data.refresh_token && data.refresh_token_exp) {
    const refreshMaxAge = data.refresh_token_exp - now
    document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=${refreshMaxAge}; secure; samesite=lax`
  }
}

export function logout() {
  console.log("Logging out...")
  localStorage.clear()
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

  toast.success("Successfully logged out")
  window.location.href = "/"
}

export function shouldRefresh(response: XiorResponse) {
  const token = getCookie("token")

  return Boolean(token && response?.status && [401, 403].includes(response.status))
}

export async function attemptRefresh() {
  try {
    const refreshToken = getCookie("refresh_token")

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
  } catch (error) {
    logout()
  }
}
