import { useEffect } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  BellRing,
  Pencil,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import usePersonStore from '../stores/personStore'

const features = [
  {
    icon: UserPlus,
    title: 'Add people',
    text: 'Create records in seconds with a focused form that validates as you type.',
    accent: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Pencil,
    title: 'Edit in place',
    text: 'Pick anyone from the list to load them into the form, change, and save.',
    accent: 'from-sky-500 to-indigo-500',
  },
  {
    icon: Trash2,
    title: 'Delete safely',
    text: 'Every delete asks for confirmation first, so nothing disappears by accident.',
    accent: 'from-pink-500 to-rose-500',
  },
  {
    icon: ShieldCheck,
    title: 'Validated twice',
    text: 'The same rules run in the browser and on the server, so data stays clean.',
    accent: 'from-emerald-500 to-teal-500',
  },
]

const steps = [
  { title: 'Open the Person page', text: 'Everyone stored in the database loads automatically.' },
  { title: 'Fill in the form', text: 'First and last name, up to 30 characters each.' },
  { title: 'Get instant feedback', text: 'A toast confirms each save or explains what went wrong.' },
]

function Home() {
  const people = usePersonStore((state) => state.people)

  // Fetch so the live count is accurate even before visiting the Person page
  useEffect(() => {
    usePersonStore.getState().loadPeople()
  }, [])

  return (
    <div className="flex flex-col gap-16">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 pt-8 text-center">
        <span className="liquid-glass relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-700">
          <Sparkles className="h-4 w-4" />
          ASP.NET Core + React
        </span>
        <h1 className="max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-6xl sm:leading-tight">
          Manage your people,{' '}
          <span className="bg-linear-to-r from-indigo-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            beautifully simple
          </span>
        </h1>
        <p className="max-w-xl text-lg text-gray-600">
          A clean, fast directory for creating, editing, and removing people, backed by a real
          REST API and database.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/person"
            className="group flex items-center gap-2 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl hover:shadow-indigo-500/40"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/about"
            className="liquid-glass relative rounded-full px-6 py-3 font-semibold text-gray-800 transition hover:bg-white/40"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Live stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="liquid-glass relative flex items-center gap-4 rounded-2xl p-5">
          <span className="rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 p-3 text-white shadow-md">
            <Users className="h-6 w-6" />
          </span>
          <div>
            <p className="text-3xl font-bold text-gray-900">{people.length}</p>
            <p className="text-sm text-gray-600">People in the directory</p>
          </div>
        </div>
        <div className="liquid-glass relative flex items-center gap-4 rounded-2xl p-5">
          <span className="rounded-xl bg-linear-to-br from-sky-500 to-indigo-500 p-3 text-white shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-3xl font-bold text-gray-900">2×</p>
            <p className="text-sm text-gray-600">Client + server validation</p>
          </div>
        </div>
        <div className="liquid-glass relative flex items-center gap-4 rounded-2xl p-5">
          <span className="rounded-xl bg-linear-to-br from-pink-500 to-rose-500 p-3 text-white shadow-md">
            <BellRing className="h-6 w-6" />
          </span>
          <div>
            <p className="text-3xl font-bold text-gray-900">Live</p>
            <p className="text-sm text-gray-600">Feedback on every action</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Everything you need</h2>
          <p className="mt-2 text-gray-600">The full create, read, update, delete cycle, done right.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text, accent }) => (
            <article
              key={title}
              className="liquid-glass relative rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span
                className={`inline-flex rounded-xl bg-linear-to-br ${accent} p-3 text-white shadow-md`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-gray-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="liquid-glass relative rounded-3xl p-6 sm:p-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Up and running in three steps</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {steps.map(({ title, text }, index) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-pink-500 font-bold text-white shadow-md">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link
          to="/person"
          className="group mt-8 inline-flex items-center gap-2 font-semibold text-indigo-700 hover:text-indigo-900"
        >
          Go to the Person page
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  )
}

export default Home
