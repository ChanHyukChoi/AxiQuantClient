import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { Select } from '@/components/primitive/Select'
import { accLvReaderKey } from '@/pages/AccessPage/utils/accLvHelpers'
import {
  fallbackReaderName,
  fallbackScpName,
  fallbackTimezoneName,
} from '@/lib/entityDisplayLabels'
import {
  useAddAccLvReader,
  useDeleteAccLvReader,
} from '@/hooks/api/useAccLv'
import { useReaders, useScps } from '@/hooks/api/useDeviceControl'
import { useTimezoneList } from '@/hooks/api/useTimezone'
import type { AccLvRdrInfo } from '@/types/api'

interface DraftRow {
  key: string
  scpId: number
  readerId: number
  timezoneId: number
}

interface AccLvReaderEditModalProps {
  open: boolean
  alvId: number
  readers: AccLvRdrInfo[]
  scpNameMap: Record<number, string>
  onCancel: () => void
  onSaved: () => void
}

const toDraft = (r: AccLvRdrInfo): DraftRow => ({
  key: accLvReaderKey(r.scp, r.rdr),
  scpId: r.scp,
  readerId: r.rdr,
  timezoneId: r.tz ?? 0,
})

const ReaderPicker = ({
  scpId,
  readerId,
  onReaderChange,
}: {
  scpId: number
  readerId: number
  onReaderChange: (readerId: number) => void
}) => {
  const { t } = useTranslation('access')
  const { data: readers, isLoading } = useReaders(scpId)

  const options = useMemo(
    () =>
      (readers ?? []).map((r) => ({
        value: String(r.id),
        label: fallbackReaderName(r.name),
      })),
    [readers],
  )

  if (scpId <= 0) {
    return (
      <Select
        value=""
        options={[]}
        placeholder={t('readers.placeholder.selectControllerFirst')}
        disabled
        className="w-full"
      />
    )
  }

  return (
    <Select
      value={readerId > 0 ? String(readerId) : ''}
      onChange={(v) => onReaderChange(Number(v))}
      options={options}
      placeholder={isLoading ? t('loading') : t('readers.placeholder.selectReader')}
      disabled={isLoading || options.length === 0}
      className="w-full"
    />
  )
}

