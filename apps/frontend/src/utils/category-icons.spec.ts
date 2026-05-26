import { BriefcaseBusiness, Utensils } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { getCategoryIcon, ICON_MAP, ICON_NAMES } from './category-icons'

describe('getCategoryIcon', () => {
  it('returns the correct icon for a known key', () => {
    expect(getCategoryIcon('utensils')).toBe(Utensils)
  })

  it('returns BriefcaseBusiness as fallback for unknown key', () => {
    expect(getCategoryIcon('unknown-icon')).toBe(BriefcaseBusiness)
  })

  it('returns BriefcaseBusiness for empty string', () => {
    expect(getCategoryIcon('')).toBe(BriefcaseBusiness)
  })
})

describe('ICON_NAMES', () => {
  it('contains all keys from ICON_MAP', () => {
    expect(ICON_NAMES).toEqual(Object.keys(ICON_MAP))
  })

  it('has 16 icons', () => {
    expect(ICON_NAMES).toHaveLength(16)
  })
})
