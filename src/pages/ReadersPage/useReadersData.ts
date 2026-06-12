import { useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getReaderList } from '@/api/reader'
import { MOCK_SCPS } from '@/pages/ControllersPage/controllersMockData'
import { MOCK_READERS, type ReaderDisplayRow } from '@/pages/ReadersPage/readersMockData'
import {
  detectReaderKind,
  readerLabel,
  readerRowKey,
  type ReaderKindFilter,
} from '@/pages/ReadersPage/utils/readerDisplay'
import { useScps } from '@/hooks/api/useDeviceControl'
import { queryKeys } from '@/lib/query/queryKeys'
import type { ReaderInfo } from '@/types/api'

const forceMock = import.meta.env.VITE_READERS_MOCK === 'true'

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
  const [mockRows, setMockRows] = useState(MOCK_READERS)

  const { data: scpList, isLoading: scpsLoading, isError: scpsError } = useScps()
  const useMock =
    forceMock ||
    (import.meta.env.DEV && !scpsLoading && (scpsError || !scpList?.length))

  const scps = useMock ? MOCK_SCPS : (scpList ?? [])

  const readerQueries = useQueries({
    queries: scps.map((scp) => ({
      queryKey: queryKeys.deviceControl.readers(scp.id),
      queryFn: () => getReaderList(scp.id),
      enabled: !useMock && scp.id > 0,
    })),
  })

  const apiRows = useMemo((): ReaderDisplayRow[] => {
    if (useMock) return []
    const rows: ReaderDisplayRow[] = []
    scps.forEach((scp, index) => {
      const list = readerQueries[index]?.data ?? []
      list.forEach((reader) => rows.push(toDisplayRow(reader, scp.name)))
    })
    return rows
  }, [useMock, scps, readerQueries])

  const allRows = useMock ? mockRows : apiRows

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

  const isLoading =
    !useMock && (scpsLoading || readerQueries.some((q) => q.isLoading))

  const patchMockRow = (scp: number, id: number, patch: Partial<ReaderDisplayRow>) => {
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
    selectRow: (row: ReaderDisplayRow) => setSelectedKey(readerRowKey(row)),
    searchQuery,
    setSearchQuery,
    scpFilter,
    setScpFilter,
    kindFilter,
    setKindFilter,
    isLoading,
    isError: !useMock && scpsError,
    patchMockRow,
  }
}
