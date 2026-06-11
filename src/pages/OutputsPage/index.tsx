import { ArrowLeftFromLine } from 'lucide-react'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import { OutputDetailPanel } from '@/pages/OutputsPage/components/OutputDetailPanel'
import { OutputListPane } from '@/pages/OutputsPage/components/OutputListPane'
import { useOutputsData } from '@/pages/OutputsPage/useOutputsData'

export const OutputsPage = () => {
  const {
    useMock,
    scps,
    filteredRows,
    selected,
    selectedKey,
    selectRow,
    searchQuery,
    setSearchQuery,
    scpFilter,
    setScpFilter,
    isLoading,
    isError,
    patchMockRow,
  } = useOutputsData()

  const handleToggleActive = (active: boolean) => {
    if (!selected) return
    if (useMock) {
      patchMockRow(selected.scp, selected.id, { active: active ? 1 : 0 })
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="출력"
        icon={<ArrowLeftFromLine size={15} />}
        variantPaths={{ a: '/outputs', b: '/outputs-b' }}
        actions={<AddButton onClick={() => undefined} />}
      />

      <div className="flex flex-1 overflow-hidden">
        <OutputListPane
          rows={filteredRows}
          scps={scps}
          selectedKey={selectedKey}
          searchQuery={searchQuery}
          scpFilter={scpFilter}
          loading={isLoading}
          error={isError}
          onSearch={setSearchQuery}
          onScpFilterChange={setScpFilter}
          onSelect={selectRow}
        />
        <OutputDetailPanel
          row={selected}
          useMock={useMock}
          onToggleActive={handleToggleActive}
        />
      </div>
    </div>
  )
}
