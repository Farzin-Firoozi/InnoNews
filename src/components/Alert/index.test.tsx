import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import Alert from './index'

describe('Alert component', () => {
  it('renders children with alert role and message', () => {
    render(<Alert>Failed to fetch articles</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('Failed to fetch articles')
  })
})
