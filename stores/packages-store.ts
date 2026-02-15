import { createStore } from "stan-js"

import type { Package } from "@/types/packages"

export const { useStore: usePackagesStore, reset: resetPacksgesStore } = createStore({
  isViewPackageDialogOpen: false,
  isUpsertPackageDialogOpen: false,
  packageMutationType: "" as "add" | "edit",
  selectedPackage: {} as Package,
})
