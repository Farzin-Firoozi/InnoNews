import { Button } from '@heroui/react'
import { Newspaper, Sparkles } from 'lucide-react'

export function App() {
  return (
    <main className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-6 font-roboto">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600">
            <Newspaper className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-oranienbaum text-3xl font-bold tracking-tight">
              InnoNews Aggregator
            </h1>
            <p className="text-sm text-slate-500">
              Default font: Roboto | Heading override: Oranienbaum
            </p>
          </div>
        </div>
        <Button variant="primary" className="font-medium">
          <Sparkles className="w-4 h-4 mr-1.5" />
          Ready
        </Button>
      </header>

      <section className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-oranienbaum text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Editorial Headline in Oranienbaum
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
          This body text is rendered with the default <strong className="font-semibold text-slate-800 dark:text-slate-200">Roboto</strong> font.
          You can override any element (titles, quotes, cards, etc.) with the classname <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-600 text-sm font-mono font-normal">font-oranienbaum</code>.
        </p>
      </section>
    </main>
  )
}

export default App

