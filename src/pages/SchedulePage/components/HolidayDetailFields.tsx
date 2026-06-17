import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { holidayDisplayLabel } from '@/pages/SchedulePage/utils/timezoneDisplay'
import type { HolidayInfo } from '@/types/api'

interface HolidayDetailFieldsProps {
  item: HolidayInfo
  editMode?: boolean
  draftName?: string
  draftDate?: string
  draftRecurring?: boolean
  onDraftNameChange?: (value: string) => void
  onDraftDateChange?: (value: string) => void
  onDraftRecurringChange?: (value: boolean) => void
}

const InfoField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <span className="text-[13px] block mb-0.5" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    {children}
  </div>
)

export const HolidayDetailFields = ({
  item,
  editMode = false,
  draftName,
  draftDate,
  draftRecurring,
  onDraftNameChange,
  onDraftDateChange,
  onDraftRecurringChange,
}: HolidayDetailFieldsProps) => {
  const { t } = useTranslation(['schedule', 'common'])

  return (
    <div className="flex flex-col gap-3 max-w-md">
      <InfoField label={t('schedule:field.name')}>
        {editMode && onDraftNameChange != null ? (
          <Input value={draftName ?? item.name} onChange={(e) => onDraftNameChange(e.target.value)} />
        ) : (
          <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
            {holidayDisplayLabel(item)}
          </span>
        )}
      </InfoField>
      <InfoField label={t('schedule:field.date')}>
        {editMode && onDraftDateChange != null ? (
          <Input
            value={draftDate ?? item.date}
            onChange={(e) => onDraftDateChange(e.target.value)}
            placeholder={t('schedule:holiday.datePlaceholder')}
          />
        ) : (
          <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
            {item.date || t('common:empty')}
          </span>
        )}
      </InfoField>
      <InfoField label={t('schedule:field.recurring')}>
        {editMode && onDraftRecurringChange != null ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={draftRecurring ?? item.isRecurring ?? false}
              onChange={onDraftRecurringChange}
            />
            <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
              {t('schedule:holiday.recurringLabel')}
            </span>
          </label>
        ) : (
          <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
            {item.isRecurring ? t('schedule:holiday.yes') : t('schedule:holiday.no')}
          </span>
        )}
      </InfoField>
    </div>
  )
}
