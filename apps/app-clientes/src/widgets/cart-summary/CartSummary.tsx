import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../features/manage-cart/model/cartStore'

export function CartSummary() {
  const { items, getSubtotal, getTotalItems } = useCartStore()
  const navigate = useNavigate()

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 z-50">
      <button
        onClick={() => navigate('/carrito')}
        className="w-full bg-primary-container text-white py-4 px-6 rounded-2xl flex items-center justify-between shadow-[0_8px_24px_rgba(12,70,53,0.25)] active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined">shopping_basket</span>
            <span className="absolute -top-2 -right-2 bg-secondary text-on-secondary text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {getTotalItems()}
            </span>
          </div>
          <span className="font-headline-md text-label-lg">Ver Carrito</span>
        </div>
        <span className="font-headline-md text-label-lg">${getSubtotal().toFixed(2)}</span>
      </button>
    </div>
  )
}
