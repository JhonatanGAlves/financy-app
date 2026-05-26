import { describe, expect, it } from 'vitest'

import { COLOR_NAMES, getCategoryPalette } from './category-palette'

describe('getCategoryPalette', () => {
  it('returns correct palette for green', () => {
    const palette = getCategoryPalette('green')
    expect(palette.bg).toBe('bg-green-light')
    expect(palette.icon).toBe('text-green-base')
    expect(palette.badge).toBe('bg-green-light text-green-base')
    expect(palette.swatch).toBe('bg-green-base')
    expect(palette.selectedBorder).toBe('border-green-base')
  })

  it('returns correct palette for each known color', () => {
    for (const color of COLOR_NAMES) {
      const palette = getCategoryPalette(color)
      expect(palette.bg).toContain(`bg-${color}-light`)
      expect(palette.icon).toContain(`text-${color}-base`)
    }
  })

  it('falls back to green palette for unknown color', () => {
    const fallback = getCategoryPalette('unknown')
    const green = getCategoryPalette('green')
    expect(fallback).toEqual(green)
  })
})

describe('COLOR_NAMES', () => {
  it('contains all 7 colors', () => {
    expect(COLOR_NAMES).toHaveLength(7)
    expect(COLOR_NAMES).toContain('green')
    expect(COLOR_NAMES).toContain('blue')
    expect(COLOR_NAMES).toContain('pink')
    expect(COLOR_NAMES).toContain('orange')
    expect(COLOR_NAMES).toContain('purple')
    expect(COLOR_NAMES).toContain('yellow')
    expect(COLOR_NAMES).toContain('red')
  })
})
