import { useMemo, useState } from 'react'
import { outputRowKey, type OutputDisplayRow } from '@/pages/OutputsPage/outputDisplayTypes'
import { outputLabel } from '@/pages/OutputsPage/utils/outputDisplay'
import { useOutputListsForScps, useScps } from '@/hooks/api/useDeviceControl'
import type { OutputInfo } from '@/types/api'

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

  const { data: scpList, isLoading: scpsLoading, isError: scpsError } = useScps()
  const scps = scpList ?? []

  const outputQueries = useOutputListsForScps(scps)

  const allRows = useMemo((): OutputDisplayRow[] => {
    const rows: OutputDisplayRow[] = []
    scps.forEach((scp, index) => {
      const list = outputQueries[index]?.data ?? []
      list.forEach((output) => {
        rows.push(toDisplayRow(output, scp.name))
      })
    })
    return rows
  }, [scps, outputQueries])

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

  const selected = useMemo(
    () => filteredRows.find((r) => outputRowKey(r) === selectedKey) ?? null,
    [filteredRows, selectedKey],
  )

  const isLoading = scpsLoading || outputQueries.some((q) => q.isLoading)

  return {
    scps,
    filteredRows,
    selected,
    selectedKey,
    selectRow: (row: OutputDisplayRow) => setSelectedKey(outputRowKey(row)),
    searchQuery,
    setSearchQuery,
    scpFilter,
    setScpFilter,
    isLoading,
    isError: scpsError,
  }
}
