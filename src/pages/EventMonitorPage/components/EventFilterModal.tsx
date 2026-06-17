import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import type { EventFilterScope } from '@/pages/EventMonitorPage/components/EventFilterButton'

export type EventListFilters = {
  search: string
  unackedOnly: boolean
}

export const defaultEventListFilters: EventListFilters = {
  search: '',
  unackedOnly: false,
}

export const isEventFiltersActive = (filters: EventListFilters): boolean =>
  filters.search.trim() !== '' || filters.unackedOnly

interface EventFilterModalProps {
  open: boolean
  scope: EventFilterScope
  filters: EventListFilters
  onApply: (filters: EventListFilters) => void
  onClose: () => void
}

export const EventFilterModal = ({
  open,
  scope,
  filters,
  onApply,
  onClose,
}: EventFilterModalProps) => {
  const { t } = useTranslation(['eventMonitor', 'common'])
  const [draft, setDraft] = useState(filters)

  useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])

  if (!open) return null

  const title =
    scope === 'live' ? t('eventMonitor:filterModal.titleLive') : t('eventMonitor:filterModal.titleHistory')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="rounded-md p-5 min-w-[320px] max-w-[400px] w-full"
        style={{
          background: 'var(--color-sidebar)',
          border: '0.5px solid var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-[15px] font-medium" style={{ color: 'var(--color-text)' }}>
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded"
            style={{ color: 'var(--color-text-subtle)' }}
            aria-label={t('common:close')}
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px]" style={{ color: 'var(--color-text-muted)' }}>
              {t('eventMonitor:filterModal.search')}
            </span>
            <Input
              value={draft.search}
              onChange={(e) => setDraft((prev) => ({ ...prev, search: e.target.value }))}
              placeholder={t('eventMonitor:filterModal.searchPlaceholder')}
              autoFocus
            />
          </label>
          {scope === 'live' ? (
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={draft.unackedOnly}
                onChange={(checked) => setDraft((prev) => ({ ...prev, unackedOnly: checked }))}
              />
              <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
                {t('eventMonitor:filterModal.unackedOnly')}
              </span>
            </label>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="default" size="md" onClick={onClose}>
            {t('common:cancel')}
          </Button>
          <Button
            variant="accent"
            size="md"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
          >
            {t('common:apply')}
          </Button>
        </div>
      </div>
    </div>
  )
}
