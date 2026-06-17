import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { SearchField } from '@/components/primitive/SearchField'
import { DeviceTreeNode as DeviceTreeNodeView } from '@/components/basic/DeviceTreeNode'
import {
  ancestorKeys,
  buildDeviceTree,
  collectScpIdsFromKeys,
  parseDeviceNodeKey,
  type DeviceTreeNode,
  type ScpChildData,
} from '@/lib/device/buildTree'
import { useDevicePeripheralsForScps, useModules, useScps } from '@/hooks/api/useDeviceControl'

const DEFAULT_EXPANDED = new Set([
  'group:controllers',
  'group:standalone',
  'group:modules',
])

interface DevicePickerModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: (deviceType: string, deviceId: number, label: string) => void
}

const findNodeLabel = (key: string, nodes: DeviceTreeNode[]): string | null => {
  for (const n of nodes) {
    if (n.key === key) return n.label
    if (n.children) {
      const found = findNodeLabel(key, n.children)
      if (found) return found
    }
  }
  return null
}

export const DevicePickerModal = ({
  open,
  onCancel,
  onConfirm,
}: DevicePickerModalProps) => {
  const { t } = useTranslation(['alarm', 'common'])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    () => new Set(DEFAULT_EXPANDED),
  )

  const { data: scps, isLoading: scpsLoading, isError: scpsError } = useScps()
  const { data: modules, isLoading: modulesLoading } = useModules()

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

  const { sioQueries, readerQueries, inputQueries, outputQueries } =
    useDevicePeripheralsForScps(scpIdsToLoad, open)

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

  const tree = useMemo(
    () =>
      buildDeviceTree({
        scps: scps ?? [],
        childDataByScp,
        modules: modules ?? [],
        searchQuery,
        typeFilter: 'all',
      }),
    [scps, childDataByScp, modules, searchQuery],
  )

  const handleToggle = useCallback((key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const handleSelect = useCallback(
    (key: string) => {
      if (key.startsWith('group:') || key.startsWith('module:')) {
        handleToggle(key)
        return
      }
      const parsed = parseDeviceNodeKey(key)
      if (!parsed || parsed.kind === 'module') return
      setSelectedKey(key)
      setExpandedKeys((prev) => {
        const next = new Set(prev)
        ancestorKeys(key).forEach((k) => next.add(k))
        return next
      })
    },
    [handleToggle],
  )

  const handleConfirm = () => {
    if (!selectedKey) return
    const parsed = parseDeviceNodeKey(selectedKey)
    if (!parsed || parsed.kind === 'module') return
    const label = findNodeLabel(selectedKey, tree) ?? selectedKey
    onConfirm(parsed.kind, parsed.entityId, label)
  }

  if (!open) return null

  const canSelect =
    selectedKey != null && parseDeviceNodeKey(selectedKey)?.kind !== 'module'
  const loading = scpsLoading || modulesLoading

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
      role="presentation"
    >
      <PickerDialogShell>
        <div
          className="flex flex-col rounded-md overflow-hidden"
          style={{
            width: 420,
            maxHeight: '80vh',
            background: 'var(--color-sidebar)',
            border: '0.5px solid var(--color-border)',
          }}
        >
          <div
            className="flex items-center justify-between px-3 py-2.5 border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span
              className="text-[15px] font-medium"
              style={{ color: 'var(--color-text)' }}
            >
              {t('alarm:devicePicker.title')}
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer"
              style={{ color: 'var(--color-icon)' }}
            >
              <X size={16} />
            </button>
          </div>

          <div
            className="flex-shrink-0 px-3 py-2 border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <SearchField
              placeholder={t('alarm:devicePicker.searchPlaceholder')}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="flex-1 overflow-y-auto app-scrollbar min-h-[240px] max-h-[50vh]">
            {loading ? (
              <p
                className="text-[14px] text-center py-8"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                {t('alarm:loading')}
              </p>
            ) : scpsError ? (
              <p
                className="text-[14px] text-center py-8 px-3"
                style={{ color: '#c75c5c' }}
              >
                {t('alarm:devicePicker.loadError')}
              </p>
            ) : (
              tree.map((node) => (
                <DeviceTreeNodeView
                  key={node.key}
                  node={node}
                  depth={0}
                  selectedKey={selectedKey}
                  expandedKeys={expandedKeys}
                  onToggle={handleToggle}
                  onSelect={handleSelect}
                />
              ))
            )}
          </div>

          <div
            className="flex justify-end gap-2 p-3 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <Button variant="default" size="md" onClick={onCancel}>
              {t('common:cancel')}
            </Button>
            <Button
              variant="accent"
              size="md"
              leftIcon={<Check size={12} />}
              disabled={!canSelect}
              onClick={handleConfirm}
            >
              {t('common:confirm')}
            </Button>
          </div>
        </div>
      </PickerDialogShell>
    </div>
  )
}

const PickerDialogShell = ({ children }: { children: React.ReactNode }) => (
  <div onClick={(e) => e.stopPropagation()} role="dialog">
    {children}
  </div>
)
