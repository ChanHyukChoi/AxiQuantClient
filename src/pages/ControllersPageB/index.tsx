import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Cpu } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Badge } from '@/components/primitive/Badge'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import { ScpActionButtons } from '@/pages/ControllersPage/components/ScpActionButtons'
import { ScpCreateModal } from '@/pages/ControllersPage/components/ScpCreateModal'
import { useControllersData } from '@/pages/ControllersPage/useControllersData'
import { useScpEditor } from '@/pages/ControllersPage/useScpEditor'
import {
  entityLabel,
  isDeviceActive,
} from '@/pages/DeviceControlPage/utils/deviceHelpers'
import { getScpList } from '@/api/scp'
import { queryKeys } from '@/lib/query/queryKeys'
import type { CreateScpRequest, ScpInfo, SioInfo } from '@/types/api'

const SCP_GRID_COLUMNS: ColumnDef<ScpInfo>[] = [
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
    render: (value) => {
      const active = isDeviceActive(Number(value))
      return (
        <Badge variant={active ? 'on' : 'off'}>{active ? '활성' : '비활성'}</Badge>
      )
    },
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

const SIO_GRID_COLUMNS: ColumnDef<SioInfo>[] = [
  {
    key: 'port',
    header: '포트',
    width: 80,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {Number(value) > 0 ? `PORT ${value}` : '—'}
      </span>
    ),
  },
  {
    key: 'name',
    header: '명칭',
    width: 140,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {entityLabel('sio', row)}
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
  {
    key: 'addr',
    header: '어드레스',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'active',
    header: '상태',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => {
      const active = isDeviceActive(Number(value))
      return (
        <Badge variant={active ? 'on' : 'off'}>{active ? '활성' : '비활성'}</Badge>
      )
    },
  },
]

const InfoField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <span className="text-[13px] block mb-0.5" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    {children}
  </div>
)

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
    onScpDeleted,
  } = useControllersData()

  const editor = useScpEditor({
    scp: selectedScp,
    useMock,
    patchMockScp,
    removeMockScp,
    onDeleted: onScpDeleted,
  })

  const sioGridData = useMemo(() => (selectedScp ? sios : []), [selectedScp, sios])
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
            columns={SCP_GRID_COLUMNS}
            data={filteredScps}
            selectedId={selectedId ?? undefined}
            onRowClick={selectScp}
            onSearch={setSearchQuery}
            searchPlaceholder="주제어기 검색..."
            totalCount={filteredScps.length}
            loading={isLoading}
          />
          {isError ? (
            <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
              주제어기 목록을 불러오지 못했습니다.
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div
            className="flex flex-col flex-shrink-0 overflow-hidden"
            style={{
              width: 240,
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
              주제어기 · 일반
            </div>
            <div className="flex-1 p-3 overflow-y-auto app-scrollbar">
              {selectedScp ? (
                <div className="flex flex-col gap-3">
                  {editor.editMode ? (
                    <>
                      <InfoField label="명칭">
                        <Input {...editor.form.register('name')} />
                      </InfoField>
                      <InfoField label="연결문자열">
                        <Input {...editor.form.register('connstr')} />
                      </InfoField>
                      <InfoField label="모델">
                        <Input type="number" {...editor.form.register('model', { valueAsNumber: true })} />
                      </InfoField>
                      <InfoField label="통신유형">
                        <Input type="number" {...editor.form.register('ctype', { valueAsNumber: true })} />
                      </InfoField>
                    </>
                  ) : (
                    <>
                      <InfoField label="명칭">
                        <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
                          {scpName}
                        </span>
                      </InfoField>
                      <InfoField label="활성">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={isDeviceActive(selectedScp.active)}
                            disabled={editor.isSaving}
                            onChange={editor.handleToggleActive}
                          />
                          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
                            {isDeviceActive(selectedScp.active) ? '활성' : '비활성'}
                          </span>
                        </label>
                      </InfoField>
                      <InfoField label="연결문자열">
                        <span className="text-[14px] font-mono break-all" style={{ color: 'var(--color-text)' }}>
                          {selectedScp.connstr?.trim() || '—'}
                        </span>
                      </InfoField>
                      <InfoField label="모델">
                        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
                          {selectedScp.model}
                        </span>
                      </InfoField>
                      <InfoField label="통신유형">
                        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
                          {selectedScp.ctype}
                        </span>
                      </InfoField>
                    </>
                  )}
                </div>
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
                  — {scpName}에 연결
                </span>
              ) : null}
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              {!selectedScp ? (
                <p
                  className="text-[14px] text-center py-10"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  주제어기를 선택하면 부제어기 목록이 표시됩니다.
                </p>
              ) : siosLoading ? (
                <Grid columns={SIO_GRID_COLUMNS} data={[]} totalCount={0} loading />
              ) : sioGridData.length === 0 ? (
                <p
                  className="text-[14px] text-center py-10 px-4"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  「{scpName}」에 연결된 부제어기가 없습니다.
                </p>
              ) : (
                <Grid columns={SIO_GRID_COLUMNS} data={sioGridData} totalCount={sioGridData.length} />
              )}
            </div>
          </div>
        </div>

        <div
          className="flex-shrink-0 px-3 py-2"
          style={{
            borderTop: '0.5px solid var(--color-border)',
            background: 'var(--color-sidebar)',
          }}
        >
          {editor.actionError ? (
            <p className="text-[13px] text-right mb-1.5" style={{ color: '#c75c5c' }}>
              {editor.actionError}
            </p>
          ) : null}
          <ScpActionButtons
            hasScp={selectedScp != null}
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
