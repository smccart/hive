import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-lg text-neutral-400 mb-8">This page doesn't exist.</p>
      <Link
        to="/"
        className="text-sm font-medium text-brand hover:text-white transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}
