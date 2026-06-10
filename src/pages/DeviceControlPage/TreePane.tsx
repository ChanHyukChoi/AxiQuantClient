import { SearchField } from '@/components/primitive/SearchField'
import { TreeNode } from '@/pages/DeviceControlPage/TreeNode'
import type { DeviceTreeNode } from '@/pages/DeviceControlPage/utils/buildTree'
import type { DeviceTypeFilter } from '@/pages/DeviceControlPage/utils/deviceHelpers'

interface TreePaneProps {
  tree: DeviceTreeNode[]
  selectedKey: string | null
  expandedKeys: Set<string>
  searchQuery: string
  typeFilter: DeviceTypeFilter
  loading: boolean
  error: boolean
  modulesLoading: boolean
  onSearch: (query: string) => void
  onTypeFilterChange: (filter: DeviceTypeFilter) => void
  onToggle: (key: string) => void
  onSelect: (key: string) => void
}

const FILTER_OPTIONS: Array<{ value: DeviceTypeFilter; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'reader', label: '리더' },
  { value: 'input', label: '입력' },
  { value: 'output', label: '출력' },
]

export const TreePane = ({
  tree,
  selectedKey,
  expandedKeys,
  searchQuery,
  typeFilter,
  loading,
  error,
  modulesLoading,
  onSearch,
  onTypeFilterChange,
  onToggle,
  onSelect,
}: TreePaneProps) => {
  const countNodes = (nodes: DeviceTreeNode[]): number =>
    nodes.reduce((acc, n) => acc + 1 + (n.children ? countNodes(n.children) : 0), 0)

  const total = countNodes(tree)

  return (
    <div
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{ width: 240, borderRight: '0.5px solid var(--color-border)' }}
    >
      <div
        className="flex flex-col gap-2 flex-shrink-0"
        style={{
          padding: '7px 12px',
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <SearchField
          value={searchQuery}
          placeholder="장치명 검색..."
          onChange={onSearch}
        />
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-1 cursor-pointer text-[11px]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <input
                type="checkbox"
                checked={typeFilter === opt.value}
                onChange={() => onTypeFilterChange(opt.value)}
                className="accent-[var(--color-accent)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto app-scrollbar">
        {loading ? (
          <p
            className="text-[12px] text-center py-8"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            불러오는 중...
          </p>
        ) : error ? (
          <p className="text-[12px] text-center py-8 px-3" style={{ color: '#c75c5c' }}>
            장치 목록을 불러오지 못했습니다.
          </p>
        ) : tree.length === 0 ? (
          <p
            className="text-[12px] text-center py-8"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            {searchQuery.trim() ? '검색 결과가 없습니다.' : '등록된 장치가 없습니다.'}
          </p>
        ) : (
          tree.map((node) => (
            <TreeNode
              key={node.key}
              node={node}
              depth={0}
              selectedKey={selectedKey}
              expandedKeys={expandedKeys}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))
        )}
        {modulesLoading && !loading ? (
          <p
            className="text-[11px] text-center py-2"
            style={{ color: 'var(--color-text-dim)' }}
          >
            모듈 상태 갱신 중...
          </p>
        ) : null}
      </div>

      <div
        className="flex-shrink-0 flex items-center text-[11px]"
        style={{
          padding: '5px 12px',
          background: 'var(--color-sidebar)',
          borderTop: '0.5px solid var(--color-border)',
          color: 'var(--color-text-dim)',
        }}
      >
        표시 {total}건
      </div>
    </div>
  )
}
