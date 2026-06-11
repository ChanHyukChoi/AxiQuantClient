import type { CSSProperties } from 'react'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { LINKAGE_FONT_SIZE } from '@/pages/LinkagePage/linkageUi'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

interface LinkageGeneralSectionProps {
  rule: LinkageRule | null
  layout?: 'stack' | 'compact'
}

const labelStyle: CSSProperties = {
  color: 'var(--color-text-subtle)',
  fontSize: LINKAGE_FONT_SIZE,
}

export const LinkageGeneralSection = ({
  rule,
  layout = 'stack',
}: LinkageGeneralSectionProps) => {
  if (!rule) {
    return (
      <p className="app-text-md" style={{ color: 'var(--color-text-subtle)' }}>
        연동 규칙을 선택하세요.
      </p>
    )
  }

  if (layout === 'compact') {
    return (
      <div className="flex flex-col gap-3">
        <div>
          <span className="app-text-sm block mb-1" style={labelStyle}>
            명칭
          </span>
          <Input value={rule.name} readOnly className="app-text-md" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={rule.active} readOnly />
          <span className="app-text-md" style={{ color: 'var(--color-text)' }}>
            활성
          </span>
        </label>
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
        <Input value={rule.name} readOnly className="app-text-md max-w-xl" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer shrink-0">
        <Checkbox checked={rule.active} readOnly />
        <span className="app-text-md" style={{ color: 'var(--color-text)' }}>
          활성
        </span>
      </label>
    </div>
  )
}
