import type { OrderStatus } from '../../entities/order/model/types'

interface OrderTimelineProps {
  currentStatus: OrderStatus
}

const steps: { key: OrderStatus; label: string }[] = [
  { key: 'recibido', label: 'Pedido recibido' },
  { key: 'preparando', label: 'Preparando' },
  { key: 'en_camino', label: 'En camino' },
  { key: 'entregado', label: 'Entregado' },
]

const statusOrder: Record<OrderStatus, number> = {
  pendiente: 0,
  recibido: 1,
  preparando: 2,
  listo: 3,
  en_camino: 4,
  entregado: 5,
  cancelado: -1,
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const currentStep = statusOrder[currentStatus] ?? 0

  return (
    <div className="relative space-y-8 ml-3">
      <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-border-subtle" />
      {currentStep > 0 && (
        <div
          className="absolute left-[11px] top-2 w-[2px] bg-primary-container transition-all"
          style={{ height: `${(currentStep / (steps.length)) * 100}%` }}
        />
      )}
      {steps.map((step, index) => {
        const isCompleted = currentStep > index + 1
        const isCurrent = step.key === currentStatus
        const isPending = currentStep <= index + 1 && !isCurrent

        return (
          <div key={step.key} className="relative flex items-start gap-6">
            <div
              className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                isCompleted
                  ? 'bg-primary-container'
                  : isCurrent
                  ? 'border-4 border-surface bg-primary-container ring-2 ring-primary-container'
                  : 'border-2 border-border-subtle bg-surface'
              }`}
            >
              {isCompleted && (
                <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">check</span>
              )}
              {isCurrent && <div className="w-1.5 h-1.5 bg-on-primary rounded-full" />}
            </div>
            <div className={isPending ? 'opacity-50' : ''}>
              <p className={`text-label-lg font-bold ${isCompleted || isCurrent ? 'text-primary' : 'text-on-surface-variant'}`}>
                {step.label}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
