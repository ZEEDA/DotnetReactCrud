import { Toaster } from 'sonner'
import { CircleCheck, CircleX, Info, LoaderCircle, TriangleAlert } from 'lucide-react'

// App-wide toast host: frosted cards with a colored accent per type
function AppToaster() {
  return (
    <Toaster
      position="top-right"
      closeButton
      duration={4000}
      visibleToasts={4}
      icons={{
        success: <CircleCheck className="h-5 w-5 text-emerald-500" />,
        error: <CircleX className="h-5 w-5 text-rose-500" />,
        warning: <TriangleAlert className="h-5 w-5 text-amber-500" />,
        info: <Info className="h-5 w-5 text-sky-500" />,
        loading: <LoaderCircle className="h-5 w-5 animate-spin text-indigo-500" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-full items-start gap-3 rounded-xl border border-white/60 border-l-4 bg-white/80 py-4 pl-4 pr-10 shadow-lg shadow-indigo-900/10 backdrop-blur-md',
          title: 'text-sm font-semibold text-gray-900',
          description: 'mt-0.5 text-sm text-gray-600',
          // Sized, positioned box: sonner centers the spinner absolutely inside it
          icon: 'relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center',
          closeButton:
            'absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-900/5 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-indigo-500 [&>svg]:h-3.5 [&>svg]:w-3.5',
          success: '!border-l-emerald-500',
          error: '!border-l-rose-500',
          warning: '!border-l-amber-500',
          info: '!border-l-sky-500',
          loading: '!border-l-indigo-500',
        },
      }}
    />
  )
}

export default AppToaster
