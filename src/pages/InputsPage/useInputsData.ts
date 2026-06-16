import { useMemo, useState } from 'react'
import { inputRowKey, type InputDisplayRow } from '@/pages/InputsPage/inputDisplayTypes'
import { inputLabel } from '@/pages/InputsPage/utils/inputDisplay'
import { useInputListsForScps, useScps } from '@/hooks/api/useDeviceControl'
import type { InputInfo } from '@/types/api'

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

  const { data: scpList, isLoading: scpsLoading, isError: scpsError } = useScps()
  const scps = scpList ?? []

  const inputQueries = useInputListsForScps(scps)

  const allRows = useMemo((): InputDisplayRow[] => {
    const rows: InputDisplayRow[] = []
    scps.forEach((scp, index) => {
      const list = inputQueries[index]?.data ?? []
      list.forEach((input) => {
        rows.push(toDisplayRow(input, scp.name))
      })
    })
    return rows
  }, [scps, inputQueries])

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

  const isLoading = scpsLoading || inputQueries.some((q) => q.isLoading)

  return {
    scps,
    filteredRows,
    selected,
    selectedKey,
    selectRow: (row: InputDisplayRow) => setSelectedKey(inputRowKey(row)),
    searchQuery,
    setSearchQuery,
    scpFilter,
    setScpFilter,
    isLoading,
    isError: scpsError,
  }
}
