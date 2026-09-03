const mergeFirstTwo = (paragraphs: string[]): string[] => {
  if (paragraphs.length < 2) return paragraphs
  const [first, second, ...rest] = paragraphs
  return [`${first} ${second}`.trim(), ...rest]
}

const splitBySentences = (text: string): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g)

  if (!sentences || sentences.length <= 3) return [text]

  const groups: string[] = []
  for (let i = 0; i < sentences.length; i += 3) {
    groups.push(
      sentences
        .slice(i, i + 3)
        .join(' ')
        .trim(),
    )
  }
  return groups.filter(Boolean)
}

export const parseParagraphs = (text: string): string[] => {
  const chunks = text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const paragraphs = chunks.flatMap(splitBySentences)
  return mergeFirstTwo(paragraphs)
}

export const paragraphLabel = (text: string): string => {
  const words = text.trim().split(/\s+/).slice(0, 6).join(' ')
  return text.trim().split(/\s+/).length > 6 ? `${words}…` : words
}
