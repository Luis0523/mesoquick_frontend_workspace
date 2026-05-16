import { Outlet } from 'react-router-dom'

export function CheckoutLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
