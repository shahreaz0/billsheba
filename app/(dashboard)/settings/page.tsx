import type { Metadata } from "next"
import { SettingsContent } from "./components/settings-content"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your application settings",
}

export default async function SettingsPage() {
  return <SettingsContent />
}
