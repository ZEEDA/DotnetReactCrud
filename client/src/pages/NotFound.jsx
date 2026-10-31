import { ArrowLeft, Compass, House } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'

function NotFound() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <section className="flex min-h-[70svh] items-center justify-center">
      <div className="liquid-glass relative w-full max-w-lg overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-10">
        {/* Glow behind the 404 */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400 opacity-40 blur-3xl" />

        <span className="mx-auto mb-6 flex h-14 w-14 animate-[spin_12s_linear_infinite] items-center justify-center rounded-2xl bg-white/70 text-indigo-600 shadow-sm ring-1 ring-white/80">
          <Compass className="h-7 w-7" />
        </span>

        <h1 className="bg-linear-to-br from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-8xl font-black tracking-tighter text-transparent sm:text-9xl">
          404
        </h1>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          Lost in space
        </h2>
        <p className="mt-2 text-gray-600">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>

        <code className="mt-4 inline-block max-w-full truncate rounded-full bg-gray-900/5 px-4 py-1.5 text-sm text-gray-500">
          {pathname}
        </code>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2.5 font-semibold text-white shadow-md shadow-purple-500/30 transition-transform hover:scale-105 active:scale-95"
          >
            <House className="h-4 w-4" />
            Back to home
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-full bg-white/70 px-6 py-2.5 font-semibold text-gray-800 shadow-sm ring-1 ring-white/80 transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    </section>
  )
}

export default NotFound
