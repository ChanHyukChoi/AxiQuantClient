import { ScanLine } from 'lucide-react'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import { ReaderDetailWorkspace } from '@/pages/ReadersPage/components/ReaderDetailWorkspace'
import { ReaderListPane } from '@/pages/ReadersPage/components/ReaderListPane'
import { useReadersData } from '@/pages/ReadersPage/useReadersData'

export const ReadersPage = () => {
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
    kindFilter,
    setKindFilter,
    isLoading,
    isError,
    patchMockRow,
  } = useReadersData()

  const handleToggleActive = (active: boolean) => {
    if (!selected || !useMock) return
    patchMockRow(selected.scp, selected.id, { active: active ? 1 : 0 })
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="리더"
        icon={<ScanLine size={15} />}
        variantPaths={{ a: '/readers', b: '/readers-b' }}
        actions={<AddButton onClick={() => undefined} />}
      />

      <div className="flex flex-1 overflow-hidden">
        <ReaderListPane
          rows={filteredRows}
          scps={scps}
          selectedKey={selectedKey}
          searchQuery={searchQuery}
          scpFilter={scpFilter}
          kindFilter={kindFilter}
          loading={isLoading}
          error={isError}
          onSearch={setSearchQuery}
          onScpFilterChange={setScpFilter}
          onKindFilterChange={setKindFilter}
          onSelect={selectRow}
        />
        <ReaderDetailWorkspace
          reader={selected}
          useMock={useMock}
          layout="rail"
          onToggleActive={handleToggleActive}
        />
      </div>
    </div>
  )
}
