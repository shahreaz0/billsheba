import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(text: string, defaultValue: string = "N/A") {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return defaultValue
  }

  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)

  if (words.length === 0) {
    return defaultValue
  }

  const initials = words
    .map((word) => word[0]?.toUpperCase() || "")
    .filter((char) => /[A-Za-z]/.test(char))
    .join("")

  return initials || defaultValue
}

export function generateAvatarUrl(name: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${name}&fontSize=41&fontWeight=600`
}

export function formatUptime(uptime: string): string {
  if (!uptime || typeof uptime !== "string") {
    return "Unknown"
  }

  // Parse the uptime string (e.g., "2w6d2h55m40s")
  const parts = uptime.match(/(\d+)w|(\d+)d|(\d+)h|(\d+)m|(\d+)s/g)

  if (!parts) {
    return uptime // Return original if can't parse
  }

  const formattedParts: string[] = []

  parts.forEach((part) => {
    const match = part.match(/(\d+)([wdhms])/)
    if (match) {
      const [, value, unit] = match
      const num = parseInt(value, 10)

      // Only show significant time units
      if (unit === "w" && num > 0) {
        formattedParts.push(`${num}w`)
      } else if (unit === "d" && num > 0) {
        formattedParts.push(`${num}d`)
      } else if (unit === "h" && num > 0) {
        formattedParts.push(`${num}h`)
      } else if (unit === "m" && num > 0 && formattedParts.length < 3) {
        formattedParts.push(`${num}m`)
      } else if (unit === "s" && num > 0 && formattedParts.length < 3) {
        formattedParts.push(`${num}s`)
      }
    }
  })

  // Limit to 3 most significant parts for better readability
  return formattedParts.slice(0, 3).join(" ") || "0s"
}
