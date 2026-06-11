import { ArrowRightToLine } from 'lucide-react'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import { InputDetailPanel } from '@/pages/InputsPage/components/InputDetailPanel'
import { InputListPane } from '@/pages/InputsPage/components/InputListPane'
import { useInputsData } from '@/pages/InputsPage/useInputsData'

export const InputsPage = () => {
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
  } = useInputsData()

  const handleToggleActive = (active: boolean) => {
    if (!selected) return
    if (useMock) {
      patchMockRow(selected.scp, selected.id, { active: active ? 1 : 0 })
      return
    }
    // TODO: API 연동
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="입력"
        icon={<ArrowRightToLine size={15} />}
        variantPaths={{ a: '/inputs', b: '/inputs-b' }}
        actions={<AddButton onClick={() => undefined} />}
      />

      <div className="flex flex-1 overflow-hidden">
        <InputListPane
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
        <InputDetailPanel
          row={selected}
          useMock={useMock}
          onToggleActive={handleToggleActive}
        />
      </div>
    </div>
  )
}
