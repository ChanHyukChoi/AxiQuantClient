import { Badge } from '@/components/primitive/Badge'
import { Checkbox } from '@/components/primitive/Checkbox'
import { FieldRow, InfoField, CheckRow } from '@/pages/ReadersPage/components/ReaderField'
import { MOCK_CARD_FORMATS } from '@/pages/ReadersPage/readersMockData'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readersMockData'
import {
  formatDefMode,
  formatKpadMode,
  formatOffMode,
  formatReaderAddr,
  formatSioName,
  readerKindLabel,
  readerLabel,
} from '@/pages/ReadersPage/utils/readerDisplay'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'

interface ReaderDetailContentProps {
  reader: ReaderDisplayRow
  activeTab: string
  useMock: boolean
  onToggleActive?: (active: boolean) => void
}

const StandaloneGeneral = ({ reader }: { reader: ReaderDisplayRow }) => (
  <div className="max-w-md flex flex-col gap-3">
    <InfoField label="명칭">
      <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
        {readerLabel(reader)}
      </span>
    </InfoField>
    <InfoField label="연결 주소">
      <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
        {reader.connectionHost ?? '—'}
      </span>
    </InfoField>
    <InfoField label="사용자 이름">
      <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
        {reader.deviceManager ?? '—'}
      </span>
    </InfoField>
    <InfoField label="모델">
      <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
        {reader.modelName}
      </span>
    </InfoField>
  </div>
)

const GeneralTab = ({
  reader,
  useMock,
  onToggleActive,
}: {
  reader: ReaderDisplayRow
  useMock: boolean
  onToggleActive?: (active: boolean) => void
}) => {
  if (reader.kind === 'standalone') {
    return <StandaloneGeneral reader={reader} />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-subtle)' }}>
          기본
        </p>
        <FieldRow label="명칭" value={readerLabel(reader)} />
        <FieldRow label="유형" value={readerKindLabel(reader.kind)} />
        <FieldRow label="주제어기" value={reader.scpName} />
        <FieldRow label="부제어기" value={formatSioName(reader.sio, reader.sioName)} />
        <FieldRow label="어드레스" value={formatReaderAddr(reader.addr)} />
        <FieldRow label="모델" value={reader.modelName} />
        <div className="flex justify-between items-center py-1">
          <span className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
            활성
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={isDeviceActive(reader.active)}
              disabled={!useMock}
              onChange={(c) => onToggleActive?.(c)}
            />
            <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
              {isDeviceActive(reader.active) ? '활성' : '비활성'}
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-subtle)' }}>
          락 · 도어
        </p>
        <CheckRow label="락 출력 사용" disabled />
        <CheckRow label="도어 센서 사용" disabled />
        <CheckRow label="REX 사용" disabled />
        <CheckRow label="퇴실 버튼 사용" disabled />
        <FieldRow label="개방 시간" value="3 sec" />
      </div>

      <div className="flex flex-col gap-1 min-h-0">
        <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-subtle)' }}>
          카드 형식
        </p>
        <div
          className="rounded p-2 overflow-y-auto app-scrollbar max-h-48"
          style={{ border: '0.5px solid var(--color-border)' }}
        >
          {MOCK_CARD_FORMATS.map((fmt) => (
            <CheckRow key={fmt} label={fmt} checked={fmt === 'WIEGAND' || fmt === 'HID 35bit'} disabled />
          ))}
        </div>
      </div>
    </div>
  )
}

const ModeTab = ({ reader }: { reader: ReaderDisplayRow }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
    <div className="flex flex-col gap-2">
      <FieldRow label="기본 모드" value={formatDefMode(reader.defmode)} />
      <FieldRow label="오프라인 모드" value={formatOffMode(reader.offmode)} />
      <FieldRow label="키패드 모드" value={formatKpadMode(reader.kpadmode)} />
    </div>
    <div className="flex flex-col gap-1">
      <CheckRow label="강제 개방 경보 비활성화" disabled />
      <CheckRow label="문 열림 경보 비활성" disabled />
      <CheckRow label="강제 개방 감지 완화" disabled />
    </div>
  </div>
)

const ApbTab = ({ reader }: { reader: ReaderDisplayRow }) => (
  <div className="max-w-sm flex flex-col gap-2">
    <FieldRow label="출입 전 영역" value={reader.apbin > 0 ? `Area ${reader.apbin}` : '— NONE —'} />
    <FieldRow label="출입 후 영역" value={reader.apbto > 0 ? `Area ${reader.apbto}` : '— NONE —'} />
    <FieldRow label="Timed APB" value={`${reader.apbdelay} min`} />
  </div>
)

const PairTab = ({ reader }: { reader: ReaderDisplayRow }) => (
  <div className="max-w-sm flex flex-col gap-3">
    <FieldRow label="연관 리더" value={reader.pairReaderName || '—'} />
    <CheckRow label="마스터" disabled />
  </div>
)

const ProtocolTab = ({ reader }: { reader: ReaderDisplayRow }) => (
  <div className="max-w-sm flex flex-col gap-2">
    <FieldRow label="프로토콜" value={reader.osdpflag > 0 ? 'OSDP' : 'WIEGAND'} />
    <FieldRow label="전송 속도" value="9600" />
    <FieldRow label="어드레스" value={String(reader.addr)} />
    {reader.kind === 'bio' ? (
      <FieldRow label="장치 관리자" value={reader.deviceManager ?? '—'} />
    ) : null}
  </div>
)

export const ReaderDetailContent = ({
  reader,
  activeTab,
  useMock,
  onToggleActive,
}: ReaderDetailContentProps) => {
  switch (activeTab) {
    case 'general':
      return <GeneralTab reader={reader} useMock={useMock} onToggleActive={onToggleActive} />
    case 'mode':
      return <ModeTab reader={reader} />
    case 'apb':
      return <ApbTab reader={reader} />
    case 'pair':
      return <PairTab reader={reader} />
    case 'protocol':
      return <ProtocolTab reader={reader} />
    default:
      return null
  }
}

export const ReaderKindBadge = ({ kind }: { kind: ReaderDisplayRow['kind'] }) => (
  <Badge variant={kind === 'standalone' ? 'visit' : kind === 'bio' ? 'card' : 'on'}>
    {readerKindLabel(kind)}
  </Badge>
)
