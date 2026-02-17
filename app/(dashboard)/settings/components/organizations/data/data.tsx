import { BadgeCheckIcon, BadgeXIcon, Clock, XCircle } from "lucide-react"

export const organizationStatus = [
  {
    label: "Active",
    value: "ACTIVE",
    icon: BadgeCheckIcon,
  },
  {
    label: "Expired",
    value: "EXPIRED",
    icon: BadgeXIcon,
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
    icon: XCircle,
  },
  {
    label: "Pending",
    value: "PENDING",
    icon: Clock,
  },
]
