"use client"

import { CheckCircle, CreditCard, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { usePaymentsStore } from "@/stores/payments-store"

export function ViewPaymentsContent() {
  const { selectedPayment } = usePaymentsStore()

  if (!selectedPayment?.uid) {
    return <div>No payment selected</div>
  }

  const getStatusConfig = (paid: boolean) => {
    return paid
      ? { className: "bg-emerald-500 text-white", icon: CheckCircle, label: "Paid" }
      : { className: "bg-orange-500 text-white", icon: XCircle, label: "Pending" }
  }

  const statusConfig = getStatusConfig(selectedPayment.paid)
  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {selectedPayment.customer?.name || "Payment"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {selectedPayment.customer?.address}
            </p>
          </div>
        </div>
        <Badge className={`${statusConfig.className} text-xs px-2 py-1`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>
      <Separator />
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Payment Details</CardTitle>
          <CardDescription className="text-xs">
            Transaction and billing info
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Amount:</span>{" "}
              <span className="font-medium">BDT {selectedPayment.amount}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Billing Month:</span>{" "}
              <span className="font-medium">{selectedPayment.billing_month}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Date:</span>{" "}
              <span className="font-medium">
                {selectedPayment.payment_date
                  ? new Date(selectedPayment.payment_date).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Method:</span>{" "}
              <span className="font-medium">{selectedPayment.payment_method}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Paid:</span>{" "}
              <span className="font-medium">{selectedPayment.paid ? "Yes" : "No"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Customer:</span>{" "}
              <span className="font-medium">{selectedPayment.customer?.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
