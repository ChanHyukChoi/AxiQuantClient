import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { CSSProperties } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import {
  LINKAGE_FONT_SIZE,
  LINKAGE_GRID_HEADER_FONT_SIZE,
  linkagePanelHeaderStyle,
} from '@/pages/LinkagePage/linkageUi'
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

export const LinkageWhenSection = ({ rows, compact = false }: LinkageWhenSectionProps) => {
  const { t } = useTranslation(['linkage', 'common'])

  const headers = useMemo(
    () => [
      t('linkage:when.column.event'),
      t('linkage:when.column.controller'),
      t('linkage:when.column.device'),
      t('linkage:when.column.formula'),
      t('linkage:when.column.invert'),
    ],
    [t],
  )

  return (
    <div className={`flex flex-col min-h-0 overflow-hidden ${compact ? 'h-full' : 'flex-1'}`}>
      <div
        className="flex-shrink-0 flex items-center justify-between gap-2 px-3 py-2 app-text-md font-medium"
        style={linkagePanelHeaderStyle}
      >
        <span>{t('linkage:when.title')}</span>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="default"
            leftIcon={<Plus size={14} />}
            title={t('common:add')}
          />
          <Button
            size="sm"
            variant="default"
            leftIcon={<Trash2 size={14} />}
            title={t('common:delete')}
          />
          <Button
            size="sm"
            variant="default"
            leftIcon={<ArrowUp size={14} />}
            title={t('linkage:action.moveUp')}
          />
          <Button
            size="sm"
            variant="default"
            leftIcon={<ArrowDown size={14} />}
            title={t('linkage:action.moveDown')}
          />
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
              {headers.map((h) => (
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
                  {t('linkage:when.empty')}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td style={tdStyle}>{row.event}</td>
                  <td style={tdStyle}>{row.controller}</td>
                  <td style={tdStyle}>{row.device}</td>
                  <td style={tdStyle}>{row.formula || t('common:empty')}</td>
                  <td style={tdStyle}>{row.invert ? t('linkage:yes') : t('linkage:no')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
