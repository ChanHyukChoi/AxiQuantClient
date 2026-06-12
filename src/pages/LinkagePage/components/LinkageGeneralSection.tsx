import type { CSSProperties } from 'react'
import { Badge } from '@/components/primitive/Badge'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { LINKAGE_FONT_SIZE } from '@/pages/LinkagePage/linkageUi'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

interface LinkageGeneralSectionProps {
  rule: LinkageRule | null
  layout?: 'stack' | 'compact'
  editMode?: boolean
}

const labelStyle: CSSProperties = {
  color: 'var(--color-text-subtle)',
  fontSize: LINKAGE_FONT_SIZE,
}

const NameValue = ({ name }: { name: string }) => (
  <span className="app-text-md" style={{ color: 'var(--color-text)' }}>
    {name.trim() || '—'}
  </span>
)

const ActiveField = ({
  active,
  editMode,
}: {
  active: boolean
  editMode: boolean
}) => {
  if (editMode) {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox checked={active} onChange={() => undefined} />
        <span className="app-text-md" style={{ color: 'var(--color-text)' }}>
          활성
        </span>
      </label>
    )
  }

  return (
    <Badge variant={active ? 'on' : 'off'}>{active ? '활성' : '비활성'}</Badge>
  )
}

export const LinkageGeneralSection = ({
  rule,
  layout = 'stack',
  editMode = false,
}: LinkageGeneralSectionProps) => {
  if (!rule) {
    return (
      <p className="app-text-md" style={{ color: 'var(--color-text-subtle)' }}>
        연동 규칙을 선택하세요.
      </p>
    )
  }

  const nameField = editMode ? (
    <Input defaultValue={rule.name} className="app-text-md max-w-xl" />
  ) : (
    <NameValue name={rule.name} />
  )

  if (layout === 'compact') {
    return (
      <div className="flex flex-col gap-3">
        <div>
          <span className="app-text-sm block mb-1" style={labelStyle}>
            명칭
          </span>
          {nameField}
        </div>
        <div>
          <span className="app-text-sm block mb-1" style={labelStyle}>
            활성
          </span>
          <ActiveField active={rule.active} editMode={editMode} />
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-6 flex-wrap px-3 py-2"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="app-text-md shrink-0" style={labelStyle}>
          명칭
        </span>
        <div className="min-w-0 flex-1">{nameField}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="app-text-md shrink-0" style={labelStyle}>
          활성
        </span>
        <ActiveField active={rule.active} editMode={editMode} />
      </div>
    </div>
  )
}
