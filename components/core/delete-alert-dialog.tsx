import { Loader } from "lucide-react"
import type { MouseEvent } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"

type Props = {
  resource: string
  onDelete: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void
  open: boolean
  setOpen: any
  loading?: boolean
}

export function DeleteAlertDialog(props: Props) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {props.resource}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={props.onDelete}
            className={cn(buttonVariants({ variant: "destructive" }))}
            disabled={props.loading}
          >
            {props.loading && <Loader className="animate-spin size-4" />}
            Permanently Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
