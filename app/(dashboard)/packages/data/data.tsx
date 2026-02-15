// import { CircleOff, } from "lucide-react";

import {
  AnchorIcon,
  BadgeCheckIcon,
  BadgeXIcon,
  NetworkIcon,
  WorkflowIcon,
} from "lucide-react"

export const connectionType = [
  {
    value: "PPPoE",
    label: "PPPoE",
    icon: NetworkIcon,
  },
  {
    value: "DHCP",
    label: "DHCP",
    icon: WorkflowIcon,
  },
  {
    value: "STATIC",
    label: "STATIC",
    icon: AnchorIcon,
  },
]

export const customerStatus = [
  {
    label: "Active",
    value: "true",
    icon: BadgeCheckIcon,
  },
  {
    label: "Inactive",
    value: "false",
    icon: BadgeXIcon,
  },
]

// export const customerPaymentType = [
//   {
//     label: "Free",
//     value: true,
//     icon: Lock,
//   },
//   {
//     label: "Paid",
//     value: false,
//     icon: LockOpen,
//   },
// ]

export const packages = []
