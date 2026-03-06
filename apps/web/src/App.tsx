import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import SiteLayout from '@/layouts/SiteLayout'
import DocsLayout from '@/layouts/DocsLayout'
import ErrorBoundary from '@/components/ErrorBoundary'

const HomePage         = lazy(() => import('@/pages/HomePage'))
const NotFoundPage     = lazy(() => import('@/pages/NotFoundPage'))
const DocsIndexPage    = lazy(() => import('@/pages/DocsIndexPage'))
const Introduction     = lazy(() => import('@/pages/docs/introduction.mdx'))
const Installation     = lazy(() => import('@/pages/docs/installation.mdx'))
const Configuration    = lazy(() => import('@/pages/docs/configuration.mdx'))
const Usage            = lazy(() => import('@/pages/docs/usage.mdx'))
const ApiReference     = lazy(() => import('@/pages/docs/api-reference.mdx'))

function DocPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-8 text-neutral-400">Loading...</div>}>{children}</Suspense>
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={<DocPage><DocsIndexPage /></DocPage>} />
              <Route path="introduction"  element={<DocPage><Introduction /></DocPage>} />
              <Route path="installation"  element={<DocPage><Installation /></DocPage>} />
              <Route path="configuration" element={<DocPage><Configuration /></DocPage>} />
              <Route path="usage"         element={<DocPage><Usage /></DocPage>} />
              <Route path="api-reference" element={<DocPage><ApiReference /></DocPage>} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
