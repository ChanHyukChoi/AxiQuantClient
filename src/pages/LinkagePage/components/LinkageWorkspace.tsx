import { Link2 } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { LinkageGeneralSection } from '@/pages/LinkagePage/components/LinkageGeneralSection'
import { LinkageThenSection } from '@/pages/LinkagePage/components/LinkageThenSection'
import { LinkageWhenSection } from '@/pages/LinkagePage/components/LinkageWhenSection'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

interface LinkageWorkspaceProps {
  rule: LinkageRule | null
}

export const LinkageWorkspace = ({ rule }: LinkageWorkspaceProps) => {
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
      <div
        className="flex-shrink-0 flex items-center justify-between gap-2 px-3 py-2"
        style={{ borderBottom: '0.5px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Link2 size={15} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <span className="app-text-md font-medium truncate" style={{ color: 'var(--color-text)' }}>
            {rule.name}
          </span>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <Button variant="default" size="sm" onClick={() => undefined}>
            수정
          </Button>
          <Button variant="danger" size="sm" onClick={() => undefined}>
            삭제
          </Button>
        </div>
      </div>

      <LinkageGeneralSection rule={rule} />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <LinkageWhenSection rows={rule.when} />
        <LinkageThenSection rows={rule.then} />
      </div>
    </div>
  )
}
