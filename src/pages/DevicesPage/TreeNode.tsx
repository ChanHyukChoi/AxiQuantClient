import { ChevronDown, ChevronRight } from 'lucide-react'
import type { DeviceTreeNode } from '@/pages/DevicesPage/utils/buildTree'
import {
  DEVICE_ICON_COLORS,
  DEVICE_ICONS,
  statusDotColor,
} from '@/pages/DevicesPage/utils/deviceHelpers'

interface TreeNodeProps {
  node: DeviceTreeNode
  depth: number
  selectedKey: string | null
  expandedKeys: Set<string>
  onToggle: (key: string) => void
  onSelect: (key: string) => void
}

export const TreeNode = ({
  node,
  depth,
  selectedKey,
  expandedKeys,
  onToggle,
  onSelect,
}: TreeNodeProps) => {
  const hasChildren = (node.children?.length ?? 0) > 0
  const isExpanded = expandedKeys.has(node.key)
  const isSelected = selectedKey === node.key
  const isGroup = node.kind === 'group'

  const Icon = node.kind === 'group' ? null : DEVICE_ICONS[node.kind]
  const iconColor = node.kind === 'group' ? undefined : DEVICE_ICON_COLORS[node.kind]

  const handleRowClick = () => {
    onSelect(node.key)
  }

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle(node.key)
  }

  return (
    <>
      <TreeRow depth={depth} isSelected={isSelected} onClick={handleRowClick}>
        <span className="flex items-center flex-shrink-0" style={{ width: 16 }}>
          {hasChildren ? (
            <button
              type="button"
              onClick={handleChevronClick}
              className="flex items-center justify-center p-0 border-0 bg-transparent cursor-pointer"
              style={{ color: 'var(--color-text-dim)' }}
              aria-label={isExpanded ? '접기' : '펼치기'}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span style={{ width: 14 }} />
          )}
        </span>

        {Icon ? (
          <Icon size={14} strokeWidth={1.8} style={{ color: iconColor, flexShrink: 0 }} />
        ) : (
          <span style={{ width: 14 }} />
        )}

        <span
          className="flex-1 text-[12px] truncate min-w-0"
          style={{
            color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)',
            fontWeight: isGroup ? 500 : 400,
          }}
        >
          {node.label}
        </span>

        {isSelected && !isGroup ? (
          <span
            className="flex-shrink-0 rounded-full"
            style={{
              width: 7,
              height: 7,
              backgroundColor: statusDotColor(node.active),
            }}
            title={node.active !== 0 ? '활성' : '비활성'}
          />
        ) : null}
      </TreeRow>

      {hasChildren && isExpanded
        ? node.children!.map((child) => (
            <TreeNode
              key={child.key}
              node={child}
              depth={depth + 1}
              selectedKey={selectedKey}
              expandedKeys={expandedKeys}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))
        : null}
    </>
  )
}

const TreeRow = ({
  depth,
  isSelected,
  onClick,
  children,
}: {
  depth: number
  isSelected: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick()
      }
    }}
    className="flex items-center gap-1.5 py-1.5 pr-2.5 cursor-pointer"
    style={{
      paddingLeft: 8 + depth * 14,
      background: isSelected ? 'var(--color-row-selected)' : 'transparent',
      borderRight: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
    }}
    onMouseEnter={(e) => {
      if (!isSelected)
        (e.currentTarget as HTMLDivElement).style.background = 'var(--color-btn-hover)'
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.background = isSelected
        ? 'var(--color-row-selected)'
        : 'transparent'
    }}
  >
    {children}
  </div>
)
