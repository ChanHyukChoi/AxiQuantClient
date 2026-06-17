import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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

const StandaloneGeneral = ({ reader }: { reader: ReaderDisplayRow }) => {
  const { t } = useTranslation(['common', 'reader'])

  return (
    <div className="max-w-md flex flex-col gap-3">
      <InfoField label={t('common:name')}>
        <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
          {readerLabel(reader)}
        </span>
      </InfoField>
      <InfoField label={t('reader:detail.connectionHost')}>
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {reader.connectionHost ?? t('common:empty')}
        </span>
      </InfoField>
      <InfoField label={t('reader:detail.deviceManager')}>
        <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
          {reader.deviceManager ?? t('common:empty')}
        </span>
      </InfoField>
      <InfoField label={t('common:model')}>
        <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
          {reader.modelName}
        </span>
      </InfoField>
    </div>
  )
}

const GeneralTab = ({ reader }: { reader: ReaderDisplayRow }) => {
  const { t } = useTranslation(['common', 'device', 'reader'])
  const { data: cardFmts } = useCardFmts()
  const formats = useMemo(() => cardFmts ?? [], [cardFmts])

  if (reader.kind === 'standalone') {
    return <StandaloneGeneral reader={reader} />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-subtle)' }}>
          {t('reader:detail.sectionBasic')}
        </p>
        <FieldRow label={t('common:name')} value={readerLabel(reader)} />
        <FieldRow label={t('reader:detail.kind')} value={readerKindLabel(reader.kind)} />
        <FieldRow label={t('device:grid.scp')} value={reader.scpName} />
        <FieldRow label={t('device:grid.sio')} value={formatSioName(reader.sio, reader.sioName)} />
        <FieldRow label={t('common:address')} value={formatReaderAddr(reader.addr)} />
        <FieldRow label={t('common:model')} value={reader.modelName} />
        <FieldRow
          label={t('common:status')}
          value={isDeviceActive(reader.active) ? t('common:active') : t('common:inactive')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-subtle)' }}>
          {t('reader:detail.sectionPinRelay')}
        </p>
        <CheckRow label={t('reader:detail.doorSensor')} disabled />
        <CheckRow label={t('reader:detail.lockRelay')} disabled />
        <CheckRow label={t('reader:detail.rexUse')} disabled />
        <CheckRow label={t('reader:detail.unlockRelay')} disabled />
        <FieldRow label={t('reader:detail.lockDelay')} value="3 sec" />
      </div>

      <div className="flex flex-col gap-1 min-h-0">
        <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-subtle)' }}>
          {t('reader:detail.sectionCardFormat')}
        </p>
        <div
          className="rounded p-2 overflow-y-auto app-scrollbar max-h-48"
          style={{ border: '0.5px solid var(--color-border)' }}
        >
          {formats.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--color-text-subtle)' }}>
              {t('reader:detail.noCardFormats')}
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

const ModeTab = ({ reader }: { reader: ReaderDisplayRow }) => {
  const { t } = useTranslation('reader')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
      <div className="flex flex-col gap-2">
        <FieldRow label={t('detail.defaultMode')} value={formatDefMode(reader.defmode)} />
        <FieldRow label={t('detail.offlineMode')} value={formatOffMode(reader.offmode)} />
        <FieldRow label={t('detail.keypadMode')} value={formatKpadMode(reader.kpadmode)} />
      </div>
      <div className="flex flex-col gap-1">
        <CheckRow label={t('detail.firstCardUnlock')} disabled />
        <CheckRow label={t('detail.multiCardUnlock')} disabled />
        <CheckRow label={t('detail.pinWithCard')} disabled />
      </div>
    </div>
  )
}

const ApbTab = ({ reader }: { reader: ReaderDisplayRow }) => {
  const { t } = useTranslation(['common', 'reader'])

  return (
    <div className="max-w-sm flex flex-col gap-2">
      <FieldRow
        label={t('reader:detail.apbInArea')}
        value={reader.apbin > 0 ? `Area ${reader.apbin}` : t('common:empty')}
      />
      <FieldRow
        label={t('reader:detail.apbOutArea')}
        value={reader.apbto > 0 ? `Area ${reader.apbto}` : t('common:empty')}
      />
      <FieldRow label="Timed APB" value={`${reader.apbdelay} min`} />
    </div>
  )
}

const PairTab = ({ reader }: { reader: ReaderDisplayRow }) => {
  const { t } = useTranslation(['common', 'reader'])

  return (
    <div className="max-w-sm flex flex-col gap-3">
      <FieldRow
        label={t('reader:detail.pairReader')}
        value={reader.pairReaderName || t('common:empty')}
      />
      <CheckRow label={t('reader:detail.paired')} disabled />
    </div>
  )
}

const ProtocolTab = ({ reader }: { reader: ReaderDisplayRow }) => {
  const { t } = useTranslation(['common', 'reader'])

  return (
    <div className="max-w-sm flex flex-col gap-2">
      <FieldRow label={t('reader:detail.protocolType')} value={reader.osdpflag > 0 ? 'OSDP' : 'WIEGAND'} />
      <FieldRow label={t('reader:detail.baudRate')} value="9600" />
      <FieldRow label={t('reader:detail.osdpAddress')} value={String(reader.addr)} />
      {reader.kind === 'bio' ? (
        <FieldRow
          label={t('reader:detail.bioDeviceManager')}
          value={reader.deviceManager ?? t('common:empty')}
        />
      ) : null}
    </div>
  )
}

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
