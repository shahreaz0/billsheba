"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Globe } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/hooks/rq/use-auth-query"

const formSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(1, "Password is required"),
})

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: triggerLogin, isPending } = useLogin()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    triggerLogin(values)
  }

  return (
    <Card className="w-full max-w-md border-0 bg-card/50 shadow-xl backdrop-blur">
      <CardHeader className="space-y-4 pb-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Globe className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-2xl text-foreground">Welcome Back</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Sign in to your Billsheba account
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-medium text-sm">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11"
                      placeholder="Enter your phone number"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-medium text-sm">Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        className="h-11 pr-10"
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-11 w-full font-medium text-base shadow-lg"
              disabled={isPending}
              loading={isPending}
            >
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
