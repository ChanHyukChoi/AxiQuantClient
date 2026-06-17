import { useTranslation } from 'react-i18next'
import { Link2 } from 'lucide-react'
import { DrawerSelectPrompt } from '@/components/basic/DrawerSelectPrompt'
import { ActiveStatusBadge } from '@/components/basic/ActiveStatusBadge'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { LinkageGeneralSection } from '@/pages/LinkagePage/components/LinkageGeneralSection'
import { LinkageThenSection } from '@/pages/LinkagePage/components/LinkageThenSection'
import { LinkageWhenSection } from '@/pages/LinkagePage/components/LinkageWhenSection'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

interface LinkageWorkspaceProps {
  rule: LinkageRule | null
  editMode?: boolean
  titleActions?: React.ReactNode
}

export const LinkageWorkspace = ({
  rule,
  editMode = false,
  titleActions,
}: LinkageWorkspaceProps) => {
  const { t } = useTranslation('linkage')

  if (!rule) {
    return (
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <DrawerSelectPrompt message={t('selectRuleWithPeriod')} />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <DetailTitleBar
        icon={<Link2 size={14} style={{ color: 'var(--color-accent)' }} />}
        title={rule.name}
        badge={<ActiveStatusBadge active={rule.active} />}
        actions={titleActions}
      />

      <LinkageGeneralSection rule={rule} editMode={editMode} />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <LinkageWhenSection rows={rule.when} />
        <LinkageThenSection rows={rule.then} />
      </div>
    </div>
  )
}
