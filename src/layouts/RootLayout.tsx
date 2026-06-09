import { Outlet } from '@tanstack/react-router'
import { TitleBar } from '@/layouts/TitleBar'
import { Sidebar } from '@/layouts/Sidebar'
import { useSidebarStore } from '@/stores/sidebarStore'
import { ToastHost } from '@/components/primitive/Toast'
import { StatusBar } from '@/layouts/StatusBar'
import { useDeviceControlSse } from '@/hooks/sse/useDeviceControlSse'
import { useSseInvalidate } from '@/hooks/sse/useSseInvalidate'

export const RootLayout = () => {
  const { toggle } = useSidebarStore()
  useSseInvalidate()
  useDeviceControlSse()

  return (
    <div className="flex flex-col h-screen">
      <TitleBar onMenuClick={toggle} />

      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
      <StatusBar />
      <ToastHost />
    </div>
  )
}
