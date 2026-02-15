import { createStore } from "stan-js"
import type { User } from "@/types/users"

export const { useStore: useUsersStore, reset: resetUsersStore } = createStore({
  isViewUserDialogOpen: false,
  isUpsertUserDialogOpen: false,
  userMutationType: "" as "add" | "edit",
  selectedUser: {} as User,
})
