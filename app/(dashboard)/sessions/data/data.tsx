import type { Session } from "./schema"
import { sessions } from "./seed"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getSessions(): Promise<Session[]> {
  await delay(1000)
  return sessions
}
