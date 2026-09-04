import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import SmartImage from './index'

describe('SmartImage component', () => {
  it('renders image when src is provided', () => {
    render(<SmartImage src="https://example.com/photo.jpg" alt="Photo" />)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
    expect(img).toHaveAttribute('alt', 'Photo')
  })

  it('renders placeholder icon when src is null or missing', () => {
    render(<SmartImage alt="Missing Photo" />)
    const placeholder = screen.getByRole('img', { name: 'Missing Photo' })
    expect(placeholder).toBeInTheDocument()
  })

  it('transitions to opacity-100 on load', () => {
    render(<SmartImage src="https://example.com/photo.jpg" alt="Photo" />)
    const img = screen.getByRole('img')
    expect(img).toHaveClass('opacity-0')
    fireEvent.load(img)
    expect(img).toHaveClass('opacity-100')
  })

  it('falls back to placeholder on image load error', () => {
    render(
      <SmartImage src="https://example.com/broken.jpg" alt="Broken Photo" />,
    )
    const img = screen.getByRole('img')
    fireEvent.error(img)
    // After error, fallback div is rendered
    const fallback = screen.getByRole('img', { name: 'Broken Photo' })
    expect(fallback.tagName).toBe('DIV')
  })
})
