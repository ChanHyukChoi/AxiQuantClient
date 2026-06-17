import { useCallback, useMemo, useState } from 'react'
import { entityLabel } from '@/lib/device/deviceHelpers'
import { useScps, useSios } from '@/hooks/api/useDeviceControl'
import type { ScpInfo } from '@/types/api'

export const useControllersData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: scpList, isLoading, isError } = useScps()
  const scps = scpList ?? []

  const filteredScps = useMemo(() => {
    if (!searchQuery.trim()) return scps
    const q = searchQuery.trim().toLowerCase()
    return scps.filter((s) => entityLabel('scp', s).toLowerCase().includes(q))
  }, [scps, searchQuery])

  const selectedScp = useMemo(
    () => scps.find((s) => s.id === selectedId) ?? null,
    [scps, selectedId],
  )

  const { data: sioList, isLoading: siosLoading } = useSios(selectedId ?? 0)
  const sios = sioList ?? []

  const selectScp = (scp: ScpInfo | number | null) => {
    if (scp == null) {
      setSelectedId(null)
      return
    }
    setSelectedId(typeof scp === 'number' ? scp : scp.id)
  }

  const onScpDeleted = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    scps,
    filteredScps,
    selectedId,
    selectedScp,
    sios,
    siosLoading,
    searchQuery,
    setSearchQuery,
    selectScp,
    isLoading,
    isError,
    onScpDeleted,
  }
}
