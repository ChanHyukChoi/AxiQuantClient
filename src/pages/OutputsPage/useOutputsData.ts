import { useEffect, useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getOutputList } from '@/api/output'
import { MOCK_SCPS } from '@/pages/ControllersPage/controllersMockData'
import {
  MOCK_OUTPUTS,
  outputRowKey,
  type OutputDisplayRow,
} from '@/pages/OutputsPage/outputsMockData'
import { outputLabel } from '@/pages/OutputsPage/utils/outputDisplay'
import { useScps } from '@/hooks/api/useDeviceControl'
import { queryKeys } from '@/lib/query/queryKeys'
import type { OutputInfo } from '@/types/api'

const forceMock = import.meta.env.VITE_OUTPUTS_MOCK === 'true'

const toDisplayRow = (
  output: OutputInfo,
  scpName: string,
  sioName = 'Internal',
): OutputDisplayRow => ({
  ...output,
  scpName,
  sioName: output.sio <= 0 ? 'Internal' : sioName,
})

export const useOutputsData = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [scpFilter, setScpFilter] = useState<number | 'all'>('all')
  const [mockRows, setMockRows] = useState(MOCK_OUTPUTS)

  const { data: scpList, isLoading: scpsLoading, isError: scpsError } = useScps()
  const useMock =
    forceMock ||
    (import.meta.env.DEV && !scpsLoading && (scpsError || !scpList?.length))

  const scps = useMock ? MOCK_SCPS : (scpList ?? [])

  const outputQueries = useQueries({
    queries: scps.map((scp) => ({
      queryKey: queryKeys.deviceControl.outputs(scp.id),
      queryFn: () => getOutputList(scp.id),
      enabled: !useMock && scp.id > 0,
    })),
  })

  const apiRows = useMemo((): OutputDisplayRow[] => {
    if (useMock) return []
    const rows: OutputDisplayRow[] = []
    scps.forEach((scp, index) => {
      const list = outputQueries[index]?.data ?? []
      list.forEach((output) => {
        rows.push(toDisplayRow(output, scp.name))
      })
    })
    return rows
  }, [useMock, scps, outputQueries])

  const allRows = useMock ? mockRows : apiRows

  const filteredRows = useMemo(() => {
    let list = allRows
    if (scpFilter !== 'all') {
      list = list.filter((r) => r.scp === scpFilter)
    }
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter(
      (r) =>
        outputLabel(r).toLowerCase().includes(q) ||
        r.scpName.toLowerCase().includes(q) ||
        r.sioName.toLowerCase().includes(q),
    )
  }, [allRows, scpFilter, searchQuery])

  useEffect(() => {
    if (filteredRows.length === 0) {
      setSelectedKey(null)
      return
    }
    if (selectedKey == null || !filteredRows.some((r) => outputRowKey(r) === selectedKey)) {
      setSelectedKey(outputRowKey(filteredRows[0]))
    }
  }, [filteredRows, selectedKey])

  const selected = useMemo(
    () => filteredRows.find((r) => outputRowKey(r) === selectedKey) ?? null,
    [filteredRows, selectedKey],
  )

  const outputsLoading =
    !useMock && (scpsLoading || outputQueries.some((q) => q.isLoading))

  const patchMockRow = (scp: number, id: number, patch: Partial<OutputDisplayRow>) => {
    setMockRows((prev) =>
      prev.map((r) => (r.scp === scp && r.id === id ? { ...r, ...patch } : r)),
    )
  }

  return {
    useMock,
    scps,
    filteredRows,
    selected,
    selectedKey,
    selectRow: (row: OutputDisplayRow) => setSelectedKey(outputRowKey(row)),
    searchQuery,
    setSearchQuery,
    scpFilter,
    setScpFilter,
    isLoading: outputsLoading,
    isError: !useMock && scpsError,
    patchMockRow,
  }
}
