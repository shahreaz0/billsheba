"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Save, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod/v3"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreatePackage, useUpdatePackage } from "@/hooks/rq/use-packages-query"
import { usePackagesStore } from "@/stores/packages-store"

const formSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  speed_mbps: z.coerce.number().int().nonnegative().optional(),
  price: z.string().min(1, "Price is required").optional(),
  description: z.string().optional(),
})

export function PackagesUpsertForm() {
  const { mutate: triggerCreatePackage, isPending: isCreatePackagePending } =
    useCreatePackage()
  const { mutate: triggerUpdatePackage, isPending: isUpdatePackagePending } =
    useUpdatePackage()
  const { setIsUpsertPackageDialogOpen, packageMutationType, selectedPackage } =
    usePackagesStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedPackage?.name,
      speed_mbps: selectedPackage?.speed_mbps,
      price: selectedPackage?.price,
      description: selectedPackage?.description || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (packageMutationType === "edit" && selectedPackage?.uid) {
      triggerUpdatePackage(
        { payload: values, uid: selectedPackage.uid },
        {
          onSuccess: () => setIsUpsertPackageDialogOpen(false),
        },
      )
      return
    }
    triggerCreatePackage(values, {
      onSuccess: () => setIsUpsertPackageDialogOpen(false),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Package Name<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter package name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="speed_mbps"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Speed (Mbps)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (BDT)</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter package description..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsUpsertPackageDialogOpen(false)}
          >
            <X />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreatePackagePending || isUpdatePackagePending}
            loading={isCreatePackagePending || isUpdatePackagePending}
          >
            <Save />
            {packageMutationType === "edit" ? "Update Package" : "Create Package"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
