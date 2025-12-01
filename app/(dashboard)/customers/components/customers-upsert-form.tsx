"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Save, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { PasswordInput } from "@/components/ui/password-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/rq/use-customers-query"
import { useGetPackageList } from "@/hooks/rq/use-packages-query"
import { useCustomersStore } from "@/stores/customers-store"
import { connectionType } from "../data/data"

export const formSchema = z.object({
  name: z.string({ error: "Name is required" }).min(1, "Name is required").max(255),
  phone: z
    .string({ error: "Phone number is required" })
    .trim()
    .regex(/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
      message: "Invalid Bangladeshi phone number",
    }),
  package_id: z.string({ error: "Package is required" }),
  connection_type: z.enum(["DHCP", "STATIC", "PPPoE"], "Connection type is required"),
  username: z
    .string({ error: "Username is required" })
    .max(30, "Too long")
    .regex(/^(?![._])(?!.*[._]{2})[a-zA-Z0-9._]+(?<![._])$/, "Invalid format"),
  password: z.string({ error: "Password is required" }).min(5).max(128),

  // optional fields
  email: z.email("Invalid email").max(254).optional(),
  address: z.string().max(255).optional(),
  nid: z
    .string()
    .trim()
    .regex(/^\d{10}$|^\d{13}$|^\d{17}$/, {
      message: "Invalid Bangladeshi NID number (must be 10, 13, or 17 digits)",
    })
    .optional(),
  is_free: z.boolean().optional(),
  connection_start_date: z.string().nullish(),
  is_active: z.boolean().optional(),
  ip_address: z.string().optional(),
  mac_address: z.string().max(32).optional(),
  credentials: z.any().optional(),
})

export function CustomersUpsertForm() {
  const { setIsUpsertCustomerDialogOpen, customerMutationType } = useCustomersStore()

  const { mutate: triggerCreateCustomer, isPending: isCreateCustomerPending } =
    useCreateCustomer()
  const { mutate: triggerUpdateCustomer, isPending: isUpdateCustomerPending } =
    useUpdateCustomer()

  const { data: packageData } = useGetPackageList()

  const { selectedCustomer } = useCustomersStore()

  const packages = packageData?.results || []

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedCustomer.name,
      phone: selectedCustomer?.phone,
      email: selectedCustomer?.email || undefined,
      address: selectedCustomer?.address || undefined,
      nid: selectedCustomer?.nid,
      is_free: selectedCustomer?.is_free,
      package_id: selectedCustomer?.package?.id.toString(),
      connection_start_date: null,
      is_active: selectedCustomer?.is_active,
      ip_address: selectedCustomer?.ip_address,
      mac_address: selectedCustomer?.mac_address,
      username: selectedCustomer?.username,
      password: selectedCustomer?.password,
      connection_type: selectedCustomer?.connection_type,
      // credentials: {},
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      package_id: values.package_id ? +values.package_id : undefined,
    }

    if (customerMutationType === "edit") {
      triggerUpdateCustomer(
        { payload, uid: selectedCustomer.uid },
        {
          onSuccess: () => setIsUpsertCustomerDialogOpen(false),
        },
      )

      return
    }

    triggerCreateCustomer(payload, {
      onSuccess: () => setIsUpsertCustomerDialogOpen(false),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the customer’s basic details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 items-start">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
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
                  <FormLabel>
                    Phone Number<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>+88</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        placeholder="1844668099"
                        className="!pl-0.5"
                      />
                    </InputGroup>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter NID" {...field} />
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Enter address" {...field} /> */}
                    <Textarea placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package & Status</CardTitle>
            <CardDescription>Select package and set customer status</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 items-start">
            <FormField
              control={form.control}
              name="package_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Package<span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {packages.map((pack) => (
                        <SelectItem key={pack.uid} value={pack.id.toString()}>
                          {pack.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="connection_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Connection Type<span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select connection type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {connectionType.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <type.icon /> {type.label}
                        </SelectItem>
                      ))}
                      {/* <SelectItem value="PPPoE">PPPoE</SelectItem>
                      <SelectItem value="STATIC">Static</SelectItem>
                      <SelectItem value="DHCP">DHCP</SelectItem> */}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-6 md:col-span-2">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Active Customer</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_free"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Free Customer</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Configuration</CardTitle>
            <CardDescription>Configure network settings and credentials</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 items-start">
            <FormField
              control={form.control}
              name="ip_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IP address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mac_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MAC Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter MAC address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Username<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsUpsertCustomerDialogOpen(false)}
          >
            <X />
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isCreateCustomerPending || isUpdateCustomerPending}
            disabled={isCreateCustomerPending || isUpdateCustomerPending}
          >
            <Save />
            {customerMutationType === "edit" ? "Update Customer" : "Create Customer"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
