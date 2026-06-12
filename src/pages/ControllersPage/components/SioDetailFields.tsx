import type { UseFormRegister } from 'react-hook-form'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import type { SioFormValues } from '@/pages/ControllersPage/sioFormTypes'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type { SioInfo } from '@/types/api'

interface SioDetailFieldsProps {
  item: SioInfo
  editMode: boolean
  register: UseFormRegister<SioFormValues>
  activePending?: boolean
  onToggleActive?: (active: boolean) => void
  layout?: 'stack' | 'columns'
}

const formatPort = (port: number): string => (port > 0 ? `PORT ${port}` : '—')

export const SioDetailFields = ({
  item,
  editMode,
  register,
  activePending = false,
  onToggleActive,
  layout = 'stack',
}: SioDetailFieldsProps) => {
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
        <DetailInfoField label="포트">
          <Input type="number" {...register('port', { valueAsNumber: true })} />
        </DetailInfoField>
        <DetailInfoField label="어드레스">
          <Input type="number" {...register('addr', { valueAsNumber: true })} />
        </DetailInfoField>
        <DetailInfoField label="모델">
          <Input type="number" {...register('model', { valueAsNumber: true })} />
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
      <DetailInfoField label="포트">
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {formatPort(item.port)}
        </span>
      </DetailInfoField>
      <DetailInfoField label="어드레스">
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {item.addr}
        </span>
      </DetailInfoField>
      <DetailInfoField label="모델">
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {item.model}
        </span>
      </DetailInfoField>
      <DetailInfoField label="활성">
        {onToggleActive ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={isDeviceActive(item.active)}
              disabled={activePending}
              onChange={onToggleActive}
            />
            <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
              {isDeviceActive(item.active) ? '활성' : '비활성'}
            </span>
          </label>
        ) : (
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            {isDeviceActive(item.active) ? '활성' : '비활성'}
          </span>
        )}
      </DetailInfoField>
      {item.ext?.trim() ? (
        <DetailInfoField label="확장">
          <span className="text-[14px] break-all" style={{ color: 'var(--color-text)' }}>
            {item.ext}
          </span>
        </DetailInfoField>
      ) : null}
    </div>
  )
}
