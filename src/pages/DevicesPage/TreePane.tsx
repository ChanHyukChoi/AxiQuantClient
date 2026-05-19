import { SearchField } from '@/components/ui/SearchField'
import { TreeNode } from '@/pages/DevicesPage/TreeNode'
import type { DeviceTreeNode } from '@/pages/DevicesPage/utils/buildTree'

interface TreePaneProps {
  tree: DeviceTreeNode[]
  selectedKey: string | null
  expandedKeys: Set<string>
  searchQuery: string
  loading: boolean
  error: boolean
  onSearch: (query: string) => void
  onToggle: (key: string) => void
  onSelect: (key: string) => void
}

export const TreePane = ({
  tree,
  selectedKey,
  expandedKeys,
  searchQuery,
  loading,
  error,
  onSearch,
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
          className="flex items-center flex-shrink-0"
          style={{
            padding: '7px 12px',
            background: 'var(--color-sidebar)',
            borderBottom: '0.5px solid var(--color-border)',
          }}
        >
          <SearchField
            value={searchQuery}
            placeholder="장치 검색..."
            onChange={onSearch}
            className="w-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto app-scrollbar">
          {loading ? (
            <p className="text-[12px] text-center py-8" style={{ color: 'var(--color-text-subtle)' }}>
              불러오는 중...
            </p>
          ) : error ? (
            <p className="text-[12px] text-center py-8 px-3" style={{ color: '#c75c5c' }}>
              장치 목록을 불러오지 못했습니다.
            </p>
          ) : tree.length === 0 ? (
            <p className="text-[12px] text-center py-8" style={{ color: 'var(--color-text-subtle)' }}>
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

