type ColorName =
  | 'green'
  | 'blue'
  | 'pink'
  | 'orange'
  | 'purple'
  | 'yellow'
  | 'red'

interface CategoryPalette {
  bg: string
  icon: string
  badge: string
  swatch: string
  selectedBorder: string
}

const PALETTE_MAP: Record<ColorName, CategoryPalette> = {
  green: {
    bg: 'bg-green-light',
    icon: 'text-green-base',
    badge: 'bg-green-light text-green-base',
    swatch: 'bg-green-base',
    selectedBorder: 'border-green-base',
  },
  blue: {
    bg: 'bg-blue-light',
    icon: 'text-blue-base',
    badge: 'bg-blue-light text-blue-base',
    swatch: 'bg-blue-base',
    selectedBorder: 'border-blue-base',
  },
  pink: {
    bg: 'bg-pink-light',
    icon: 'text-pink-base',
    badge: 'bg-pink-light text-pink-base',
    swatch: 'bg-pink-base',
    selectedBorder: 'border-pink-base',
  },
  orange: {
    bg: 'bg-orange-light',
    icon: 'text-orange-base',
    badge: 'bg-orange-light text-orange-base',
    swatch: 'bg-orange-base',
    selectedBorder: 'border-orange-base',
  },
  purple: {
    bg: 'bg-purple-light',
    icon: 'text-purple-base',
    badge: 'bg-purple-light text-purple-base',
    swatch: 'bg-purple-base',
    selectedBorder: 'border-purple-base',
  },
  yellow: {
    bg: 'bg-yellow-light',
    icon: 'text-yellow-base',
    badge: 'bg-yellow-light text-yellow-base',
    swatch: 'bg-yellow-base',
    selectedBorder: 'border-yellow-base',
  },
  red: {
    bg: 'bg-red-light',
    icon: 'text-red-base',
    badge: 'bg-red-light text-red-base',
    swatch: 'bg-red-base',
    selectedBorder: 'border-red-base',
  },
}

const FALLBACK_PALETTE: CategoryPalette = PALETTE_MAP.green

export const COLOR_NAMES: ColorName[] = [
  'green',
  'blue',
  'pink',
  'orange',
  'purple',
  'yellow',
  'red',
]

export function getCategoryPalette(color: string): CategoryPalette {
  return PALETTE_MAP[color as ColorName] ?? FALLBACK_PALETTE
}
