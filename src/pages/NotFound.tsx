import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-text">
      <div className="rounded-2xl border border-white/10 bg-surface p-8 text-center">
        <div className="text-3xl font-extrabold font-heading">404</div>
        <div className="mt-2 text-sm text-muted">Page not found</div>
        <Link
          to="/dashboard"
          className="mt-4 inline-flex rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-muted"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
