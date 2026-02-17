import { Suspense } from "react"
import { StatsGrid } from "./widgets/stats-grid"
import { StatsGridSkeleton } from "./widgets/stats-grid-skeleton"

export default function Page() {
  return (
    <main className="container mx-auto space-y-4">
      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGrid />
      </Suspense>
    </main>
  )
}
