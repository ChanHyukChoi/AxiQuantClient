import { useMemo, useState } from 'react'
import {
  detectReaderKind,
  readerLabel,
  readerRowKey,
  type ReaderKindFilter,
} from '@/pages/ReadersPage/utils/readerDisplay'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readerDisplayTypes'
import { useReaderListsForScps, useScps } from '@/hooks/api/useDeviceControl'
import type { ReaderInfo } from '@/types/api'

const toDisplayRow = (reader: ReaderInfo, scpName: string): ReaderDisplayRow => {
  const kind = detectReaderKind(reader)
  return {
    ...reader,
    scpName: reader.scp > 0 ? scpName : '—',
    sioName: reader.sio <= 0 ? 'Internal' : `SIO ${reader.sio}`,
    modelName: reader.ext?.trim() || '—',
    pairReaderName: reader.pairacr > 0 ? `Reader ${reader.pairacr}` : '—',
    kind,
    connectionHost: kind === 'standalone' ? reader.args || '—' : undefined,
    deviceManager: reader.ext?.trim() || undefined,
  }
}

export const useReadersData = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [scpFilter, setScpFilter] = useState<number | 'all'>('all')
  const [kindFilter, setKindFilter] = useState<ReaderKindFilter>('all')

  const { data: scpList, isLoading: scpsLoading, isError: scpsError } = useScps()
  const scps = scpList ?? []

  const readerQueries = useReaderListsForScps(scps)

  const allRows = useMemo((): ReaderDisplayRow[] => {
    const rows: ReaderDisplayRow[] = []
    scps.forEach((scp, index) => {
      const list = readerQueries[index]?.data ?? []
      list.forEach((reader) => rows.push(toDisplayRow(reader, scp.name)))
    })
    return rows
  }, [scps, readerQueries])

  const filteredRows = useMemo(() => {
    let list = allRows
    if (scpFilter !== 'all') {
      list = list.filter((r) => r.scp === scpFilter)
    }
    if (kindFilter !== 'all') {
      list = list.filter((r) => r.kind === kindFilter)
    }
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter(
      (r) =>
        readerLabel(r).toLowerCase().includes(q) ||
        r.scpName.toLowerCase().includes(q) ||
        r.modelName.toLowerCase().includes(q),
    )
  }, [allRows, scpFilter, kindFilter, searchQuery])

  const selected = useMemo(
    () => filteredRows.find((r) => readerRowKey(r) === selectedKey) ?? null,
    [filteredRows, selectedKey],
  )

  const isLoading = scpsLoading || readerQueries.some((q) => q.isLoading)

  return {
    scps,
    filteredRows,
    selected,
    selectedKey,
    selectRow: (row: ReaderDisplayRow) => setSelectedKey(readerRowKey(row)),
    searchQuery,
    setSearchQuery,
    scpFilter,
    setScpFilter,
    kindFilter,
    setKindFilter,
    isLoading,
    isError: scpsError,
  }
}
