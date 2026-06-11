import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
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

const holidayLabel = (item: HolidayInfo): string => item.name?.trim() || '휴일'

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
}: HolidayDetailFieldsProps) => (
  <div className="flex flex-col gap-3 max-w-md">
    <InfoField label="명칭">
      {editMode && onDraftNameChange != null ? (
        <Input value={draftName ?? item.name} onChange={(e) => onDraftNameChange(e.target.value)} />
      ) : (
        <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
          {holidayLabel(item)}
        </span>
      )}
    </InfoField>
    <InfoField label="날짜">
      {editMode && onDraftDateChange != null ? (
        <Input
          value={draftDate ?? item.date}
          onChange={(e) => onDraftDateChange(e.target.value)}
          placeholder="MM-DD 또는 YYYY-MM-DD"
        />
      ) : (
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {item.date || '—'}
        </span>
      )}
    </InfoField>
    <InfoField label="매년 반복">
      {editMode && onDraftRecurringChange != null ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={draftRecurring ?? item.isRecurring ?? false}
            onChange={onDraftRecurringChange}
          />
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            매년 반복
          </span>
        </label>
      ) : (
        <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
          {item.isRecurring ? '예' : '아니오'}
        </span>
      )}
    </InfoField>
  </div>
)
