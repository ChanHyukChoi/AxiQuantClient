import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getModuleList } from '@/api/modules'
import { getLicenseInfo } from '@/api/system'
import { sseClient } from '@/lib/infra/sse'
import { queryKeys } from '@/lib/query/queryKeys'
import { useAuthStore } from '@/stores/authStore'

const isElectron = navigator.userAgent.includes('Electron')

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
  const [memoryLabel, setMemoryLabel] = useState<string>('—')

  useEffect(() => sseClient.subscribeConnection(setSseConnected), [])

  const modulesQuery = useQuery({
    queryKey: queryKeys.modules.all,
    queryFn: getModuleList,
    enabled: isAuthenticated,
    refetchInterval: 15_000,
    retry: false,
  })

  const licenseQuery = useQuery({
    queryKey: ['system', 'license'],
    queryFn: getLicenseInfo,
    enabled: isAuthenticated,
    refetchInterval: 60_000,
    retry: false,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      setMemoryLabel('—')
      return
    }

    let active = true

    const updateMemory = async () => {
      if (!active) return

      if (isElectron && window.electronAPI?.system?.getMemoryUsageMb) {
        const mb = await window.electronAPI.system.getMemoryUsageMb()
        if (active) setMemoryLabel(`${mb} MB`)
        return
      }

      const web = readWebMemoryMb()
      if (active) setMemoryLabel(web ?? '—')
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
  const roleLabel = loginId ? '일반 사용자' : '—'
  const license = licenseQuery.data

  return {
    apiConnected,
    sseConnected,
    memoryLabel,
    loginId: loginId ?? '—',
    roleLabel,
    license,
    licenseReady: licenseQuery.isSuccess,
  }
}
