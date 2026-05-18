import { Search } from 'lucide-react'
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
    <>
      <style>{`
        .devices-tree-scroll::-webkit-scrollbar { width: 4px; }
        .devices-tree-scroll::-webkit-scrollbar-track { background: transparent; }
        .devices-tree-scroll::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }
        .devices-tree-search::placeholder { color: var(--color-text-dim); }
      `}</style>

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
          <div
            className="flex items-center gap-1.5 w-full px-2 py-1 rounded"
            style={{
              background: 'var(--color-btn-hover)',
              border: '0.5px solid var(--color-btn-default-border)',
            }}
          >
            <Search style={{ width: 13, height: 13, color: 'var(--color-text-dim)', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              placeholder="장치 검색..."
              onChange={(e) => onSearch(e.target.value)}
              className="devices-tree-search flex-1 text-[12px] outline-none min-w-0"
              style={{ background: 'transparent', color: 'var(--color-text)' }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto devices-tree-scroll">
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
    </>
  )
}

