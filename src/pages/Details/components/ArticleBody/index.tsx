import { useMemo } from 'react'

import { paragraphLabel, parseParagraphs } from '@/pages/Details/utils'

import { cn } from '@/utils/cn'

import type { Article } from '@/types/article'

type ArticleBodyProps = {
  article: Article
}

const ArticleBody = ({ article }: ArticleBodyProps) => {
  const paragraphs = useMemo(() => {
    const text = [article.description, article.content]
      .filter(Boolean)
      .join('\n\n')

    return text ? parseParagraphs(text).slice(0, 15) : []
  }, [article.description, article.content])

  const toc = useMemo(
    () =>
      paragraphs.map((text, i) => ({
        id: `p-${i}`,
        label: paragraphLabel(text),
      })),
    [paragraphs],
  )

  if (paragraphs.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_240px]">
      <div className="flex flex-col gap-5">
        {paragraphs.map((text, i) => (
          <p
            key={i}
            id={`p-${i}`}
            className={cn(
              'scroll-mt-24 text-justify text-base leading-relaxed text-stone-700',
              i === 0 &&
                'first-letter:font-oranienbaum first-letter:float-left first-letter:pt-1 first-letter:pr-1 first-letter:text-6xl first-letter:leading-[0.8]',
            )}
          >
            {text}
          </p>
        ))}
      </div>

      {toc.length > 1 && (
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-3 border-l border-stone-200 pl-5">
            <span className="text-xs font-medium tracking-[0.15em] text-stone-500">
              Table of Contents
            </span>

            <nav className="flex flex-col gap-2">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm text-stone-700 transition hover:text-blue-600"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </div>
  )
}

export default ArticleBody
