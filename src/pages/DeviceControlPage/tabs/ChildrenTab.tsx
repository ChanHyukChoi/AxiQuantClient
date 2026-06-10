import { ArrowLeftFromLine, ArrowRightToLine, Cpu, ScanLine } from 'lucide-react'
import { Badge } from '@/components/primitive/Badge'
import type { ScpChildData } from '@/pages/DeviceControlPage/utils/buildTree'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type { ScpInfo, SioInfo } from '@/types/api'

interface ChildrenTabProps {
  scp: ScpInfo | null
  sio: SioInfo | null
  childData: ScpChildData | undefined
  loading: boolean
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[12px] font-medium tracking-wide pb-1.5 mb-2"
    style={{
      color: 'var(--color-text-subtle)',
      borderBottom: '0.5px solid var(--color-border)',
    }}
  >
    {children}
  </p>
)

const DeviceListSection = ({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode
  title: string
  items: Array<{ id: number; name: string; active: number }>
}) => (
  <div className="mb-1">
    <SectionTitle>
      <span className="inline-flex items-center gap-1.5">
        {icon}
        {title} ({items.length})
      </span>
    </SectionTitle>
    {items.length === 0 ? (
      <p className="text-[12px] mb-3" style={{ color: 'var(--color-text-dim)' }}>
        없음
      </p>
    ) : (
      <ul className="flex flex-col gap-1 mb-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 rounded px-2 py-1.5"
            style={{ border: '0.5px solid var(--color-border-subtle)' }}
          >
            <span className="text-[12px] truncate" style={{ color: 'var(--color-text)' }}>
              {item.name?.trim() || '—'}
            </span>
            <Badge variant={isDeviceActive(item.active) ? 'on' : 'off'}>
              {isDeviceActive(item.active) ? '활성' : '비활성'}
            </Badge>
          </li>
        ))}
      </ul>
    )}
  </div>
)

const EmptyChildren = () => (
  <p
    className="text-[12px] py-6 text-center"
    style={{ color: 'var(--color-text-subtle)' }}
  >
    하위 장치 없음
  </p>
)

export const ChildrenTab = ({ scp, sio, childData, loading }: ChildrenTabProps) => {
  if (loading) {
    return (
      <p className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        하위 장치를 불러오는 중...
      </p>
    )
  }

  if (!scp) {
    return (
      <p className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        SCP를 선택하세요.
      </p>
    )
  }

  const data = childData ?? { sios: [], readers: [], inputs: [], outputs: [] }

  if (sio) {
    const readers = data.readers.filter((r) => r.sio === sio.id)
    const inputs = data.inputs.filter((i) => i.sio === sio.id)
    const outputs = data.outputs.filter((o) => o.sio === sio.id)
    const total = readers.length + inputs.length + outputs.length

    if (total === 0) return <EmptyChildren />

    return (
      <div>
        <p className="text-[12px] mb-3" style={{ color: 'var(--color-text-muted)' }}>
          SIO «{sio.name}» 하위
        </p>
        <DeviceListSection icon={<ScanLine size={12} />} title="리더" items={readers} />
        <DeviceListSection
          icon={<ArrowRightToLine size={12} />}
          title="입력"
          items={inputs}
        />
        <DeviceListSection
          icon={<ArrowLeftFromLine size={12} />}
          title="출력"
          items={outputs}
        />
      </div>
    )
  }

  const total =
    data.sios.length + data.readers.length + data.inputs.length + data.outputs.length

  if (total === 0) return <EmptyChildren />

  return (
    <div>
      <p className="text-[12px] mb-3" style={{ color: 'var(--color-text-muted)' }}>
        SCP «{scp.name}» 전체 하위
      </p>
      <DeviceListSection icon={<Cpu size={12} />} title="SIO" items={data.sios} />
      <DeviceListSection
        icon={<ScanLine size={12} />}
        title="리더"
        items={data.readers}
      />
      <DeviceListSection
        icon={<ArrowRightToLine size={12} />}
        title="입력"
        items={data.inputs}
      />
      <DeviceListSection
        icon={<ArrowLeftFromLine size={12} />}
        title="출력"
        items={data.outputs}
      />
    </div>
  )
}
