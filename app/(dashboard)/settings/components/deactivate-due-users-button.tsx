"use client"
import { TrashIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDeactivateDueCustomersTask } from "@/hooks/rq/use-deactivate-due-customers"

export function DeactivateDueCustomersButton() {
  const deactivateDueCustomers = useDeactivateDueCustomersTask()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="link">
          <TrashIcon className="h-4 w-4" />
          {deactivateDueCustomers.isPending
            ? "Deactivating..."
            : "Deactivate Due Customers"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate your due customers
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deactivateDueCustomers.mutate()}
            disabled={deactivateDueCustomers.isPending}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
