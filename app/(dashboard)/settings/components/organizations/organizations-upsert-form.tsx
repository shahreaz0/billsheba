"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Save, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod/v3"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  useCreateOrganization,
  useUpdateOrganization,
} from "@/hooks/rq/use-organizations-query"
import { removeEmptyFields } from "@/lib/utils"
import { useOrganizationsStore } from "@/stores/organizations-store"

export const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required").max(20),
  email: z.string().email("Invalid email").max(254),
  website: z.string().url("Invalid URL").max(200).optional(),
  subscription: z.string().optional(),
  subscription_status: z.enum(["ACTIVE", "EXPIRED", "CANCELLED", "PENDING"]).optional(),
  allowed_customer: z.number().min(0).optional(),
  total_customer: z.number().min(0).optional(),
  router_ip: z.string().max(64).optional(),
  router_username: z.string().max(150).optional(),
  router_password: z.string().max(128).optional(),
  router_port: z.number().min(1).max(65535).optional(),
  router_secret: z.string().max(150).optional(),
  router_ssl: z.boolean().optional(),
})

export function OrganizationsUpsertForm() {
  const { setIsUpsertOrganizationDialogOpen, organizationMutationType } =
    useOrganizationsStore()

  const { mutate: triggerCreateOrganization, isPending: isCreateOrganizationPending } =
    useCreateOrganization()
  const { mutate: triggerUpdateOrganization, isPending: isUpdateOrganizationPending } =
    useUpdateOrganization()

  const { selectedOrganization } = useOrganizationsStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedOrganization.name || undefined,
      address: selectedOrganization.address || undefined,
      phone: selectedOrganization.phone || undefined,
      email: selectedOrganization.email || undefined,
      website: selectedOrganization.website || undefined,
      subscription: selectedOrganization.subscription?.toString() || undefined,
      subscription_status: selectedOrganization.subscription_status || "PENDING",
      allowed_customer: selectedOrganization.allowed_customer || undefined,
      total_customer: selectedOrganization.total_customer || undefined,
      router_ip: undefined,
      router_username: undefined,
      router_password: undefined,
      router_port: selectedOrganization.router_port || undefined,
      router_secret: undefined,
      router_ssl: selectedOrganization.router_ssl || false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      subscription: values.subscription ? +values.subscription : null,
    }

    if (organizationMutationType === "edit") {
      triggerUpdateOrganization(
        { payload: removeEmptyFields(payload), uid: selectedOrganization.uid },
        {
          onSuccess: () => setIsUpsertOrganizationDialogOpen(false),
        },
      )
    } else {
      triggerCreateOrganization(payload, {
        onSuccess: () => setIsUpsertOrganizationDialogOpen(false),
      })
    }
  }

  const isLoading = isCreateOrganizationPending || isUpdateOrganizationPending

  function getSubmitButtonText() {
    if (isLoading) return "Saving..."
    if (organizationMutationType === "add") return "Create"
    return "Update"
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className={organizationMutationType === "edit" ? "md:col-span-2" : ""}>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of the organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Subscription Information */}
          {organizationMutationType === "add" && (
            <Card>
              <CardHeader>
                <CardTitle>Subscription Information</CardTitle>
                <CardDescription>
                  Configure subscription and customer limits.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="subscription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter subscription ID"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscription_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="EXPIRED">Expired</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowed_customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allowed Customers</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter allowed customers"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="total_customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Customers</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter total customers"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Router Configuration */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Router Configuration</CardTitle>
              <CardDescription>
                Configure Mikrotik router settings for this organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="router_ip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Router IP</FormLabel>
                      <FormControl>
                        <Input placeholder="192.168.1.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="router_port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Router Port</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="8728"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="router_username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Router Username</FormLabel>
                      <FormControl>
                        <Input placeholder="admin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="router_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Router Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="router_secret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Router Secret</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter secret" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="router_ssl"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Use SSL</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsUpsertOrganizationDialogOpen(false)}
          >
            <X />
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save />
            {getSubmitButtonText()}
          </Button>
        </div>
      </form>
    </Form>
  )
}
