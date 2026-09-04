import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import Chip from './Chip'

describe('Chip component', () => {
  it('renders button with label and aria-pressed state', () => {
    const handleClick = vi.fn()
    render(
      <Chip pressed={true} onClick={handleClick}>
        Technology
      </Chip>,
    )
    const button = screen.getByRole('button', { name: 'Technology' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
