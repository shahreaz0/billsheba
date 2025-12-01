import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateCustomerPayment,
  useGetCustomerPayments,
} from "@/hooks/rq/use-customers-query"
import { useCustomersStore } from "@/stores/customers-store"
import { months, paymentMethods } from "../../payments/data/data"

const formSchema = z.object({
  billingMonth: z.string().min(1, "Billing Month is required"),
  paymentMethod: z.string().min(1, "Payment Method is required"),
  amount: z.string().min(1, "Amount is required"),
  markAsPaid: z.boolean(),
})

export function CustomersPaymentHistoryTab() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      billingMonth: "",
      paymentMethod: "",
      amount: "",
      markAsPaid: false,
    },
  })

  const { selectedCustomer } = useCustomersStore()

  const {
    data: payments,
    isLoading,
    isError,
  } = useGetCustomerPayments(selectedCustomer.uid)

  const { mutate: triggerCreateCustomerPayment, isPending } = useCreateCustomerPayment(
    selectedCustomer.uid,
  )

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      billing_month: values.billingMonth,
      payment_method: values.paymentMethod,
      amount: Number(values.amount),
      paid: values.markAsPaid,
      customer_id: selectedCustomer.id,
    }
    triggerCreateCustomerPayment(payload, {
      onSuccess: () => {
        form.reset()
        toast.success("Payment added successfully")
      },
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block">🧾</span>
          <span className="font-semibold text-lg">Payment History</span>
        </div>
        <span className="text-sm text-muted-foreground mb-2 block">
          Recent payment transactions
        </span>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2 text-left">Date</th>
                <th className="py-2 px-2 text-left">Month</th>
                <th className="py-2 px-2 text-left">Amount</th>
                <th className="py-2 px-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-2 px-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="py-2 px-2 text-center text-red-500">
                    Error loading payments
                  </td>
                </tr>
              ) : payments && payments.results.length > 0 ? (
                payments.results.map((payment) => (
                  <tr key={payment.uid}>
                    <td className="py-2 px-2">
                      {payment.payment_date
                        ? format(payment.payment_date, "dd/MM/yyyy")
                        : "-"}
                    </td>
                    <td className="py-2 px-2">{payment.billing_month || "-"}</td>
                    <td className="py-2 px-2">
                      {payment.amount ? `BDT ${payment.amount}` : "-"}
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${payment.paid ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                      >
                        {payment.paid ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-2 px-2 text-center">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full lg:max-w-xs rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="font-semibold text-lg mb-2">Quick Actions</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="billingMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Month</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            <m.icon className="mr-2 h-4 w-4 inline-block" /> {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((pm) => (
                          <SelectItem key={pm.value} value={pm.value}>
                            <pm.icon className="mr-2 h-4 w-4 inline-block" /> {pm.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="markAsPaid"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Mark as paid</FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              loading={isPending}
            >
              <Plus />
              Add Payment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
