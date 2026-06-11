import { useEffect, useState } from 'react'
import { ScanLine } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import {
  ReaderDetailContent,
  ReaderKindBadge,
} from '@/pages/ReadersPage/components/ReaderDetailContent'
import { ReaderTabRail } from '@/pages/ReadersPage/components/ReaderTabRail'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readersMockData'
import { readerLabel, tabsForReaderKind } from '@/pages/ReadersPage/utils/readerDisplay'

interface ReaderDetailWorkspaceProps {
  reader: ReaderDisplayRow | null
  useMock: boolean
  layout: 'rail' | 'horizontal'
  onToggleActive?: (active: boolean) => void
}

export const ReaderDetailWorkspace = ({
  reader,
  useMock,
  layout,
  onToggleActive,
}: ReaderDetailWorkspaceProps) => {
  const tabs = reader ? tabsForReaderKind(reader.kind) : []
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? 'general')

  useEffect(() => {
    if (!reader) return
    const next = tabsForReaderKind(reader.kind)
    setActiveTab(next[0]?.key ?? 'general')
  }, [reader?.scp, reader?.id, reader?.kind, reader])

  if (!reader) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6">
        <ScanLine size={28} style={{ color: 'var(--color-text-dim)' }} />
        <p className="text-[15px] text-center" style={{ color: 'var(--color-text-subtle)' }}>
          리더를 선택하세요.
        </p>
      </div>
    )
  }

  const header = (
    <div
      className="flex-shrink-0 flex items-center justify-between gap-2 px-3 py-2"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <ScanLine size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
        <span
          className="text-[15px] font-medium truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {readerLabel(reader)}
        </span>
        <ReaderKindBadge kind={reader.kind} />
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
  )

  const content = (
    <div className="flex-1 min-h-0 overflow-y-auto app-scrollbar p-3">
      <ReaderDetailContent
        reader={reader}
        activeTab={activeTab}
        useMock={useMock}
        onToggleActive={onToggleActive}
      />
    </div>
  )

  if (layout === 'horizontal') {
    return (
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {header}
        <div className="flex-shrink-0">
          <div className="flex border-b" style={{ borderColor: 'var(--color-border)' }}>
            {tabs.map((tab) => {
              const active = tab.key === activeTab
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1 py-2 text-[13px] border-b-2 transition-colors"
                  style={{
                    color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    borderColor: active ? 'var(--color-accent)' : 'transparent',
                    background: 'transparent',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
        {content}
      </div>
    )
  }

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <ReaderTabRail tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {header}
        {content}
      </div>
    </div>
  )
}
