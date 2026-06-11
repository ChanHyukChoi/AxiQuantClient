import { ArrowRightToLine } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Badge } from '@/components/primitive/Badge'
import { Checkbox } from '@/components/primitive/Checkbox'
import type { InputDisplayRow } from '@/pages/InputsPage/inputsMockData'
import {
  formatInputAddr,
  formatInputMode,
  formatSioName,
  inputLabel,
} from '@/pages/InputsPage/utils/inputDisplay'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'

interface InputDetailPanelProps {
  row: InputDisplayRow | null
  useMock: boolean
  onToggleActive?: (active: boolean) => void
}

const FieldRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-1.5 gap-4">
    <span className="text-[14px] shrink-0" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    <span className="text-[15px] text-right break-all" style={{ color: 'var(--color-text)' }}>
      {value}
    </span>
  </div>
)

export const InputDetailPanel = ({ row, useMock, onToggleActive }: InputDetailPanelProps) => {
  if (!row) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center gap-2 px-6"
        style={{ background: 'var(--color-sidebar)' }}
      >
        <ArrowRightToLine size={28} style={{ color: 'var(--color-text-dim)' }} />
        <p className="text-[15px] text-center" style={{ color: 'var(--color-text-subtle)' }}>
          왼쪽에서 입력을 선택하세요.
        </p>
      </div>
    )
  }

  return (
    <Drawer
      fill
      borderLeft={false}
      header={
        <div className="flex items-center gap-2 min-w-0">
          <ArrowRightToLine size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <h2
            className="text-[15px] font-medium truncate"
            style={{ color: 'var(--color-text)' }}
          >
            {inputLabel(row)}
          </h2>
          <Badge variant={isDeviceActive(row.active) ? 'on' : 'off'}>
            {isDeviceActive(row.active) ? '활성' : '비활성'}
          </Badge>
        </div>
      }
    >
      <FieldRow label="명칭" value={inputLabel(row)} />
      <FieldRow label="주제어기" value={row.scpName} />
      <FieldRow label="부제어기" value={formatSioName(row.sio, row.sioName)} />
      <FieldRow label="어드레스" value={formatInputAddr(row.addr)} />
      <FieldRow label="모드" value={formatInputMode(row.mode)} />
      <FieldRow label="레버 센서" value={String(row.icvt)} />
      <FieldRow label="유지 시간" value={`${row.holdtime} sec`} />
      <div className="flex justify-between items-center py-1.5 gap-4">
        <span className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
          활성
        </span>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={isDeviceActive(row.active)}
            disabled={!useMock && onToggleActive == null}
            onChange={(checked) => onToggleActive?.(checked)}
          />
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            {isDeviceActive(row.active) ? '활성' : '비활성'}
          </span>
        </label>
      </div>
    </Drawer>
  )
}