export const AccLvReaderEditModal = ({
  open,
  alvId,
  readers,
  scpNameMap,
  onCancel,
  onSaved,
}: AccLvReaderEditModalProps) => {
  const { t } = useTranslation(['access', 'common'])
  const [drafts, setDrafts] = useState<DraftRow[]>([])
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { data: scpList } = useScps()
  const { data: timezoneList } = useTimezoneList()
  const addReader = useAddAccLvReader(alvId)
  const deleteReader = useDeleteAccLvReader(alvId)

  useEffect(() => {
    if (open) {
      setDrafts(readers.map(toDraft))
      setSaveError(null)
    }
  }, [open, readers])

  const scpOptions = useMemo(
    () =>
      (scpList ?? []).map((s) => ({
        value: String(s.id),
        label: fallbackScpName(s.name),
      })),
    [scpList],
  )

  const timezoneOptions = useMemo(
    () =>
      (timezoneList ?? []).map((tz) => ({
        value: String(tz.id),
        label: fallbackTimezoneName(tz.name),
      })),
    [timezoneList],
  )

  const defaultTimezoneId = timezoneOptions[0] ? Number(timezoneOptions[0].value) : 0

  const handleAddRow = () => {
    const firstScp = scpOptions[0] ? Number(scpOptions[0].value) : 0
    setDrafts((prev) => [
      ...prev,
      {
        key: `new-${Date.now()}`,
        scpId: firstScp,
        readerId: 0,
        timezoneId: defaultTimezoneId,
      },
    ])
  }

  const handleRemoveRow = (key: string) => {
    setDrafts((prev) => prev.filter((d) => d.key !== key))
  }

  const updateRow = (key: string, patch: Partial<DraftRow>) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.key !== key) return d
        const next = { ...d, ...patch }
        if (patch.scpId != null && patch.scpId !== d.scpId) {
          next.readerId = 0
        }
        return next
      }),
    )
  }

  const handleSave = async () => {
    setSaveError(null)

    const invalid = drafts.some((d) => d.scpId <= 0 || d.readerId <= 0)
    if (invalid) {
      setSaveError(t('access:error.selectControllerAndReader'))
      return
    }

    const keys = drafts.map((d) => accLvReaderKey(d.scpId, d.readerId))
    if (new Set(keys).size !== keys.length) {
      setSaveError(t('access:error.duplicateReader'))
      return
    }

    const originalMap = new Map(
      readers.map((r) => [accLvReaderKey(r.scp, r.rdr), r]),
    )
    const draftMap = new Map(
      drafts.map((d) => [accLvReaderKey(d.scpId, d.readerId), d]),
    )

    setSaving(true)
    try {
      for (const [key, orig] of originalMap) {
        const draft = draftMap.get(key)
        if (!draft) {
          const ok = await deleteReader.mutateAsync({ scpId: orig.scp, rdrId: orig.rdr })
          if (!ok) throw new Error(t('access:error.deleteLinkFailed'))
          continue
        }
        const origTz = orig.tz ?? 0
        if (draft.timezoneId !== origTz) {
          const delOk = await deleteReader.mutateAsync({ scpId: orig.scp, rdrId: orig.rdr })
          if (!delOk) throw new Error(t('access:error.updateLinkFailed'))
          const addOk = await addReader.mutateAsync({
            scpId: draft.scpId,
            readerId: draft.readerId,
            tz: draft.timezoneId,
          })
          if (!addOk) throw new Error(t('access:error.updateLinkFailed'))
        }
      }

      for (const [key, draft] of draftMap) {
        if (!originalMap.has(key)) {
          const ok = await addReader.mutateAsync({
            scpId: draft.scpId,
            readerId: draft.readerId,
            tz: draft.timezoneId,
          })
          if (!ok) throw new Error(t('access:error.addLinkFailed'))
        }
      }

      onSaved()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : t('access:error.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  const resolveScpName = (scpId: number) => fallbackScpName(scpNameMap[scpId])

  const resolveReaderLabel = (row: DraftRow) => {
    if (row.readerId <= 0) return t('common:empty')
    const orig = readers.find((r) => r.scp === row.scpId && r.rdr === row.readerId)
    return fallbackReaderName(orig?.readerName)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="rounded-md flex flex-col w-full max-w-[720px] max-h-[85vh]"
        style={{
          background: 'var(--color-sidebar)',
          border: '0.5px solid var(--color-border)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="acclv-reader-edit-title"
      >
        <div
          className="flex items-center justify-between flex-shrink-0 px-4 py-3"
          style={{ borderBottom: '0.5px solid var(--color-border)' }}
        >
          <p
            id="acclv-reader-edit-title"
            className="text-[15px] font-medium"
            style={{ color: 'var(--color-text)' }}
          >
            {t('access:readers.editTitle')}
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded"
            style={{ color: 'var(--color-text-subtle)' }}
            aria-label={t('common:close')}
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto app-scrollbar px-4 py-3">
          {drafts.length === 0 ? (
            <p
              className="text-[14px] py-6 text-center"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              {t('access:readers.emptyEdit')}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {drafts.map((row) => (
                <div
                  key={row.key}
                  className="grid gap-2 items-center"
                  style={{ gridTemplateColumns: '1fr 1fr 1fr auto' }}
                >
                  <Select
                    value={row.scpId > 0 ? String(row.scpId) : ''}
                    onChange={(v) => updateRow(row.key, { scpId: Number(v) })}
                    options={scpOptions}
                    placeholder={t('access:readers.placeholder.controller')}
                    className="w-full"
                  />
                  <ReaderPicker
                    scpId={row.scpId}
                    readerId={row.readerId}
                    onReaderChange={(readerId) => updateRow(row.key, { readerId })}
                  />
                  <Select
                    value={row.timezoneId > 0 ? String(row.timezoneId) : ''}
                    onChange={(v) => updateRow(row.key, { timezoneId: Number(v) })}
                    options={timezoneOptions}
                    placeholder={t('access:readers.placeholder.timezone')}
                    className="w-full"
                  />
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => handleRemoveRow(row.key)}
                    title={t('access:readers.removeRow', {
                      controller: resolveScpName(row.scpId),
                      reader: resolveReaderLabel(row),
                    })}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="default"
            size="sm"
            leftIcon={<Plus size={12} />}
            onClick={handleAddRow}
            className="mt-3"
            disabled={scpOptions.length === 0}
          >
            {t('access:readers.addRow')}
          </Button>

          {saveError ? (
            <p className="text-[14px] mt-3" style={{ color: 'var(--color-danger)' }}>
              {saveError}
            </p>
          ) : null}
        </div>

        <div
          className="flex justify-end gap-2 flex-shrink-0 px-4 py-3"
          style={{ borderTop: '0.5px solid var(--color-border)' }}
        >
          <Button variant="default" size="md" onClick={onCancel} disabled={saving}>
            {t('common:cancel')}
          </Button>
          <Button variant="accent" size="md" onClick={handleSave} loading={saving}>
            {t('common:save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
