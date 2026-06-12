import type { CSSProperties } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { LINKAGE_FONT_SIZE, LINKAGE_GRID_HEADER_FONT_SIZE, linkagePanelHeaderStyle } from '@/pages/LinkagePage/linkageUi'
import type { LinkageWhenRow } from '@/pages/LinkagePage/linkageTypes'

interface LinkageWhenSectionProps {
  rows: LinkageWhenRow[]
  compact?: boolean
}

const thStyle: CSSProperties = {
  padding: '6px 10px',
  textAlign: 'left',
  fontSize: LINKAGE_GRID_HEADER_FONT_SIZE,
  fontWeight: 500,
  color: 'var(--color-text-dim)',
  borderBottom: '0.5px solid var(--color-border)',
  whiteSpace: 'nowrap',
}

const tdStyle: CSSProperties = {
  padding: '6px 10px',
  fontSize: LINKAGE_FONT_SIZE,
  color: 'var(--color-cell)',
  borderBottom: '0.5px solid var(--color-border-subtle)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const LinkageWhenSection = ({ rows, compact = false }: LinkageWhenSectionProps) => (
  <div className={`flex flex-col min-h-0 overflow-hidden ${compact ? 'h-full' : 'flex-1'}`}>
    <div
      className="flex-shrink-0 flex items-center justify-between gap-2 px-3 py-2 app-text-md font-medium"
      style={linkagePanelHeaderStyle}
    >
      <span>조건 (When)</span>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="default" leftIcon={<Plus size={14} />} title="추가" />
        <Button size="sm" variant="default" leftIcon={<Trash2 size={14} />} title="삭제" />
        <Button size="sm" variant="default" leftIcon={<ArrowUp size={14} />} title="위로" />
        <Button size="sm" variant="default" leftIcon={<ArrowDown size={14} />} title="아래로" />
        <span
          className="mx-1"
          style={{ width: 1, height: 18, background: 'var(--color-border)' }}
        />
        {(['AND', 'OR', 'NOT'] as const).map((op) => (
          <Button key={op} size="sm" variant="default">
            {op}
          </Button>
        ))}
      </div>
    </div>

    <div className="flex-1 overflow-auto app-scrollbar min-h-0">
      <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
        <thead
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            background: 'var(--color-sidebar)',
          }}
        >
          <tr>
            {['이벤트', '제어기', '장치', '수식', '반전'].map((h) => (
              <th key={h} style={thStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-6 app-text-md"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                조건이 없습니다.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td style={tdStyle}>{row.event}</td>
                <td style={tdStyle}>{row.controller}</td>
                <td style={tdStyle}>{row.device}</td>
                <td style={tdStyle}>{row.formula || '—'}</td>
                <td style={tdStyle}>{row.invert ? '예' : '아니오'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)
