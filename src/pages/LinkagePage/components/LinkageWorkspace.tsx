import { Link2 } from 'lucide-react'
import { Badge } from '@/components/primitive/Badge'
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
  if (!rule) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6">
        <Link2 size={28} style={{ color: 'var(--color-text-dim)' }} />
        <p className="app-text-md text-center" style={{ color: 'var(--color-text-subtle)' }}>
          연동 규칙을 선택하세요.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <DetailTitleBar
        icon={<Link2 size={14} style={{ color: 'var(--color-accent)' }} />}
        title={rule.name}
        badge={
          <Badge variant={rule.active ? 'on' : 'off'}>{rule.active ? '활성' : '비활성'}</Badge>
        }
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
