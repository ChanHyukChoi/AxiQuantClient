import { ArrowLeftFromLine } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Badge } from '@/components/primitive/Badge'
import { Checkbox } from '@/components/primitive/Checkbox'
import type { OutputDisplayRow } from '@/pages/OutputsPage/outputsMockData'
import {
  formatOutputAddr,
  formatSioName,
  outputLabel,
} from '@/pages/OutputsPage/utils/outputDisplay'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'

interface OutputDetailPanelProps {
  row: OutputDisplayRow | null
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

export const OutputDetailPanel = ({ row, useMock, onToggleActive }: OutputDetailPanelProps) => {
  if (!row) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center gap-2 px-6"
        style={{ background: 'var(--color-sidebar)' }}
      >
        <ArrowLeftFromLine size={28} style={{ color: 'var(--color-text-dim)' }} />
        <p className="text-[15px] text-center" style={{ color: 'var(--color-text-subtle)' }}>
          왼쪽에서 출력을 선택하세요.
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
          <ArrowLeftFromLine size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <h2
            className="text-[15px] font-medium truncate"
            style={{ color: 'var(--color-text)' }}
          >
            {outputLabel(row)}
          </h2>
          <Badge variant={isDeviceActive(row.active) ? 'on' : 'off'}>
            {isDeviceActive(row.active) ? '활성' : '비활성'}
          </Badge>
        </div>
      }
    >
      <FieldRow label="명칭" value={outputLabel(row)} />
      <FieldRow label="주제어기" value={row.scpName} />
      <FieldRow label="부제어기" value={formatSioName(row.sio, row.sioName)} />
      <FieldRow label="어드레스" value={formatOutputAddr(row.addr)} />
      <FieldRow label="지속 시간" value={`${row.defpulse} sec`} />
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
