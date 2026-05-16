import { useNavigate } from 'react-router-dom'

export function SplashPage() {
  const navigate = useNavigate()

  return (
    <main className="flex-1 bg-primary-container text-on-primary antialiased overflow-hidden h-dvh flex flex-col">
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-between py-12 px-4 text-center">
        <div className="z-10">
          <div className="w-24 h-24 rounded-full bg-on-primary-container/20 flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-5xl text-on-primary">restaurant</span>
          </div>
        </div>

        <div className="relative w-full max-w-md flex flex-col items-center justify-center gap-4 z-10">
          <div className="relative w-full aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-on-primary-container/10 scale-110 blur-xl rounded-[60%_40%_70%_30%/30%_60%_40%_70%]" />
            <div className="absolute top-4 left-4 w-20 h-20 bg-secondary/20 blur-lg rounded-[60%_40%_70%_30%/30%_60%_40%_70%]" />
            <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-8xl text-on-primary-container">ramen_dining</span>
            </div>
            <div className="absolute -top-4 -right-2 bg-surface p-3 rounded-xl shadow-lg flex items-center gap-2 rotate-6">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              <span className="text-label-lg font-label-lg text-primary">Fresco</span>
            </div>
            <div className="absolute -bottom-6 -left-2 bg-surface p-3 rounded-xl shadow-lg flex items-center gap-2 -rotate-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
              <span className="text-label-lg font-label-lg text-primary">Local</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-on-primary font-headline-xl-mobile text-headline-xl-mobile">
              Comida y negocios cerca de ti
            </h1>
            <p className="text-on-primary-container font-body-md text-body-md px-4">
              Descubre los mejores sabores locales y apoya a los negocios de tu comunidad con entregas rápidas y confiables.
            </p>
          </div>
          <div className="px-4">
            <button
              onClick={() => navigate('/inicio')}
              className="group w-full bg-surface text-primary py-5 px-8 rounded-2xl font-label-lg text-label-lg flex items-center justify-center gap-3 shadow-xl hover:bg-surface-container-low active:scale-95 transition-all duration-200"
            >
              <span>Empezar</span>
              <span className="material-symbols-outlined text-primary transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-on-tertiary-container/5 rounded-full blur-3xl" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary/5 rounded-full blur-2xl" />
      </div>
    </main>
  )
}
