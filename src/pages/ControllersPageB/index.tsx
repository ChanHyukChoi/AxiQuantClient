import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Cpu } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Modal } from '@/components/primitive/Modal'
import { ActiveGridMark, ActiveStatusBadge } from '@/components/basic/ActiveStatusBadge'
import { PageHeader } from '@/layouts/PageHeader'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { AddButton } from '@/components/page-actions'
import { useGridColumnLayout } from '@/hooks/ui/useGridColumnLayout'
import { ScpCreateModal } from '@/pages/ControllersPage/components/ScpCreateModal'
import { ScpDetailFields } from '@/pages/ControllersPage/components/ScpDetailFields'
import { ScpTitleActions } from '@/pages/ControllersPage/components/ScpTitleActions'
import { SioWorkspace } from '@/pages/ControllersPage/components/SioWorkspace'
import { useControllersData } from '@/pages/ControllersPage/useControllersData'
import { useScpEditor } from '@/pages/ControllersPage/useScpEditor'
import {
  entityLabel,
  isDeviceActive,
} from '@/pages/DeviceControlPage/utils/deviceHelpers'
import { getScpList } from '@/api/scp'
import { queryKeys } from '@/lib/query/queryKeys'
import type { CreateScpRequest, ScpInfo } from '@/types/api'

const BASE_SCP_GRID_COLUMNS: ColumnDef<ScpInfo>[] = [
  {
    key: 'id',
    header: 'ID',
    width: 56,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'name',
    header: '명칭',
    width: 160,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {entityLabel('scp', row)}
      </span>
    ),
  },
  {
    key: 'active',
    header: '상태',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => <ActiveGridMark active={isDeviceActive(Number(value))} />,
  },
  {
    key: 'connstr',
    header: '연결',
    width: 180,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {typeof value === 'string' && value.trim() ? value : '—'}
      </span>
    ),
  },
  {
    key: 'model',
    header: '모델',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
]

export const ControllersPageB = () => {
  const qc = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)

  const {
    useMock,
    filteredScps,
    selectedId,
    selectedScp,
    sios,
    siosLoading,
    setSearchQuery,
    selectScp,
    isLoading,
    isError,
    patchMockScp,
    addMockScp,
    removeMockScp,
    patchMockSio,
    addMockSio,
    removeMockSio,
    onScpDeleted,
  } = useControllersData()

  const editor = useScpEditor({
    scp: selectedScp,
    useMock,
    patchMockScp,
    removeMockScp,
    onDeleted: onScpDeleted,
  })

  const { columns, layoutGridProps } = useGridColumnLayout(BASE_SCP_GRID_COLUMNS, {
    storageKey: 'axiquant.grid.controllers-scp-b',
  })

  const scpName = selectedScp ? entityLabel('scp', selectedScp) : ''

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

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div
          className="flex flex-col min-h-0 overflow-hidden"
          style={{
            flex: '0 0 42%',
            borderBottom: '0.5px solid var(--color-border)',
          }}
        >
          <Grid
            columns={columns}
            data={filteredScps}
            selectedId={selectedId ?? undefined}
            onRowClick={selectScp}
            onSearch={setSearchQuery}
            searchPlaceholder="주제어기 검색..."
            totalCount={filteredScps.length}
            loading={isLoading}
            {...layoutGridProps}
          />
          {isError ? (
            <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
              주제어기 목록을 불러오지 못했습니다.
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {selectedScp ? (
            <DetailTitleBar
              icon={<Cpu size={14} style={{ color: 'var(--color-accent)' }} />}
              title={scpName}
              badge={<ActiveStatusBadge active={isDeviceActive(selectedScp.active)} />}
              actions={
                <ScpTitleActions
                  hasScp
                  editMode={editor.editMode}
                  isSaving={editor.isSaving}
                  isDeleting={editor.isDeleting}
                  isResetting={editor.isResetting}
                  onEdit={editor.handleEdit}
                  onCancel={editor.handleCancel}
                  onSave={editor.handleSave}
                  onDelete={() => editor.setDeleteOpen(true)}
                  onReset={() => editor.setResetOpen(true)}
                />
              }
            />
          ) : null}
          {editor.actionError ? (
            <p className="text-[13px] px-3 py-1 text-right" style={{ color: '#c75c5c' }}>
              {editor.actionError}
            </p>
          ) : null}

          <div className="flex flex-1 min-h-0 overflow-hidden">
            <div
              className="flex flex-col flex-shrink-0 overflow-hidden"
              style={{
                width: 280,
                borderRight: '0.5px solid var(--color-border)',
                background: 'var(--color-sidebar)',
              }}
            >
              <div
                className="flex-shrink-0 px-3 py-2 text-[14px] font-medium"
                style={{
                  background: 'var(--color-accent-subtle)',
                  color: 'var(--color-accent)',
                  borderBottom: '0.5px solid var(--color-border)',
                }}
              >
                일반
              </div>
              <div className="flex-1 p-3 overflow-y-auto app-scrollbar">
                {selectedScp ? (
                  <ScpDetailFields
                    scp={selectedScp}
                    editMode={editor.editMode}
                    register={editor.form.register}
                    activePending={editor.isSaving}
                    onToggleActive={editor.handleToggleActive}
                    statusInTitleBar
                  />
                ) : (
                  <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
                    상단 목록에서 주제어기를 선택하세요.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <div
                className="flex-shrink-0 px-3 py-2 text-[14px] font-medium"
                style={{
                  background: 'var(--color-sidebar)',
                  borderBottom: '0.5px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                부제어기
                {selectedScp ? (
                  <span className="font-normal ml-1.5" style={{ color: 'var(--color-text-subtle)' }}>
                    — {scpName}
                  </span>
                ) : null}
              </div>
              <SioWorkspace
                scp={selectedScp}
                sios={sios}
                siosLoading={siosLoading}
                useMock={useMock}
                patchMockSio={patchMockSio}
                addMockSio={addMockSio}
                removeMockSio={removeMockSio}
                gridStorageKey="axiquant.grid.controllers-sio-b"
                layout="panel"
              />
            </div>
          </div>
        </div>
      </div>

      <ScpCreateModal
        open={createOpen}
        useMock={useMock}
        onCancel={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />

      <Modal
        open={editor.deleteOpen}
        title="주제어기 삭제"
        description={selectedScp ? `「${scpName}」 주제어기를 삭제하시겠습니까?` : undefined}
        confirmLabel="삭제"
        variant="danger"
        loading={editor.isDeleting}
        onConfirm={editor.handleDeleteConfirm}
        onCancel={() => editor.setDeleteOpen(false)}
      />

      <Modal
        open={editor.resetOpen}
        title="주제어기 초기화"
        description={
          selectedScp
            ? `「${scpName}」 주제어기를 초기화하시겠습니까? 연결된 설정이 재시작될 수 있습니다.`
            : undefined
        }
        confirmLabel="초기화"
        variant="default"
        loading={editor.isResetting}
        onConfirm={editor.handleResetConfirm}
        onCancel={() => editor.setResetOpen(false)}
      />
    </div>
  )
}
