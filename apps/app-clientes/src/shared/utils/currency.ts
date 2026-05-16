export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}

export const parsePrice = (value: string): number => {
  const cleaned = value.replace(/[$\s]/g, '')
  const parsed = parseFloat(cleaned)
  if (isNaN(parsed)) return 0
  return parsed
}
