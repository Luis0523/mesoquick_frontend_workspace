import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="flex-1 bg-background flex flex-col items-center justify-center px-4 text-center min-h-dvh">
      <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">search_off</span>
      <h1 className="text-headline-xl font-headline-xl text-primary mb-2">Página no encontrada</h1>
      <p className="text-body-md text-on-surface-variant mb-8">Lo sentimos, no encontramos lo que buscas.</p>
      <button
        onClick={() => navigate('/inicio')}
        className="bg-primary text-on-primary py-4 px-8 rounded-2xl font-label-lg text-label-lg active:scale-95 transition-all"
      >
        Volver al inicio
      </button>
    </main>
  )
}
