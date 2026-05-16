import { Outlet } from 'react-router-dom'
import { AppHeader } from '../../widgets/app-header/AppHeader'
import { BottomNav } from '../../widgets/bottom-nav/BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
