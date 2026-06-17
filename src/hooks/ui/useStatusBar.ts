import { useEffect, useState } from 'react'
import i18n from '@/lib/i18n'
import { sseClient } from '@/lib/infra/sse'
import { isElectronRuntime } from '@/lib/isElectronRuntime'
import { useAuthStore } from '@/stores/authStore'
import { useModules } from '@/hooks/api/useDeviceControl'
import { useLicenseInfo } from '@/hooks/api/useSystem'

const formatMemoryMb = (bytes: number): string => `${Math.round(bytes / 1024 / 1024)} MB`

const readWebMemoryMb = (): string | null => {
  const perf = performance as Performance & { memory?: { usedJSHeapSize: number } }
  if (!perf.memory?.usedJSHeapSize) return null
  return formatMemoryMb(perf.memory.usedJSHeapSize)
}

export const useStatusBar = () => {
  const loginId = useAuthStore((s) => s.loginId)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [sseConnected, setSseConnected] = useState(sseClient.isConnected)
  const [memoryLabel, setMemoryLabel] = useState<string>(i18n.t('empty', { ns: 'common' }))

  useEffect(() => sseClient.subscribeConnection(setSseConnected), [])

  const modulesQuery = useModules(isAuthenticated)
  const licenseQuery = useLicenseInfo(isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      setMemoryLabel(i18n.t('empty', { ns: 'common' }))
      return
    }

    let active = true

    const updateMemory = async () => {
      if (!active) return

      if (isElectronRuntime() && window.electronAPI?.system?.getMemoryUsageMb) {
        const mb = await window.electronAPI.system.getMemoryUsageMb()
        if (active) setMemoryLabel(`${mb} MB`)
        return
      }

      const web = readWebMemoryMb()
      if (active) setMemoryLabel(web ?? i18n.t('empty', { ns: 'common' }))
    }

    void updateMemory()
    const timer = window.setInterval(() => void updateMemory(), 5_000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [isAuthenticated])

  const apiConnected = isAuthenticated && modulesQuery.isSuccess && modulesQuery.data !== null
  // /api/users 는 서버 미구현(404) — 권한 조회 없이 기본 라벨만 표시
  const roleLabel = loginId ? i18n.t('statusBar.roleDefault', { ns: 'layout' }) : i18n.t('empty', { ns: 'common' })
  const license = licenseQuery.data

  return {
    apiConnected,
    sseConnected,
    memoryLabel,
    loginId: loginId ?? i18n.t('empty', { ns: 'common' }),
    roleLabel,
    license,
    licenseReady: licenseQuery.isSuccess,
  }
}
