import { useNavigate } from 'react-router-dom'

export function AppHeader() {
  const navigate = useNavigate()

  return (
    <header className="flex justify-between items-center w-full px-4 py-2 sticky top-0 z-50 bg-surface shadow-sm border-b border-border-subtle">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">location_on</span>
        <span className="text-headline-md-mobile font-headline-md text-primary font-bold">
          Calle Principal 123
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/carrito')}
          className="hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95"
        >
          <span className="material-symbols-outlined text-primary">shopping_cart</span>
        </button>
      </div>
    </header>
  )
}
