import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  resetOrganizationsStore,
  useOrganizationsStore,
} from "@/stores/organizations-store"
import { OrganizationsUpsertForm } from "./organizations-upsert-form"

export function UpsertOrganizationsDialog() {
  const {
    isUpsertOrganizationDialogOpen,
    setIsUpsertOrganizationDialogOpen,
    organizationMutationType,
  } = useOrganizationsStore()

  const title =
    organizationMutationType === "add" ? "Add Organization" : "Edit Organization"
  const description =
    organizationMutationType === "add"
      ? "Add a new organization to the system. You can set up their profile, settings, and more."
      : "Edit the existing organization. You can update content, settings, and other details."

  return (
    <Dialog
      open={isUpsertOrganizationDialogOpen}
      onOpenChange={() => {
        resetOrganizationsStore("selectedOrganization")
        setIsUpsertOrganizationDialogOpen(false)
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-[100vw] rounded-none md:rounded-lg md:!max-w-[70vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <OrganizationsUpsertForm />
      </DialogContent>
    </Dialog>
  )
}
