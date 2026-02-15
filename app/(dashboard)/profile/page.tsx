import { KeyRound, UserCircle } from "lucide-react"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChangePasswordForm } from "./components/password-form"
import { ProfileForm } from "./components/profile-form"
import ProfileHeader from "./components/profile-header"

export default function ProfilePage() {
  return (
    <div>
      <ErrorBoundary fallback={null}>
        <Suspense
          fallback={
            <div className="flex gap-5">
              <Skeleton className="size-20 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-8 w-[400px]" />
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-5 w-[200px]" />
              </div>
            </div>
          }
        >
          <ProfileHeader />
        </Suspense>
      </ErrorBoundary>
      <div className="container max-w-md py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-x-2">
              <UserCircle className="h-4 w-4" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-x-2">
              <KeyRound className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
