export const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export const getRelativeDay = (isoDate: string): string => {
  const date = new Date(isoDate)
  const today = new Date()
  const diff = today.getDate() - date.getDate()
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}
