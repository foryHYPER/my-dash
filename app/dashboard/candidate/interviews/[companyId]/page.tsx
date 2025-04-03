// This is a server component (no 'use client' directive here)
import { Suspense } from "react"
import InterviewsClientContent from "./client-component"

// Definiere den Typ für die Parameter als Promise
export type CompanyParamsType = Promise<{ companyId: string }>;

// Server component that handles dynamic routes
export default async function CompanyInterviewsPage({ params }: { params: CompanyParamsType }) {
  // Hole die Parameter mit await
  const { companyId } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InterviewsClientContent companyId={companyId} />
    </Suspense>
  );
} 