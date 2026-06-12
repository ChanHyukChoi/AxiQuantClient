import { Checkbox } from '@/components/primitive/Checkbox'

interface ActiveMockToggleProps {
  checked: boolean
  disabled?: boolean
  onChange?: (active: boolean) => void
}

/** 타이틀바에 상태가 있을 때 본문 — 체크박스만 (뱃지·상태 텍스트 중복 없음) */
export const ActiveMockToggle = ({
  checked,
  disabled = false,
  onChange,
}: ActiveMockToggleProps) => (
  <Checkbox
    checked={checked}
    disabled={disabled || onChange == null}
    onChange={(next) => onChange?.(next)}
  />
)
