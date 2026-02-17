"use client"

import { format } from "date-fns"
import {
  BadgeCheckIcon,
  BadgeXIcon,
  Calendar,
  Edit2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetOrganizationList } from "@/hooks/rq/use-organizations-query"
import { generateAvatarUrl, getInitials } from "@/lib/utils"
import { useOrganizationsStore } from "@/stores/organizations-store"
import { UpsertOrganizationsDialog } from "./upsert-organizations-dialog"

export function OrganizationDetails() {
  const { data: organizationsData, isLoading } = useGetOrganizationList()
  const {
    setSelectedOrganization,
    setOrganizationMutationType,
    setIsUpsertOrganizationDialogOpen,
  } = useOrganizationsStore()

  const organization = organizationsData?.results?.[0]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
          </Card>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed bg-muted/20">
        <p className="text-muted-foreground">No organization data found.</p>
      </div>
    )
  }

  const statusConfig = {
    ACTIVE: {
      variant: "default" as const,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      icon: BadgeCheckIcon,
      label: "Active",
    },
    EXPIRED: {
      variant: "destructive" as const,
      className: "bg-red-500/10 text-red-600 border-red-500/20",
      icon: BadgeXIcon,
      label: "Expired",
    },
    CANCELLED: {
      variant: "secondary" as const,
      className: "",
      label: "Cancelled",
    },
    PENDING: {
      variant: "outline" as const,
      className: "",
      label: "Pending",
    },
  }

  const config = statusConfig[organization.subscription_status] || statusConfig.PENDING
  const capacityPercentage = Math.round(
    (organization.total_customer / organization.allowed_customer) * 100,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
        <div className="flex items-center gap-5">
          <Avatar className="h-16 w-16 rounded-xl border-2 border-primary/10 shadow-sm">
            <AvatarImage
              src={organization.logo || generateAvatarUrl(organization.name)}
            />
            <AvatarFallback className="text-xl font-bold bg-primary/5 text-primary">
              {getInitials(organization.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">{organization.name}</h2>
              <Badge variant={config.variant} className={config.className}>
                {config.label}
              </Badge>
            </div>
            <div className="flex items-center text-muted-foreground gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>{organization.address}</span>
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedOrganization(organization)
            setOrganizationMutationType("edit")
            setIsUpsertOrganizationDialogOpen(true)
          }}
          className="gap-2"
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="shadow-none border-primary/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-primary/5 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Phone</span>
                <span className="font-medium">{organization.phone}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-primary/5 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Email</span>
                <span className="font-medium">{organization.email}</span>
              </div>
            </div>
            {organization.website && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-primary/5 text-primary">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Website</span>
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {organization.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage & Status */}
        <Card className="shadow-none border-primary/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Subscription & Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Customer Capacity</span>
                </div>
                <span className="font-semibold">
                  {organization.total_customer} / {organization.allowed_customer}
                </span>
              </div>
              <Progress value={capacityPercentage} className="h-2 bg-primary/10" />
              <p className="text-[11px] text-muted-foreground text-right">
                {capacityPercentage}% of total capacity used
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Subscription Ends</span>
              </div>
              <span className="font-medium">
                {organization.subscription_end_date
                  ? format(new Date(organization.subscription_end_date), "PPP")
                  : "Lifetime Access"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Router Configuration */}
        {(organization.router_ip || organization.router_username) && (
          <Card className="shadow-none border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Router Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">IP Address</span>
                <p className="text-sm font-medium">{organization.router_ip || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Port</span>
                <p className="text-sm font-medium">{organization.router_port || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Username</span>
                <p className="text-sm font-medium">
                  {organization.router_username || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">SSL</span>
                <p className="text-sm font-medium">
                  {organization.router_ssl ? "Enabled" : "Disabled"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* <Card className="shadow-none border-primary/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium">System Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Created At</span>
              <span className="font-medium text-xs">
                {organization.created_at
                  ? format(new Date(organization.created_at), "PPP p")
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium text-xs">
                {organization.updated_at
                  ? format(new Date(organization.updated_at), "PPP p")
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <UpsertOrganizationsDialog />
    </div>
  )
}
