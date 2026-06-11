import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Cpu } from 'lucide-react'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import { ScpCreateModal } from '@/pages/ControllersPage/components/ScpCreateModal'
import { ScpDetailPanel } from '@/pages/ControllersPage/components/ScpDetailPanel'
import { ScpListPane } from '@/pages/ControllersPage/components/ScpListPane'
import { useControllersData } from '@/pages/ControllersPage/useControllersData'
import { getScpList } from '@/api/scp'
import { queryKeys } from '@/lib/query/queryKeys'
import type { CreateScpRequest } from '@/types/api'

export const ControllersPage = () => {
  const qc = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)

  const {
    useMock,
    filteredScps,
    selectedId,
    selectedScp,
    sios,
    siosLoading,
    sioCountByScpId,
    searchQuery,
    setSearchQuery,
    selectScp,
    isLoading,
    isError,
    patchMockScp,
    addMockScp,
    removeMockScp,
    onScpDeleted,
  } = useControllersData()

  const handleCreated = useCallback(
    async (data: CreateScpRequest) => {
      setCreateOpen(false)
      if (useMock) {
        addMockScp(data)
        return
      }
      const list = await qc.fetchQuery({
        queryKey: queryKeys.deviceControl.scps(),
        queryFn: getScpList,
      })
      const created = list?.find((s) => s.name === data.name)
      if (created) selectScp(created)
    },
    [useMock, addMockScp, qc, selectScp],
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="제어기"
        icon={<Cpu size={15} />}
        variantPaths={{ a: '/controllers', b: '/controllers-b' }}
        actions={<AddButton onClick={() => setCreateOpen(true)} />}
      />

      <div className="flex flex-1 overflow-hidden">
        <ScpListPane
          scps={filteredScps}
          selectedId={selectedId}
          searchQuery={searchQuery}
          loading={isLoading}
          error={isError}
          sioCountByScpId={sioCountByScpId}
          onSearch={setSearchQuery}
          onSelect={selectScp}
        />
        <ScpDetailPanel
          scp={selectedScp}
          sios={sios}
          siosLoading={siosLoading}
          useMock={useMock}
          patchMockScp={patchMockScp}
          removeMockScp={removeMockScp}
          onDeleted={onScpDeleted}
        />
      </div>

      <ScpCreateModal
        open={createOpen}
        useMock={useMock}
        onCancel={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}
