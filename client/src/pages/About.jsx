import { Link } from 'react-router'
import {
  ArrowRight,
  BellRing,
  Boxes,
  ChevronRight,
  Database,
  Monitor,
  Network,
  Palette,
  Server,
  Zap,
} from 'lucide-react'

const stack = [
  { icon: Server, name: 'ASP.NET Core', role: 'REST API with controllers', layer: 'Backend' },
  { icon: Database, name: 'EF Core + SQLite', role: 'ORM, migrations, file database', layer: 'Backend' },
  { icon: Monitor, name: 'React 19', role: 'Component-based UI', layer: 'Frontend' },
  { icon: Zap, name: 'Vite', role: 'Dev server and bundler', layer: 'Frontend' },
  { icon: Boxes, name: 'Zustand', role: 'Lightweight shared state', layer: 'Frontend' },
  { icon: Network, name: 'Axios', role: 'HTTP client for the API', layer: 'Frontend' },
  { icon: Palette, name: 'Tailwind CSS 4', role: 'Utility-first styling', layer: 'Frontend' },
  { icon: BellRing, name: 'Sonner', role: 'Toast notifications', layer: 'Frontend' },
]

const flow = ['React UI', 'Axios', 'ASP.NET Core API', 'EF Core', 'SQLite']

const endpoints = [
  { method: 'GET', path: '/api/people', text: 'List everyone' },
  { method: 'GET', path: '/api/people/{id}', text: 'Get one person' },
  { method: 'POST', path: '/api/people', text: 'Create a person' },
  { method: 'PUT', path: '/api/people/{id}', text: 'Update a person' },
  { method: 'DELETE', path: '/api/people/{id}', text: 'Remove a person' },
]

const methodColors = {
  GET: 'bg-sky-100 text-sky-700',
  POST: 'bg-emerald-100 text-emerald-700',
  PUT: 'bg-amber-100 text-amber-700',
  DELETE: 'bg-rose-100 text-rose-700',
}

function About() {
  return (
    <div className="flex flex-col gap-14">
      {/* Intro */}
      <section className="pt-8 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-indigo-600 uppercase">About</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          A full-stack CRUD app,{' '}
          <span className="bg-linear-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            end to end
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          PersonCrud is a practical reference project: a .NET Web API and a modern React client
          working together to manage a simple directory of people.
        </p>
      </section>

      {/* Request flow */}
      <section className="liquid-glass relative rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900">How a request travels</h2>
        <p className="mt-1 text-sm text-gray-600">
          Every action in the UI follows the same path to the database and back.
        </p>
        <ol className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {flow.map((step, index) => (
            <li key={step} className="flex flex-col items-center gap-2 sm:flex-1 sm:flex-row">
              <span className="w-full rounded-xl bg-white/70 px-3 py-2.5 text-center text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-white">
                {step}
              </span>
              {index < flow.length - 1 && (
                <ChevronRight className="h-5 w-5 shrink-0 rotate-90 text-indigo-400 sm:rotate-0" />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Tech stack */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Built with</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map(({ icon: Icon, name, role, layer }) => (
            <article
              key={name}
              className="liquid-glass relative rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-linear-to-br from-indigo-500 to-pink-500 p-2 text-white shadow">
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    layer === 'Backend' ? 'bg-violet-100 text-violet-700' : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {layer}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{name}</h3>
              <p className="mt-0.5 text-sm text-gray-600">{role}</p>
            </article>
          ))}
        </div>
      </section>

      {/* API */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">The API</h2>
        <p className="mt-1 text-gray-600">Five endpoints cover the whole lifecycle of a person.</p>
        <ul className="liquid-glass relative mt-6 divide-y divide-gray-900/5 overflow-hidden rounded-2xl">
          {endpoints.map(({ method, path, text }) => (
            <li key={method + path} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <span
                className={`w-16 rounded-md py-0.5 text-center text-xs font-bold ${methodColors[method]}`}
              >
                {method}
              </span>
              <code className="font-mono text-sm text-gray-800">{path}</code>
              <span className="text-sm text-gray-500 sm:ml-auto">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-linear-to-r from-indigo-600 via-violet-600 to-pink-500 p-8 text-center text-white shadow-xl shadow-indigo-500/30 sm:p-10">
        <h2 className="text-2xl font-bold sm:text-3xl">See it in action</h2>
        <p className="mx-auto mt-2 max-w-md text-white/85">
          Add your first person and watch the whole stack respond.
        </p>
        <Link
          to="/person"
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
        >
          Open the Person page
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  )
}

export default About
