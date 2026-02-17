import { z } from "zod"

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  subscription_status: z.enum(["ACTIVE", "EXPIRED", "CANCELLED", "PENDING"]),
  allowed_customer: z.number(),
  total_customer: z.number(),
  created_at: z.string(),
})

export type Organization = z.infer<typeof organizationSchema>
