import { useTranslation } from 'react-i18next'
import type { CSSProperties } from 'react'
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

const NameValue = ({ name, empty }: { name: string; empty: string }) => (
  <span className="app-text-md" style={{ color: 'var(--color-text)' }}>
    {name.trim() || empty}
  </span>
)

export const LinkageGeneralSection = ({
  rule,
  layout = 'stack',
  editMode = false,
}: LinkageGeneralSectionProps) => {
  const { t } = useTranslation(['linkage', 'common'])

  if (!rule) {
    return (
      <p className="app-text-md" style={{ color: 'var(--color-text-subtle)' }}>
        {t('linkage:selectRuleWithPeriod')}
      </p>
    )
  }

  const nameField = editMode ? (
    <Input defaultValue={rule.name} className="app-text-md max-w-xl" />
  ) : (
    <NameValue name={rule.name} empty={t('common:empty')} />
  )

  const activeField = editMode ? (
    <label className="flex items-center gap-2 cursor-pointer">
      <Checkbox checked={rule.active} onChange={() => undefined} />
      <span className="app-text-md" style={{ color: 'var(--color-text)' }}>
        {t('common:active')}
      </span>
    </label>
  ) : null

  if (layout === 'compact') {
    return (
      <div className="flex flex-col gap-3">
        <div>
          <span className="app-text-sm block mb-1" style={labelStyle}>
            {t('linkage:field.name')}
          </span>
          {nameField}
        </div>
        {activeField ? (
          <div>
            <span className="app-text-sm block mb-1" style={labelStyle}>
              {t('common:active')}
            </span>
            {activeField}
          </div>
        ) : null}
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
          {t('linkage:field.name')}
        </span>
        <div className="min-w-0 flex-1">{nameField}</div>
      </div>
      {activeField ? (
        <div className="flex items-center gap-2 shrink-0">
          <span className="app-text-md shrink-0" style={labelStyle}>
            {t('common:active')}
          </span>
          {activeField}
        </div>
      ) : null}
    </div>
  )
}
