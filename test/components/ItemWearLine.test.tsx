import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ItemWearLine } from '../../src/components/media/ItemWearLine'
import { renderWithProviders } from '../utils/render'

describe('ItemWearLine', () => {
  it('renders float and pattern from mock values', () => {
    renderWithProviders(<ItemWearLine floatValue={0.250137} paintSeed={421} />)

    expect(screen.getByText('Float 0.250137 · Pattern 421')).toBeInTheDocument()
  })

  it('renders labeled Float and Pattern in stack layout', () => {
    renderWithProviders(
      <ItemWearLine floatValue={0.073} paintSeed={7} layout="stack" />,
    )

    expect(screen.getByText('Float')).toBeInTheDocument()
    expect(screen.getByText('0.073000')).toBeInTheDocument()
    expect(screen.getByText('Pattern')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('renders nothing when float or seed is missing', () => {
    const { container } = renderWithProviders(
      <ItemWearLine floatValue={0.25} paintSeed={null} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
