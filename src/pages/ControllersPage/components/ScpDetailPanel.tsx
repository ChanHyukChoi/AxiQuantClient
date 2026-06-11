import { useState } from 'react'
import type { UseFormRegister } from 'react-hook-form'
import { ChevronRight, Cpu, Info, Layers, Settings } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Badge } from '@/components/primitive/Badge'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { ScpActionButtons } from '@/pages/ControllersPage/components/ScpActionButtons'
import { useScpEditor } from '@/pages/ControllersPage/useScpEditor'
import type { ScpFormValues } from '@/pages/ControllersPage/scpFormTypes'
import {
  entityLabel,
  isDeviceActive,
} from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type { ScpInfo, SioInfo } from '@/types/api'

interface ScpDetailPanelProps {
  scp: ScpInfo | null
  sios: SioInfo[]
  siosLoading: boolean
  useMock: boolean
  patchMockScp: (id: number, patch: Partial<ScpInfo>) => void
  removeMockScp: (id: number) => void
  onDeleted?: () => void
}

const FieldRow = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex justify-between items-center py-1.5 gap-4">
    <span className="text-[14px] shrink-0" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    <span
      className={['text-[15px] text-right break-all', mono ? 'font-mono' : ''].filter(Boolean).join(' ')}
      style={{ color: 'var(--color-text)' }}
    >
      {value}
    </span>
  </div>
)

const EditFieldRow = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="flex justify-between items-center py-1.5 gap-4">
    <span className="text-[14px] shrink-0" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    <div className="min-w-0 flex-1 flex justify-end">{children}</div>
  </div>
)

const formatPort = (port: number): string => (port > 0 ? `PORT ${port}` : '—')

