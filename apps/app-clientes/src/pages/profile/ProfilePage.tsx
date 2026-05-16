export function ProfilePage() {
  return (
    <div className="px-4 pt-6 pb-6 max-w-md mx-auto">
      <section className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface shadow-[0_4px_12px_rgba(12,70,53,0.06)] bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
          </div>
          <button className="absolute bottom-0 right-0 bg-primary-container text-on-primary p-1.5 rounded-full border-2 border-surface shadow-sm">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Carlos Rodriguez</h2>
        <p className="font-body-md text-text-secondary">+34 612 345 678</p>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline-md text-headline-md text-on-surface">Direcciones guardadas</h3>
          <button className="text-secondary font-label-lg text-label-lg">Ver todas</button>
        </div>
        <div className="space-y-2">
          <div className="bg-surface p-4 rounded-2xl border border-border-subtle shadow-[0_4px_12px_rgba(12,70,53,0.06)] flex items-center gap-4">
            <div className="bg-surface-container-low p-2 rounded-full text-primary">
              <span className="material-symbols-outlined">home</span>
            </div>
            <div className="flex-grow">
              <p className="font-label-lg text-label-lg text-on-surface">Casa</p>
              <p className="font-body-sm text-body-sm text-text-secondary">Calle Principal 123, 4B</p>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </div>
          <div className="bg-surface p-4 rounded-2xl border border-border-subtle shadow-[0_4px_12px_rgba(12,70,53,0.06)] flex items-center gap-4">
            <div className="bg-surface-container-low p-2 rounded-full text-primary">
              <span className="material-symbols-outlined">work</span>
            </div>
            <div className="flex-grow">
              <p className="font-label-lg text-label-lg text-on-surface">Oficina</p>
              <p className="font-body-sm text-body-sm text-text-secondary">Avenida Central 45, Planta 2</p>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Configuración</h3>
        <div className="space-y-2">
          {[
            { icon: 'notifications', label: 'Notificaciones' },
            { icon: 'payment', label: 'Métodos de pago' },
            { icon: 'help_outline', label: 'Centro de ayuda' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full bg-surface p-4 rounded-2xl border border-border-subtle shadow-[0_4px_12px_rgba(12,70,53,0.06)] flex items-center gap-4 hover:bg-surface-container-low transition-colors text-left"
            >
              <span className="material-symbols-outlined text-on-surface-variant">{item.icon}</span>
              <span className="flex-grow font-body-md text-on-surface">{item.label}</span>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </button>
          ))}
          <button className="w-full bg-surface-container-low p-4 rounded-2xl flex items-center gap-4 hover:bg-error-container/20 transition-colors text-left mt-4">
            <span className="material-symbols-outlined text-error">logout</span>
            <span className="flex-grow font-body-md text-error">Cerrar sesión</span>
          </button>
        </div>
      </section>
    </div>
  )
}
