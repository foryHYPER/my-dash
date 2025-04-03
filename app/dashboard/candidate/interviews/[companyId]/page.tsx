// This is a server component (no 'use client' directive here)
import { Suspense } from "react"
import InterviewsClientContent from "./client-component"

// Server component that handles dynamic routes
export default function CompanyInterviewsPage({
  params,
}: {
  params: { companyId: string }
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InterviewsClientContent companyId={params.companyId} />
    </Suspense>
  )
} 