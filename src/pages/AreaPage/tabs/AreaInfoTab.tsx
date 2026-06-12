import { Controller, type Control } from 'react-hook-form'
import type { UseFormRegister } from 'react-hook-form'
import { Hash, RefreshCw, Settings, SlidersHorizontal, Tag, Users } from 'lucide-react'
import { Badge } from '@/components/primitive/Badge'
import { Button } from '@/components/primitive/Button'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import type { AreaEditFormValues } from '@/pages/AreaPage/formTypes'
import {
  isAreaActive,
  occupancyPercent,
  occupancyRatio,
} from '@/pages/AreaPage/utils/areaHelpers'
import type { AreaInfo } from '@/types/api'

interface AreaInfoTabProps {
  area: AreaInfo
  editMode: boolean
  register: UseFormRegister<AreaEditFormValues>
  control: Control<AreaEditFormValues>
  onResetOccupancy: () => void
  onSetOccupancy: () => void
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p
    className="app-text-md font-medium tracking-wide pb-1.5 mb-2"
    style={{
      color: 'var(--color-text-subtle)',
      borderBottom: '0.5px solid var(--color-border)',
    }}
  >
    {children}
  </p>
)

const FRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) => (
  <div className="flex justify-between items-center py-1 gap-2">
    <span
      className="app-text-md flex items-center gap-1.5 flex-shrink-0"
      style={{ color: 'var(--color-text-subtle)' }}
    >
      {icon}
      {label}
    </span>
    {children}
  </div>
)

export const AreaInfoTab = ({
  area,
  editMode,
  register,
  control,
  onResetOccupancy,
  onSetOccupancy,
}: AreaInfoTabProps) => {
  const ratio = occupancyRatio(area.occup, area.occmax)
  const pct = occupancyPercent(area.occup, area.occmax)

  return (
    <div>
      <SectionTitle>기본 정보</SectionTitle>

      <FRow icon={<Tag size={12} />} label="명칭">
        {editMode ? (
          <Input {...register('name')} style={{ width: 148 }} />
        ) : (
          <span className="app-text-lg text-right" style={{ color: 'var(--color-text)' }}>
            {area.name || '—'}
          </span>
        )}
      </FRow>

      <FRow icon={<Settings size={12} />} label="활성 여부">
        {editMode ? (
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-end gap-2">
                <Checkbox
                  checked={field.value !== 0}
                  onChange={(checked) => field.onChange(checked ? 1 : 0)}
                />
                <span className="app-text-md" style={{ color: 'var(--color-text-muted)' }}>
                  활성
                </span>
              </div>
            )}
          />
        ) : (
          <Badge variant={isAreaActive(area.active) ? 'on' : 'off'}>
            {isAreaActive(area.active) ? '활성' : '비활성'}
          </Badge>
        )}
      </FRow>

      <FRow icon={<Users size={12} />} label="최대 수용">
        {editMode ? (
          <Input
            type="number"
            {...register('occmax', { valueAsNumber: true })}
            style={{ width: 100 }}
          />
        ) : (
          <span className="app-text-lg font-mono text-right" style={{ color: 'var(--color-text)' }}>
            {area.occmax}
          </span>
        )}
      </FRow>

      <FRow icon={<SlidersHorizontal size={12} />} label="다중 점유">
        {editMode ? (
          <Controller
            name="multiocc"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-end">
                <Checkbox
                  checked={field.value !== 0}
                  onChange={(checked) => field.onChange(checked ? 1 : 0)}
                />
              </div>
            )}
          />
        ) : (
          <span className="app-text-lg text-right" style={{ color: 'var(--color-text)' }}>
            {area.multiocc !== 0 ? '허용' : '비허용'}
          </span>
        )}
      </FRow>

      <div className="mt-4" />
      <SectionTitle>현재 점유 현황</SectionTitle>

      <div
        className="rounded-md p-3 mb-3"
        style={{
          border: '0.5px solid var(--color-border)',
          background: 'var(--color-btn-hover)',
        }}
      >
        <div className="flex items-end justify-between gap-2 mb-2">
          <div>
            <p className="app-text-md mb-0.5" style={{ color: 'var(--color-text-subtle)' }}>
              현재 점유
            </p>
            <p
              className="text-[28px] font-semibold leading-none font-mono"
              style={{ color: 'var(--color-accent)' }}
            >
              {area.occup}
            </p>
          </div>
          <div className="text-right">
            <p className="app-text-md" style={{ color: 'var(--color-text-dim)' }}>
              / {area.occmax} · {pct}%
            </p>
            <p className="app-text-sm mt-0.5" style={{ color: 'var(--color-text-dim)' }}>
              퇴장 {area.occdown} · 설정 {area.occset}
            </p>
          </div>
        </div>

        <div
          className="rounded-full overflow-hidden mb-3"
          style={{ height: 6, background: 'var(--color-border)' }}
        >
          <div
            style={{
              height: '100%',
              width: `${ratio * 100}%`,
              background: 'var(--color-accent)',
              transition: 'width 200ms ease',
            }}
          />
        </div>

        <div className="flex gap-1.5">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<RefreshCw size={12} />}
            onClick={onResetOccupancy}
            disabled={editMode}
          >
            점유 초기화
          </Button>
          <Button
            variant="default"
            size="sm"
            leftIcon={<Hash size={12} />}
            onClick={onSetOccupancy}
            disabled={editMode}
          >
            점유 설정
          </Button>
        </div>
      </div>
    </div>
  )
}
