import type { UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/primitive/Input'
import { Checkbox } from '@/components/primitive/Checkbox'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import type { ScpFormValues } from '@/pages/ControllersPage/scpFormTypes'
import { entityLabel, isDeviceActive } from '@/lib/device/deviceHelpers'
import type { ScpInfo } from '@/types/api'

interface ScpDetailFieldsProps {
  scp: ScpInfo
  editMode: boolean
  register: UseFormRegister<ScpFormValues>
  activePending?: boolean
  onToggleActive?: (active: boolean) => void
  layout?: 'stack' | 'columns'
  /** ?ù?ùù??? ?ù? ?ù?? ?ù?ù??? ???ù? ?ù? ?ù? ?ù? (?ùù?ù??ùù?) */
  statusInTitleBar?: boolean
}

export const ScpDetailFields = ({
  scp,
  editMode,
  register,
  activePending = false,
  onToggleActive,
  layout = 'stack',
  statusInTitleBar = false,
}: ScpDetailFieldsProps) => {
  const wrapClass =
    layout === 'columns'
      ? 'grid grid-cols-2 gap-x-4 gap-y-3'
      : 'flex flex-col gap-3'

  if (editMode) {
    return (
      <div className={wrapClass}>
        <DetailInfoField label="??">
          <Input {...register('name')} />
        </DetailInfoField>
        <DetailInfoField label="?ù?????>
          <Input {...register('connstr')} />
        </DetailInfoField>
        <DetailInfoField label="??">
          <Input type="number" {...register('model', { valueAsNumber: true })} />
        </DetailInfoField>
        <DetailInfoField label="?ù??ù?">
          <Input type="number" {...register('ctype', { valueAsNumber: true })} />
        </DetailInfoField>
        <DetailInfoField label="?ù?">
          <select
            {...register('active', { valueAsNumber: true })}
            className="text-[14px] px-2 py-1 rounded border outline-none w-full"
            style={{
              background: 'var(--color-btn-hover)',
              borderColor: 'var(--color-btn-default-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value={1}>?ù?</option>
            <option value={0}>????/option>
          </select>
        </DetailInfoField>
        <DetailInfoField label="?ù?">
          <Input {...register('ext')} />
        </DetailInfoField>
      </div>
    )
  }

  return (
    <div className={wrapClass}>
      <DetailInfoField label="ID">
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {scp.id}
        </span>
      </DetailInfoField>
      <DetailInfoField label="??">
        <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
          {entityLabel('scp', scp)}
        </span>
      </DetailInfoField>
      {statusInTitleBar && !onToggleActive ? null : (
        <DetailInfoField label="?ù?">
          {onToggleActive ? (
            <Checkbox
              checked={isDeviceActive(scp.active)}
              disabled={activePending}
              onChange={onToggleActive}
            />
          ) : (
            <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
              {isDeviceActive(scp.active) ? '?ù?' : '????}
            </span>
          )}
        </DetailInfoField>
      )}
      <DetailInfoField label="?ù?????>
        <span className="text-[14px] font-mono break-all" style={{ color: 'var(--color-text)' }}>
          {scp.connstr?.trim() || '??}
        </span>
      </DetailInfoField>
      <DetailInfoField label="??">
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {scp.model}
        </span>
      </DetailInfoField>
      <DetailInfoField label="?ù??ù?">
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {scp.ctype}
        </span>
      </DetailInfoField>
      {scp.ext?.trim() ? (
        <DetailInfoField label="?ù?">
          <span className="text-[14px] break-all" style={{ color: 'var(--color-text)' }}>
            {scp.ext}
          </span>
        </DetailInfoField>
      ) : null}
    </div>
  )
}
