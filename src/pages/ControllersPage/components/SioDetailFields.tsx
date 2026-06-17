import { useTranslation } from 'react-i18next'
import type { UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/primitive/Input'
import { Checkbox } from '@/components/primitive/Checkbox'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import type { SioFormValues } from '@/pages/ControllersPage/sioFormTypes'
import { isDeviceActive } from '@/lib/device/deviceHelpers'
import type { SioInfo } from '@/types/api'

interface SioDetailFieldsProps {
  item: SioInfo
  editMode: boolean
  register: UseFormRegister<SioFormValues>
  activePending?: boolean
  onToggleActive?: (active: boolean) => void
  layout?: 'stack' | 'columns'
  statusInTitleBar?: boolean
}

export const SioDetailFields = ({
  item,
  editMode,
  register,
  activePending = false,
  onToggleActive,
  layout = 'stack',
  statusInTitleBar = false,
}: SioDetailFieldsProps) => {
  const { t } = useTranslation(['common', 'device'])

  const formatPort = (port: number): string =>
    port > 0 ? `PORT ${port}` : t('common:empty')

  const wrapClass =
    layout === 'columns'
      ? 'grid grid-cols-2 gap-x-4 gap-y-3'
      : 'flex flex-col gap-3'

  if (editMode) {
    return (
      <div className={wrapClass}>
        <DetailInfoField label={t('common:name')}>
          <Input {...register('name')} />
        </DetailInfoField>
        <DetailInfoField label={t('common:port')}>
          <Input type="number" {...register('port', { valueAsNumber: true })} />
        </DetailInfoField>
        <DetailInfoField label={t('common:address')}>
          <Input type="number" {...register('addr', { valueAsNumber: true })} />
        </DetailInfoField>
        <DetailInfoField label={t('common:model')}>
          <Input type="number" {...register('model', { valueAsNumber: true })} />
        </DetailInfoField>
        <DetailInfoField label={t('common:status')}>
          <select
            {...register('active', { valueAsNumber: true })}
            className="text-[14px] px-2 py-1 rounded border outline-none w-full"
            style={{
              background: 'var(--color-btn-hover)',
              borderColor: 'var(--color-btn-default-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value={1}>{t('common:active')}</option>
            <option value={0}>{t('common:inactive')}</option>
          </select>
        </DetailInfoField>
        <DetailInfoField label={t('common:extension')}>
          <Input {...register('ext')} />
        </DetailInfoField>
      </div>
    )
  }

  return (
    <div className={wrapClass}>
      <DetailInfoField label={t('common:port')}>
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {formatPort(item.port)}
        </span>
      </DetailInfoField>
      <DetailInfoField label={t('common:address')}>
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {item.addr}
        </span>
      </DetailInfoField>
      <DetailInfoField label={t('common:model')}>
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {item.model}
        </span>
      </DetailInfoField>
      {statusInTitleBar && !onToggleActive ? null : (
        <DetailInfoField label={t('common:status')}>
          {onToggleActive ? (
            <Checkbox
              checked={isDeviceActive(item.active)}
              disabled={activePending}
              onChange={onToggleActive}
            />
          ) : (
            <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
              {isDeviceActive(item.active) ? t('common:active') : t('common:inactive')}
            </span>
          )}
        </DetailInfoField>
      )}
      {item.ext?.trim() ? (
        <DetailInfoField label={t('common:extension')}>
          <span className="text-[14px] break-all" style={{ color: 'var(--color-text)' }}>
            {item.ext}
          </span>
        </DetailInfoField>
      ) : null}
    </div>
  )
}
