import { Outlet } from '@tanstack/react-router'
import { TitleBar } from '@/layouts/TitleBar'
import { Sidebar } from '@/layouts/Sidebar'
import { useSidebarStore } from '@/stores/sidebarStore'
import { useSseInvalidate } from '@/hooks/useSseInvalidate'

export const RootLayout = () => {
  const { toggle } = useSidebarStore()
  useSseInvalidate()

  return (
    <div className="flex flex-col h-screen">
      <TitleBar onMenuClick={toggle} />

      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
