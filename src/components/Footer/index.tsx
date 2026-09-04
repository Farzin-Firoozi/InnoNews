import BrandName from '@/components/BrandName'

const Footer = () => {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container">
        <div className="flex flex-col gap-4">
          <BrandName />

          <p className="max-w-md text-sm leading-relaxed text-stone-500">
            Craft narratives that ignite inspiration, knowledge, and
            entertainment — aggregated from the sources you trust.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-stone-200 pt-6 text-xs text-stone-500 sm:flex-row">
          <p>Copyright &copy; {new Date().getFullYear()} InnoNews.</p>
          <a
            href="#top"
            className="hover:border-brand hover:text-brand rounded-full border border-stone-200 px-3 py-1.5 text-stone-700 transition"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