const ScpInfoTab = ({
  scp,
  editMode,
  register,
  activePending,
  onToggleActive,
}: {
  scp: ScpInfo
  editMode: boolean
  register: UseFormRegister<ScpFormValues>
  activePending: boolean
  onToggleActive: (active: boolean) => void
}) => (
  <div>
    <FieldRow label="ID" value={String(scp.id)} mono />
    {editMode ? (
      <>
        <EditFieldRow label="명칭">
          <Input {...register('name')} style={{ width: 180 }} />
        </EditFieldRow>
        <EditFieldRow label="활성">
          <select
            {...register('active', { valueAsNumber: true })}
            className="text-[14px] px-2 py-1 rounded border outline-none"
            style={{
              width: 100,
              background: 'var(--color-btn-hover)',
              borderColor: 'var(--color-btn-default-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value={1}>활성</option>
            <option value={0}>비활성</option>
          </select>
        </EditFieldRow>
        <EditFieldRow label="연결문자열">
          <Input {...register('connstr')} style={{ width: 180 }} />
        </EditFieldRow>
        <EditFieldRow label="모델">
          <Input type="number" {...register('model', { valueAsNumber: true })} style={{ width: 100 }} />
        </EditFieldRow>
        <EditFieldRow label="통신유형">
          <Input type="number" {...register('ctype', { valueAsNumber: true })} style={{ width: 100 }} />
        </EditFieldRow>
        <EditFieldRow label="확장">
          <Input {...register('ext')} style={{ width: 180 }} />
        </EditFieldRow>
      </>
    ) : (
      <>
        <FieldRow label="명칭" value={entityLabel('scp', scp)} />
        <div className="flex justify-between items-center py-1.5 gap-4">
          <span
            className="text-[14px] flex items-center gap-1 shrink-0"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            <Settings size={12} />
            활성
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={isDeviceActive(scp.active)}
              disabled={activePending}
              onChange={onToggleActive}
            />
            <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
              {isDeviceActive(scp.active) ? '활성' : '비활성'}
            </span>
          </label>
        </div>
        <FieldRow label="연결문자열" value={scp.connstr?.trim() || '—'} mono />
        <FieldRow label="모델" value={String(scp.model)} mono />
        <FieldRow label="통신유형" value={String(scp.ctype)} mono />
        {scp.ext?.trim() ? <FieldRow label="확장" value={scp.ext} /> : null}
      </>
    )}
  </div>
)

const SioTable = ({
  scp,
  sios,
  loading,
}: {
  scp: ScpInfo
  sios: SioInfo[]
  loading: boolean
}) => {
  const scpName = entityLabel('scp', scp)

  if (loading) {
    return (
      <p className="text-[14px] py-6 text-center" style={{ color: 'var(--color-text-subtle)' }}>
        부제어기 목록을 불러오는 중...
      </p>
    )
  }

  if (sios.length === 0) {
    return (
      <p className="text-[14px] py-6 text-center" style={{ color: 'var(--color-text-subtle)' }}>
        「{scpName}」에 연결된 부제어기가 없습니다.
      </p>
    )
  }

  return (
    <div
      className="rounded overflow-hidden"
      style={{ border: '0.5px solid var(--color-border)' }}
    >
      <table className="w-full text-[14px]">
        <thead style={{ background: 'var(--color-bg)' }}>
          <tr style={{ color: 'var(--color-text-subtle)' }}>
            <th className="text-left font-medium px-3 py-2">포트</th>
            <th className="text-left font-medium px-3 py-2">명칭</th>
            <th className="text-left font-medium px-3 py-2">모델</th>
            <th className="text-left font-medium px-3 py-2">어드레스</th>
            <th className="text-left font-medium px-3 py-2">상태</th>
          </tr>
        </thead>
        <tbody>
          {sios.map((sio) => (
            <tr
              key={sio.id}
              style={{
                color: 'var(--color-text)',
                borderTop: '0.5px solid var(--color-border-subtle)',
              }}
            >
              <td className="px-3 py-2 font-mono">{formatPort(sio.port)}</td>
              <td className="px-3 py-2">{entityLabel('sio', sio)}</td>
              <td className="px-3 py-2 font-mono">{sio.model}</td>
              <td className="px-3 py-2 font-mono">{sio.addr}</td>
              <td className="px-3 py-2">
                <Badge variant={isDeviceActive(sio.active) ? 'on' : 'off'}>
                  {isDeviceActive(sio.active) ? '활성' : '비활성'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const ScpDetailPanel = ({
  scp,
  sios,
  siosLoading,
  useMock,
  patchMockScp,
  removeMockScp,
  onDeleted,
}: ScpDetailPanelProps) => {
  const [activeTab, setActiveTab] = useState('info')

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
        <Cpu size={28} style={{ color: 'var(--color-text-dim)' }} />
        <p className="text-[15px] text-center" style={{ color: 'var(--color-text-subtle)' }}>
          왼쪽에서 주제어기를 선택하세요.
        </p>
        <p className="text-[14px] text-center max-w-sm" style={{ color: 'var(--color-text-dim)' }}>
          주제어기를 선택하면 해당 장치에 연결된 부제어기 목록을 볼 수 있습니다.
        </p>
      </div>
    )
  }

  const scpName = entityLabel('scp', scp)
  const tabs = [
    { key: 'info', label: '주제어기', icon: <Info size={12} /> },
    {
      key: 'sios',
      label: `부제어기${siosLoading ? '' : ` (${sios.length})`}`,
      icon: <Layers size={12} /> },
  ]

  const drawerFooter = (
    <div className="flex flex-col gap-2">
      {editor.actionError ? (
        <p className="text-[13px] text-right" style={{ color: '#c75c5c' }}>
          {editor.actionError}
        </p>
      ) : null}
      <ScpActionButtons
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
    </div>
  )

  return (
    <>
      <Drawer
        fill
        borderLeft={false}
        header={
          <div>
            <div
              className="flex items-center gap-1 text-[13px] mb-1"
              style={{ color: 'var(--color-text-dim)' }}
            >
              <span>주제어기</span>
              <ChevronRight size={11} />
              <span style={{ color: 'var(--color-accent)' }}>{scpName}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Cpu size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              <h2
                className="text-[15px] font-medium truncate"
                style={{ color: 'var(--color-text)' }}
              >
                {scpName}
              </h2>
              <Badge variant={isDeviceActive(scp.active) ? 'on' : 'off'}>
                {isDeviceActive(scp.active) ? '활성' : '비활성'}
              </Badge>
            </div>
          </div>
        }
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        footer={<div className="p-3">{drawerFooter}</div>}
      >
        {activeTab === 'info' ? (
          <ScpInfoTab
            scp={scp}
            editMode={editor.editMode}
            register={editor.form.register}
            activePending={editor.isSaving}
            onToggleActive={editor.handleToggleActive}
          />
        ) : (
          <SioTable scp={scp} sios={sios} loading={siosLoading} />
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
