import { createStore } from "stan-js"

import type { Organization } from "@/types/organizations"

export const { useStore: useOrganizationsStore, reset: resetOrganizationsStore } =
  createStore({
    isViewOrganizationDialogOpen: false,
    isUpsertOrganizationDialogOpen: false,
    organizationMutationType: "" as "add" | "edit",
    selectedOrganization: {} as Organization,
  })
