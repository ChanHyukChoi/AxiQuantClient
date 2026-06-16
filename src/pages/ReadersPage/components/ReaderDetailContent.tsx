import { useMemo } from 'react'
import { Badge } from '@/components/primitive/Badge'
import { CheckRow, FieldRow, InfoField } from '@/pages/ReadersPage/components/ReaderField'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readerDisplayTypes'
import {
  formatDefMode,
  formatKpadMode,
  formatOffMode,
  formatReaderAddr,
  formatSioName,
  readerKindLabel,
  readerLabel,
} from '@/pages/ReadersPage/utils/readerDisplay'
import { useCardFmts } from '@/hooks/api/useCardfmt'
import { isDeviceActive } from '@/lib/device/deviceHelpers'

interface ReaderDetailContentProps {
  reader: ReaderDisplayRow
  activeTab: string
}

const StandaloneGeneral = ({ reader }: { reader: ReaderDisplayRow }) => (
  <div className="max-w-md flex flex-col gap-3">
    <InfoField label="??">
      <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
        {readerLabel(reader)}
      </span>
    </InfoField>
    <InfoField label="?? ??">
      <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
        {reader.connectionHost ?? '?'}
      </span>
    </InfoField>
    <InfoField label="??? ??">
      <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
        {reader.deviceManager ?? '?'}
      </span>
    </InfoField>
    <InfoField label="??">
      <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
        {reader.modelName}
      </span>
    </InfoField>
  </div>
)

const GeneralTab = ({ reader }: { reader: ReaderDisplayRow }) => {
  const { data: cardFmts } = useCardFmts()
  const formats = useMemo(() => cardFmts ?? [], [cardFmts])

  if (reader.kind === 'standalone') {
    return <StandaloneGeneral reader={reader} />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-subtle)' }}>
          ??
        </p>
        <FieldRow label="??" value={readerLabel(reader)} />
        <FieldRow label="??" value={readerKindLabel(reader.kind)} />
        <FieldRow label="????" value={reader.scpName} />
        <FieldRow label="????" value={formatSioName(reader.sio, reader.sioName)} />
        <FieldRow label="????" value={formatReaderAddr(reader.addr)} />
        <FieldRow label="??" value={reader.modelName} />
        <FieldRow
          label="??"
          value={isDeviceActive(reader.active) ? '??' : '???'}
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-subtle)' }}>
          ? · ??
        </p>
        <CheckRow label="?? ?? ??" disabled />
        <CheckRow label="?? ?? ??" disabled />
        <CheckRow label="REX ??" disabled />
        <CheckRow label="?? ?? ??" disabled />
        <FieldRow label="?? ??" value="3 sec" />
      </div>

      <div className="flex flex-col gap-1 min-h-0">
        <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-subtle)' }}>
          ?? ??
        </p>
        <div
          className="rounded p-2 overflow-y-auto app-scrollbar max-h-48"
          style={{ border: '0.5px solid var(--color-border)' }}
        >
          {formats.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--color-text-subtle)' }}>
              ??? ?? ??? ????.
            </p>
          ) : (
            formats.map((fmt) => (
              <CheckRow key={fmt.id} label={fmt.name} disabled />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const ModeTab = ({ reader }: { reader: ReaderDisplayRow }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
    <div className="flex flex-col gap-2">
      <FieldRow label="?? ??" value={formatDefMode(reader.defmode)} />
      <FieldRow label="???? ??" value={formatOffMode(reader.offmode)} />
      <FieldRow label="??? ??" value={formatKpadMode(reader.kpadmode)} />
    </div>
    <div className="flex flex-col gap-1">
      <CheckRow label="?? ?? ?? ????" disabled />
      <CheckRow label="? ?? ?? ???" disabled />
      <CheckRow label="?? ?? ?? ???" disabled />
    </div>
  </div>
)

const ApbTab = ({ reader }: { reader: ReaderDisplayRow }) => (
  <div className="max-w-sm flex flex-col gap-2">
    <FieldRow label="?? ? ??" value={reader.apbin > 0 ? `Area ${reader.apbin}` : '? NONE ?'} />
    <FieldRow label="?? ? ??" value={reader.apbto > 0 ? `Area ${reader.apbto}` : '? NONE ?'} />
    <FieldRow label="Timed APB" value={`${reader.apbdelay} min`} />
  </div>
)

const PairTab = ({ reader }: { reader: ReaderDisplayRow }) => (
  <div className="max-w-sm flex flex-col gap-3">
    <FieldRow label="?? ??" value={reader.pairReaderName || '?'} />
    <CheckRow label="???" disabled />
  </div>
)

const ProtocolTab = ({ reader }: { reader: ReaderDisplayRow }) => (
  <div className="max-w-sm flex flex-col gap-2">
    <FieldRow label="????" value={reader.osdpflag > 0 ? 'OSDP' : 'WIEGAND'} />
    <FieldRow label="?? ??" value="9600" />
    <FieldRow label="????" value={String(reader.addr)} />
    {reader.kind === 'bio' ? (
      <FieldRow label="?? ???" value={reader.deviceManager ?? '?'} />
    ) : null}
  </div>
)

export const ReaderDetailContent = ({ reader, activeTab }: ReaderDetailContentProps) => {
  switch (activeTab) {
    case 'general':
      return <GeneralTab reader={reader} />
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
