import { useTranslation } from 'react-i18next'
import { Input } from '@/components/primitive/Input'
import {
  timezoneDisplayName,
  timezoneRangeLabel,
} from '@/pages/SchedulePage/utils/timezoneDisplay'
import type { TimezoneInfo } from '@/types/api'

interface TimezoneDetailFieldsProps {
  item: TimezoneInfo
  editMode?: boolean
  draftName?: string
  onDraftNameChange?: (value: string) => void
}

const InfoField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <span className="text-[13px] block mb-0.5" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    {children}
  </div>
)

export const TimezoneDetailFields = ({
  item,
  editMode = false,
  draftName,
  onDraftNameChange,
}: TimezoneDetailFieldsProps) => {
  const { t } = useTranslation('schedule')

  return (
    <div className="flex flex-col gap-3 max-w-lg">
      <InfoField label={t('field.name')}>
        {editMode && onDraftNameChange != null ? (
          <Input value={draftName ?? item.name} onChange={(e) => onDraftNameChange(e.target.value)} />
        ) : (
          <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
            {timezoneDisplayName(item)}
          </span>
        )}
      </InfoField>
      <InfoField label={t('field.timeRange')}>
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {timezoneRangeLabel(item)}
        </span>
      </InfoField>
      <InfoField label={t('field.intervalCount')}>
        <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
          {item.intervals.length}
        </span>
      </InfoField>
      {item.intervals.length > 0 ? (
        <InfoField label={t('field.intervals')}>
          <div className="flex flex-col gap-1.5">
            {item.intervals.map((iv) => (
              <div
                key={iv.idx}
                className="text-[13px] font-mono px-2 py-1 rounded"
                style={{
                  background: 'var(--color-btn-hover)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {iv.stm} – {iv.etm}
              </div>
            ))}
          </div>
        </InfoField>
      ) : null}
    </div>
  )
}
