import { useCallback, useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Cpu, Download, Plus, Printer } from 'lucide-react'
import { getInputList } from '@/api/input'
import { getOutputList } from '@/api/output'
import { getReaderList } from '@/api/reader'
import { getSioList } from '@/api/sio'
import { Button } from '@/components/ui/Button'
import { DetailDrawer } from '@/pages/DevicesPage/DetailDrawer'
import { TreePane } from '@/pages/DevicesPage/TreePane'
import {
  ancestorKeys,
  buildDeviceTree,
  collectScpIdsFromKeys,
  parseDeviceNodeKey,
  type ScpChildData,
} from '@/pages/DevicesPage/utils/buildTree'
import { useScps } from '@/hooks/useDevices'
import { queryKeys } from '@/lib/query/queryKeys'
import type { InputInfo, OutputInfo, ReaderInfo, ScpInfo, SioInfo } from '@/types/api'

const DEFAULT_EXPANDED = new Set(['group:controllers', 'group:standalone'])

export const DevicesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set(DEFAULT_EXPANDED))

  const { data: scps, isLoading: scpsLoading, isError: scpsError } = useScps()

  const scpIdsToLoad = useMemo(() => {
    const keys = [...expandedKeys]
    if (selectedKey) keys.push(selectedKey)
    const ids = collectScpIdsFromKeys(keys)
    if (expandedKeys.has('group:standalone') && scps) {
      scps.forEach((s) => {
        if (s.id > 0) ids.add(s.id)
      })
    }
    return Array.from(ids).sort((a, b) => a - b)
  }, [expandedKeys, selectedKey, scps])

  const sioQueries = useQueries({
    queries: scpIdsToLoad.map((scpId) => ({
      queryKey: queryKeys.devices.sios(scpId),
      queryFn: () => getSioList(scpId),
      enabled: scpId > 0,
    })),
  })

  const readerQueries = useQueries({
    queries: scpIdsToLoad.map((scpId) => ({
      queryKey: queryKeys.devices.readers(scpId),
      queryFn: () => getReaderList(scpId),
      enabled: scpId > 0,
    })),
  })

  const inputQueries = useQueries({
    queries: scpIdsToLoad.map((scpId) => ({
      queryKey: queryKeys.devices.inputs(scpId),
      queryFn: () => getInputList(scpId),
      enabled: scpId > 0,
    })),
  })

  const outputQueries = useQueries({
    queries: scpIdsToLoad.map((scpId) => ({
      queryKey: queryKeys.devices.outputs(scpId),
      queryFn: () => getOutputList(scpId),
      enabled: scpId > 0,
    })),
  })

  const childDataByScp = useMemo(() => {
    const map = new Map<number, ScpChildData>()
    scpIdsToLoad.forEach((scpId, index) => {
      map.set(scpId, {
        sios: sioQueries[index]?.data ?? [],
        readers: readerQueries[index]?.data ?? [],
        inputs: inputQueries[index]?.data ?? [],
        outputs: outputQueries[index]?.data ?? [],
      })
    })
    return map
  }, [scpIdsToLoad, sioQueries, readerQueries, inputQueries, outputQueries])

  const childLoading =
    sioQueries.some((q) => q.isLoading) ||
    readerQueries.some((q) => q.isLoading) ||
    inputQueries.some((q) => q.isLoading) ||
    outputQueries.some((q) => q.isLoading)

  const tree = useMemo(
    () =>
      buildDeviceTree({
        scps: scps ?? [],
        childDataByScp,
        searchQuery,
      }),
    [scps, childDataByScp, searchQuery],
  )

  const parsed = useMemo(
    () => (selectedKey ? parseDeviceNodeKey(selectedKey) : null),
    [selectedKey],
  )

  const scpNameMap = useMemo(() => {
    const map: Record<number, string> = {}
    ;(scps ?? []).forEach((s) => {
      map[s.id] = s.name
    })
    return map
  }, [scps])

  const resolveScp = useCallback(
    (scpId: number): ScpInfo | null => (scps ?? []).find((s) => s.id === scpId) ?? null,
    [scps],
  )

  const childDataForParsed = useMemo(() => {
    if (!parsed || parsed.scpId <= 0) return undefined
    return childDataByScp.get(parsed.scpId)
  }, [parsed, childDataByScp])

  const scp = useMemo(() => {
    if (!parsed) return null
    if (parsed.kind === 'scp') return resolveScp(parsed.entityId)
    if (parsed.scpId > 0) return resolveScp(parsed.scpId)
    return null
  }, [parsed, resolveScp])

  const sio = useMemo((): SioInfo | null => {
    if (!parsed || parsed.kind !== 'sio' || !childDataForParsed) return null
    return childDataForParsed.sios.find((s) => s.id === parsed.entityId) ?? null
  }, [parsed, childDataForParsed])

  const reader = useMemo((): ReaderInfo | null => {
    if (!parsed || parsed.kind !== 'reader') return null
    if (parsed.standalone) {
      for (const data of childDataByScp.values()) {
        const found = data.readers.find((r) => r.id === parsed.entityId)
        if (found) return found
      }
      return null
    }
    return childDataForParsed?.readers.find((r) => r.id === parsed.entityId) ?? null
  }, [parsed, childDataForParsed, childDataByScp])

  const input = useMemo((): InputInfo | null => {
    if (!parsed || parsed.kind !== 'input' || !childDataForParsed) return null
    return childDataForParsed.inputs.find((i) => i.id === parsed.entityId) ?? null
  }, [parsed, childDataForParsed])

  const output = useMemo((): OutputInfo | null => {
    if (!parsed || parsed.kind !== 'output' || !childDataForParsed) return null
    return childDataForParsed.outputs.find((o) => o.id === parsed.entityId) ?? null
  }, [parsed, childDataForParsed])

  const handleToggle = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleSelect = (key: string) => {
    if (key.startsWith('group:')) {
      handleToggle(key)
      return
    }
    setSelectedKey(key)
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      ancestorKeys(key).forEach((k) => next.add(k))
      return next
    })
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex items-center justify-between flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <Cpu style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
            장치
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="default" leftIcon={<Download size={12} />}>
           보내기
          </Button>
          <Button variant="default" leftIcon={<Printer size={12} />}>
            인쇄
          </Button>
          <Button variant="accent" leftIcon={<Plus size={12} />} disabled title="추가 — 준비 중">
            추가
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <TreePane
          tree={tree}
          selectedKey={selectedKey}
          expandedKeys={expandedKeys}
          searchQuery={searchQuery}
          loading={scpsLoading}
          error={scpsError}
          onSearch={setSearchQuery}
          onToggle={handleToggle}
          onSelect={handleSelect}
        />
        <DetailDrawer
          selectedKey={selectedKey}
          parsed={parsed}
          scp={scp}
          sio={sio}
          reader={reader}
          input={input}
          output={output}
          childData={childDataForParsed}
          childLoading={childLoading}
          scpNameMap={scpNameMap}
        />
      </div>
    </div>
  )
}
