import { zodResolver } from "@hookform/resolvers/zod"
import { Save, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { PasswordInput } from "@/components/ui/password-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateUser, useUpdateUser } from "@/hooks/rq/use-users-query"
import { useUsersStore } from "@/stores/users-store"
import { genders, kinds } from "../data/data"

const baseSchema = z.object({
  phone: z.string().max(20),
  email: z.string().email("Enter valid email"),
  // optionals
  first_name: z.string().max(50).optional(),
  last_name: z.string().max(50).optional(),
  gender: z.string().optional(),
  kind: z.string().optional(),
})

const addSchema = baseSchema
  .extend({
    password: z
      .string({
        error: "Required",
      })
      .min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string({
        error: "Required",
      })
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

const editSchema = baseSchema
  .extend({
    password: z.string().optional(),
    confirm_password: z.string().optional(),
  })
  .refine(
    (data) => {
      // If either password is provided during edit, they must match and meet length
      if (data.password || data.confirm_password) {
        return (
          typeof data.password === "string" &&
          typeof data.confirm_password === "string" &&
          data.password === data.confirm_password &&
          data.password.length >= 6
        )
      }
      return true
    },
    {
      message: "Passwords don't match or are too short",
      path: ["confirm_password"],
    },
  )

export function UsersUpsertForm() {
  const { setIsUpsertUserDialogOpen, userMutationType, selectedUser } = useUsersStore()
  const { mutate: triggerCreateUser, isPending: isCreateUserPending } = useCreateUser()
  const { mutate: triggerUpdateUser, isPending: isUpdateUserPending } = useUpdateUser()

  // choose schema based on mutation type
  const resolverSchema = userMutationType === "edit" ? editSchema : addSchema

  const form = useForm<z.infer<typeof resolverSchema>>({
    resolver: zodResolver(resolverSchema),
    defaultValues: {
      first_name: selectedUser?.first_name ?? "",
      last_name: selectedUser?.last_name ?? "",
      email: selectedUser?.email ?? "",
      phone: selectedUser?.phone ?? "",
      gender: selectedUser?.gender ?? "",
      kind: selectedUser?.kind ?? "",
      // image: selectedUser?.image ?? "",
    },
  })

  function onSubmit(values: z.infer<typeof resolverSchema>) {
    if (userMutationType === "edit" && selectedUser?.uid) {
      triggerUpdateUser(
        { payload: values, uid: selectedUser.uid },
        {
          onSuccess: () => setIsUpsertUserDialogOpen(false),
        },
      )
      return
    }
    triggerCreateUser(values, {
      onSuccess: () => setIsUpsertUserDialogOpen(false),
    })
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone<span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>
                    Email<span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password
                    {userMutationType === "add" && (
                      <span className="text-red-500">*</span>
                    )}{" "}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirm Password
                    {userMutationType === "add" && (
                      <span className="text-red-500">*</span>
                    )}{" "}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          <g.icon className="mr-2 h-4 w-4 inline-block" /> {g.label}
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
              name="kind"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kind</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={
                      userMutationType === "edit" && selectedUser.kind === "ADMIN"
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select kind" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userMutationType === "edit" && selectedUser.kind === "ADMIN"
                        ? kinds
                            .filter((k) => ["ADMIN"].includes(k.value))
                            .map((k) => (
                              <SelectItem key={k.value} value={k.value}>
                                <k.icon className="mr-2 h-4 w-4 inline-block" /> {k.label}
                              </SelectItem>
                            ))
                        : kinds
                            .filter(
                              (k) =>
                                !["SUPER_ADMIN", "ADMIN", "OWNER", "CUSTOMER"].includes(
                                  k.value,
                                ),
                            )
                            .map((k) => (
                              <SelectItem key={k.value} value={k.value}>
                                <k.icon className="mr-2 h-4 w-4 inline-block" /> {k.label}
                              </SelectItem>
                            ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUpsertUserDialogOpen(false)}
            >
              <X />
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isCreateUserPending || isUpdateUserPending}
              disabled={isCreateUserPending || isUpdateUserPending}
            >
              <Save />
              {userMutationType === "edit" ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
