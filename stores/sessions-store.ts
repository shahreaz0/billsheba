import { createStore } from "stan-js"
import type { Session } from "@/types/sessions"

export const { useStore: useSessionsStore, reset: resetSessionsStore } = createStore({
  isViewSessionDialogOpen: false,
  selectedSession: {} as Session,
})
