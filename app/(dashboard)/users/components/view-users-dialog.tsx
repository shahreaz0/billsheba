import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUsersStore } from "@/stores/users-store"
import { ViewUsersContent } from "./view-users-content"

export function ViewUsersDialog() {
  const { isViewUserDialogOpen, setIsViewUserDialogOpen, selectedUser } = useUsersStore()

  return (
    <Dialog open={isViewUserDialogOpen} onOpenChange={setIsViewUserDialogOpen}>
      <DialogContent className="h-[90vh] max-w-[100vw] md:max-w-[70vw] rounded-none md:rounded-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedUser.first_name} {selectedUser.last_name}
          </DialogTitle>
          <DialogDescription>{selectedUser.email}</DialogDescription>
        </DialogHeader>

        <ViewUsersContent />
      </DialogContent>
    </Dialog>
  )
}
