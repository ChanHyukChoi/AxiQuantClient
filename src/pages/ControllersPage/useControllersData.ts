import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  MOCK_SCPS,
  MOCK_SIOS_BY_SCP,
  mockSioCountByScpIdFromMap,
} from '@/pages/ControllersPage/controllersMockData'
import { entityLabel } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import { useScps, useSios } from '@/hooks/api/useDeviceControl'
import type { CreateScpRequest, CreateSioRequest, ScpInfo, SioInfo } from '@/types/api'

const forceControllersMock = import.meta.env.VITE_CONTROLLERS_MOCK === 'true'

const cloneMockSios = (): Record<number, SioInfo[]> =>
  Object.fromEntries(
    Object.entries(MOCK_SIOS_BY_SCP).map(([scpId, list]) => [Number(scpId), list.map((s) => ({ ...s }))]),
  )

export const useControllersData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mockScps, setMockScps] = useState<ScpInfo[]>(MOCK_SCPS)
  const [mockSiosByScp, setMockSiosByScp] = useState<Record<number, SioInfo[]>>(cloneMockSios)

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
  const sios = useMock ? (mockSiosByScp[selectedId ?? 0] ?? []) : (sioList ?? [])
  const siosLoadingEffective = useMock ? false : siosLoading

  const sioCountByScpId = useMemo(() => {
    if (useMock) return mockSioCountByScpIdFromMap(mockSiosByScp)
    if (selectedId == null || siosLoadingEffective) return {}
    return { [selectedId]: sios.length }
  }, [useMock, mockSiosByScp, selectedId, sios.length, siosLoadingEffective])

  const selectScp = (scp: ScpInfo) => {
    setSelectedId(scp.id)
  }

  const patchMockScp = useCallback((id: number, patch: Partial<ScpInfo>) => {
    setMockScps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }, [])

  const addMockScp = useCallback((data: CreateScpRequest): number => {
    const newId = Math.max(0, ...mockScps.map((s) => s.id)) + 1
    setMockScps((prev) => [...prev, { id: newId, ...data }])
    setMockSiosByScp((prev) => ({ ...prev, [newId]: [] }))
    setSelectedId(newId)
    return newId
  }, [mockScps])

  const removeMockScp = useCallback((id: number) => {
    setMockScps((prev) => prev.filter((s) => s.id !== id))
    setMockSiosByScp((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const patchMockSio = useCallback((scpId: number, id: number, patch: Partial<SioInfo>) => {
    setMockSiosByScp((prev) => ({
      ...prev,
      [scpId]: (prev[scpId] ?? []).map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }, [])

  const addMockSio = useCallback((scpId: number, data: CreateSioRequest): number => {
    let newId = 1
    setMockSiosByScp((prev) => {
      const list = prev[scpId] ?? []
      newId = Math.max(0, ...list.map((s) => s.id)) + 1
      return {
        ...prev,
        [scpId]: [{ scp: scpId, id: newId, ...data }, ...list],
      }
    })
    return newId
  }, [])

  const removeMockSio = useCallback((scpId: number, id: number) => {
    setMockSiosByScp((prev) => ({
      ...prev,
      [scpId]: (prev[scpId] ?? []).filter((s) => s.id !== id),
    }))
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
    patchMockSio,
    addMockSio,
    removeMockSio,
    onScpDeleted,
  }
}
