"use client"
import { FileText } from "lucide-react"
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
import { useBillGeneration } from "@/hooks/rq/use-bill-generation"

export function BillGenerationButton() {
  const billGeneration = useBillGeneration()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="link">
          <FileText className="h-4 w-4" />
          {billGeneration.isPending ? "Generating..." : "Generate Bills"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will generate bills
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => billGeneration.mutate()}
            disabled={billGeneration.isPending}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
