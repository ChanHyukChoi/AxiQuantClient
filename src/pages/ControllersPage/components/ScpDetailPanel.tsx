import { useState } from 'react'
import { Cpu, Info, Layers } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Modal } from '@/components/primitive/Modal'
import type { TabItem } from '@/components/primitive/Tab'
import { ActiveStatusBadge } from '@/components/basic/ActiveStatusBadge'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { ScpDetailFields } from '@/pages/ControllersPage/components/ScpDetailFields'
import { ScpTitleActions } from '@/pages/ControllersPage/components/ScpTitleActions'
import { SioWorkspace } from '@/pages/ControllersPage/components/SioWorkspace'
import { useScpEditor } from '@/pages/ControllersPage/useScpEditor'
import { entityLabel, isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type { CreateSioRequest, ScpInfo, SioInfo } from '@/types/api'

interface ScpDetailPanelProps {
  scp: ScpInfo | null
  sios: SioInfo[]
  siosLoading: boolean
  useMock: boolean
  patchMockScp: (id: number, patch: Partial<ScpInfo>) => void
  removeMockScp: (id: number) => void
  patchMockSio: (scpId: number, id: number, patch: Partial<SioInfo>) => void
  addMockSio: (scpId: number, data: CreateSioRequest) => number
  removeMockSio: (scpId: number, id: number) => void
  onDeleted?: () => void
}

export const ScpDetailPanel = ({
  scp,
  sios,
  siosLoading,
  useMock,
  patchMockScp,
  removeMockScp,
  patchMockSio,
  addMockSio,
  removeMockSio,
  onDeleted,
}: ScpDetailPanelProps) => {
  const [activeTab, setActiveTab] = useState<'info' | 'sios'>('info')

  const editor = useScpEditor({
    scp,
    useMock,
    patchMockScp,
    removeMockScp,
    onDeleted,
  })

  if (!scp) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center gap-2 px-6"
        style={{ background: 'var(--color-sidebar)' }}
      >
        <p className="text-[15px] text-center" style={{ color: 'var(--color-text-subtle)' }}>
          왼쪽에서 주제어기를 선택하세요.
        </p>
        <p className="text-[14px] text-center max-w-sm" style={{ color: 'var(--color-text-dim)' }}>
          선택한 주제어기의 정보와 연결된 부제어기를 관리할 수 있습니다.
        </p>
      </div>
    )
  }

  const scpName = entityLabel('scp', scp)

  const drawerTabs: TabItem[] = [
    { key: 'info', label: '일반', icon: <Info size={12} /> },
    {
      key: 'sios',
      label: `부제어기${siosLoading ? '' : ` (${sios.length})`}`,
      icon: <Layers size={12} /> },
  ]

  return (
    <>
      <Drawer
        fill
        borderLeft={false}
        header={
          <DetailTitleBar
            icon={<Cpu size={14} style={{ color: 'var(--color-accent)' }} />}
            title={scpName}
            badge={<ActiveStatusBadge active={isDeviceActive(scp.active)} />}
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
        }
        tabs={drawerTabs}
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as 'info' | 'sios')}
        footer={
          editor.actionError ? (
            <p className="text-[13px] px-1" style={{ color: '#c75c5c' }}>
              {editor.actionError}
            </p>
          ) : undefined
        }
      >
        {activeTab === 'info' ? (
          <ScpDetailFields
            scp={scp}
            editMode={editor.editMode}
            register={editor.form.register}
            activePending={editor.isSaving}
            onToggleActive={editor.handleToggleActive}
            statusInTitleBar
          />
        ) : (
          <SioWorkspace
            scp={scp}
            sios={sios}
            siosLoading={siosLoading}
            useMock={useMock}
            patchMockSio={patchMockSio}
            addMockSio={addMockSio}
            removeMockSio={removeMockSio}
            gridStorageKey="axiquant.grid.controllers-sio-a"
            layout="stack"
          />
        )}
      </Drawer>

      <Modal
        open={editor.deleteOpen}
        title="주제어기 삭제"
        description={`「${scpName}」 주제어기를 삭제하시겠습니까?`}
        confirmLabel="삭제"
        variant="danger"
        loading={editor.isDeleting}
        onConfirm={editor.handleDeleteConfirm}
        onCancel={() => editor.setDeleteOpen(false)}
      />

      <Modal
        open={editor.resetOpen}
        title="주제어기 초기화"
        description={`「${scpName}」 주제어기를 초기화하시겠습니까? 연결된 설정이 재시작될 수 있습니다.`}
        confirmLabel="초기화"
        variant="default"
        loading={editor.isResetting}
        onConfirm={editor.handleResetConfirm}
        onCancel={() => editor.setResetOpen(false)}
      />
    </>
  )
}
