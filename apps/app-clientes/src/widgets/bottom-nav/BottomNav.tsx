import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { label: 'Inicio', icon: 'home', path: '/inicio' },
  { label: 'Buscar', icon: 'search', path: '/buscar' },
  { label: 'Pedidos', icon: 'receipt_long', path: '/pedidos' },
  { label: 'Perfil', icon: 'person', path: '/perfil' },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface py-2 pb-safe px-2 border-t border-border-subtle shadow-lg rounded-t-xl">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={
              `flex flex-col items-center justify-center px-4 py-1 transition-all duration-150 ` +
              (isActive
                ? 'text-primary bg-primary-container/10 rounded-full'
                : 'text-on-surface-variant hover:bg-surface-container-high active:scale-90')
            }
          >
            <span
              className="material-symbols-outlined"
              {...(isActive ? { style: { fontVariationSettings: "'FILL' 1" } as React.CSSProperties } : {})}
            >
              {tab.icon}
            </span>
            <span className="text-label-sm font-label-sm">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
