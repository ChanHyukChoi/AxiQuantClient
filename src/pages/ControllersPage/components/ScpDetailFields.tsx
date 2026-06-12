import type { UseFormRegister } from 'react-hook-form'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import type { ScpFormValues } from '@/pages/ControllersPage/scpFormTypes'
import { entityLabel, isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type { ScpInfo } from '@/types/api'

interface ScpDetailFieldsProps {
  scp: ScpInfo
  editMode: boolean
  register: UseFormRegister<ScpFormValues>
  activePending?: boolean
  onToggleActive?: (active: boolean) => void
  layout?: 'stack' | 'columns'
}

export const ScpDetailFields = ({
  scp,
  editMode,
  register,
  activePending = false,
  onToggleActive,
  layout = 'stack',
}: ScpDetailFieldsProps) => {
  const wrapClass =
    layout === 'columns'
      ? 'grid grid-cols-2 gap-x-4 gap-y-3'
      : 'flex flex-col gap-3'

  if (editMode) {
    return (
      <div className={wrapClass}>
        <DetailInfoField label="명칭">
          <Input {...register('name')} />
        </DetailInfoField>
        <DetailInfoField label="연결문자열">
          <Input {...register('connstr')} />
        </DetailInfoField>
        <DetailInfoField label="모델">
          <Input type="number" {...register('model', { valueAsNumber: true })} />
        </DetailInfoField>
        <DetailInfoField label="통신유형">
          <Input type="number" {...register('ctype', { valueAsNumber: true })} />
        </DetailInfoField>
        <DetailInfoField label="활성">
          <select
            {...register('active', { valueAsNumber: true })}
            className="text-[14px] px-2 py-1 rounded border outline-none w-full"
            style={{
              background: 'var(--color-btn-hover)',
              borderColor: 'var(--color-btn-default-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value={1}>활성</option>
            <option value={0}>비활성</option>
          </select>
        </DetailInfoField>
        <DetailInfoField label="확장">
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
      <DetailInfoField label="명칭">
        <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
          {entityLabel('scp', scp)}
        </span>
      </DetailInfoField>
      <DetailInfoField label="활성">
        {onToggleActive ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={isDeviceActive(scp.active)}
              disabled={activePending}
              onChange={onToggleActive}
            />
            <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
              {isDeviceActive(scp.active) ? '활성' : '비활성'}
            </span>
          </label>
        ) : (
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            {isDeviceActive(scp.active) ? '활성' : '비활성'}
          </span>
        )}
      </DetailInfoField>
      <DetailInfoField label="연결문자열">
        <span className="text-[14px] font-mono break-all" style={{ color: 'var(--color-text)' }}>
          {scp.connstr?.trim() || '—'}
        </span>
      </DetailInfoField>
      <DetailInfoField label="모델">
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {scp.model}
        </span>
      </DetailInfoField>
      <DetailInfoField label="통신유형">
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {scp.ctype}
        </span>
      </DetailInfoField>
      {scp.ext?.trim() ? (
        <DetailInfoField label="확장">
          <span className="text-[14px] break-all" style={{ color: 'var(--color-text)' }}>
            {scp.ext}
          </span>
        </DetailInfoField>
      ) : null}
    </div>
  )
}
