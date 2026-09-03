import BrandName from '@/components/BrandName'

const Footer = () => {
  return (
    <footer className="border-stone-200 bg-white border-t">
      <div className="container">
        <div className="flex flex-col gap-4">
          <BrandName />

          <p className="text-stone-500 max-w-md text-sm leading-relaxed">
            Craft narratives that ignite inspiration, knowledge, and
            entertainment — aggregated from the sources you trust.
          </p>
        </div>

        <div className="border-stone-200 text-stone-500 mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row">
          <p>Copyright &copy; {new Date().getFullYear()} InnoNews.</p>
          <a
            href="#top"
            className="border-stone-200 text-stone-700 hover:border-blue-600 hover:text-blue-600 rounded-full border px-3 py-1.5 transition"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
