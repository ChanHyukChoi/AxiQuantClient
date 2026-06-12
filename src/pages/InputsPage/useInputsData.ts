import { useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getInputList } from '@/api/input'
import { MOCK_SCPS } from '@/pages/ControllersPage/controllersMockData'
import {
  inputRowKey,
  MOCK_INPUTS,
  type InputDisplayRow,
} from '@/pages/InputsPage/inputsMockData'
import { inputLabel } from '@/pages/InputsPage/utils/inputDisplay'
import { useScps } from '@/hooks/api/useDeviceControl'
import { queryKeys } from '@/lib/query/queryKeys'
import type { InputInfo } from '@/types/api'

const forceMock = import.meta.env.VITE_INPUTS_MOCK === 'true'

const toDisplayRow = (
  input: InputInfo,
  scpName: string,
  sioName = 'Internal',
): InputDisplayRow => ({
  ...input,
  scpName,
  sioName: input.sio <= 0 ? 'Internal' : sioName,
})

export const useInputsData = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [scpFilter, setScpFilter] = useState<number | 'all'>('all')
  const [mockRows, setMockRows] = useState(MOCK_INPUTS)

  const { data: scpList, isLoading: scpsLoading, isError: scpsError } = useScps()
  const useMock =
    forceMock ||
    (import.meta.env.DEV && !scpsLoading && (scpsError || !scpList?.length))

  const scps = useMock ? MOCK_SCPS : (scpList ?? [])

  const inputQueries = useQueries({
    queries: scps.map((scp) => ({
      queryKey: queryKeys.deviceControl.inputs(scp.id),
      queryFn: () => getInputList(scp.id),
      enabled: !useMock && scp.id > 0,
    })),
  })

  const apiRows = useMemo((): InputDisplayRow[] => {
    if (useMock) return []
    const rows: InputDisplayRow[] = []
    scps.forEach((scp, index) => {
      const list = inputQueries[index]?.data ?? []
      list.forEach((input) => {
        rows.push(toDisplayRow(input, scp.name))
      })
    })
    return rows
  }, [useMock, scps, inputQueries])

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
        inputLabel(r).toLowerCase().includes(q) ||
        r.scpName.toLowerCase().includes(q) ||
        r.sioName.toLowerCase().includes(q),
    )
  }, [allRows, scpFilter, searchQuery])

  const selected = useMemo(
    () => filteredRows.find((r) => inputRowKey(r) === selectedKey) ?? null,
    [filteredRows, selectedKey],
  )

  const inputsLoading =
    !useMock && (scpsLoading || inputQueries.some((q) => q.isLoading))

  const patchMockRow = (scp: number, id: number, patch: Partial<InputDisplayRow>) => {
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
    selectRow: (row: InputDisplayRow) => setSelectedKey(inputRowKey(row)),
    searchQuery,
    setSearchQuery,
    scpFilter,
    setScpFilter,
    isLoading: inputsLoading,
    isError: !useMock && scpsError,
    patchMockRow,
  }
}
