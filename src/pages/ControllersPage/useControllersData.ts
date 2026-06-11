import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  MOCK_SCPS,
  mockSioCountByScpId,
  mockSiosForScp,
} from '@/pages/ControllersPage/controllersMockData'
import { entityLabel } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import { useScps, useSios } from '@/hooks/api/useDeviceControl'
import type { CreateScpRequest, ScpInfo } from '@/types/api'

const forceControllersMock = import.meta.env.VITE_CONTROLLERS_MOCK === 'true'

export const useControllersData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mockScps, setMockScps] = useState<ScpInfo[]>(MOCK_SCPS)

  const { data: scpList, isLoading, isError } = useScps()
  const useMock =
    forceControllersMock ||
    (import.meta.env.DEV && !isLoading && (isError || !scpList?.length))

  const scps = useMock ? mockScps : (scpList ?? [])

  const filteredScps = useMemo(() => {
    if (!searchQuery.trim()) return scps
    const q = searchQuery.trim().toLowerCase()
    return scps.filter((s) => entityLabel('scp', s).toLowerCase().includes(q))
  }, [scps, searchQuery])

  useEffect(() => {
    if (filteredScps.length === 0) {
      setSelectedId(null)
      return
    }
    if (selectedId == null || !filteredScps.some((s) => s.id === selectedId)) {
      setSelectedId(filteredScps[0].id)
    }
  }, [filteredScps, selectedId])

  const selectedScp = useMemo(
    () => scps.find((s) => s.id === selectedId) ?? null,
    [scps, selectedId],
  )

  const { data: sioList, isLoading: siosLoading } = useSios(selectedId ?? 0)
  const sios = useMock ? mockSiosForScp(selectedId ?? 0) : (sioList ?? [])
  const siosLoadingEffective = useMock ? false : siosLoading

  const sioCountByScpId = useMemo(() => {
    if (useMock) return mockSioCountByScpId()
    if (selectedId == null || siosLoadingEffective) return {}
    return { [selectedId]: sios.length }
  }, [useMock, selectedId, sios.length, siosLoadingEffective])

  const selectScp = (scp: ScpInfo) => {
    setSelectedId(scp.id)
  }

  const patchMockScp = useCallback((id: number, patch: Partial<ScpInfo>) => {
    setMockScps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }, [])

  const addMockScp = useCallback((data: CreateScpRequest): number => {
    const newId = Math.max(0, ...mockScps.map((s) => s.id)) + 1
    setMockScps((prev) => [...prev, { id: newId, ...data }])
    setSelectedId(newId)
    return newId
  }, [mockScps])

  const removeMockScp = useCallback((id: number) => {
    setMockScps((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const onScpDeleted = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    useMock,
    scps,
    filteredScps,
    selectedId,
    selectedScp,
    sios,
    siosLoading: siosLoadingEffective,
    sioCountByScpId,
    searchQuery,
    setSearchQuery,
    selectScp,
    isLoading: !useMock && isLoading,
    isError: !useMock && isError,
    patchMockScp,
    addMockScp,
    removeMockScp,
    onScpDeleted,
  }
}
