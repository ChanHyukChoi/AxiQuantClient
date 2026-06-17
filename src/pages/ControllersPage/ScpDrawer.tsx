import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Cpu, Info, Layers, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { DrawerSelectPrompt } from '@/components/basic/DrawerSelectPrompt'
import { Modal } from '@/components/primitive/Modal'
import type { TabItem } from '@/components/primitive/Tab'
import { ActiveStatusBadge } from '@/components/basic/ActiveStatusBadge'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { Button } from '@/components/primitive/Button'
import { ScpDetailFields } from '@/pages/ControllersPage/components/ScpDetailFields'
import { ScpTitleActions } from '@/pages/ControllersPage/components/ScpTitleActions'
import { SioWorkspace } from '@/pages/ControllersPage/components/SioWorkspace'
import { useScpEditor } from '@/pages/ControllersPage/useScpEditor'
import { entityLabel, isDeviceActive } from '@/lib/device/deviceHelpers'
import type { CreateScpRequest, ScpInfo, SioInfo } from '@/types/api'

const CREATE_SCP_PLACEHOLDER: ScpInfo = {
  id: 0,
  name: '',
  active: 1,
  connstr: '',
  model: 0,
  ctype: 0,
  ext: '',
}

interface ScpDrawerProps {
  scp: ScpInfo | null
  createMode?: boolean
  sios: SioInfo[]
  siosLoading: boolean
  onCreateCancel?: () => void
  onCreated?: (data: CreateScpRequest) => void | Promise<void>
  onDeleted?: () => void
}

export const ScpDrawer = ({
  scp,
  createMode = false,
  sios,
  siosLoading,
  onCreateCancel,
  onCreated,
  onDeleted,
}: ScpDrawerProps) => {
  const { t } = useTranslation(['device', 'common'])
  const [activeTab, setActiveTab] = useState<'info' | 'sios'>('info')

  const editor = useScpEditor({
    scp,
    createMode,
    onCreateCancel,
    onCreated,
    onDeleted,
  })

  useEffect(() => {
    if (createMode) setActiveTab('info')
  }, [createMode])

  if (!scp && !createMode) {
    return (
      <div
        className="flex flex-1 flex-col min-h-0 overflow-hidden"
        style={{ background: 'var(--color-sidebar)' }}
      >
        <DrawerSelectPrompt
          message={t('device:scp.selectRow')}
          hint={t('device:scp.selectRowHint')}
        />
      </div>
    )
  }

  if (createMode) {
    return (
      <Drawer
        fill
        borderLeft={false}
        header={
          <DetailTitleBar
            icon={<Cpu size={14} style={{ color: 'var(--color-accent)' }} />}
            title={t('device:scp.addTitle')}
          />
        }
        actions={
          <div className="flex justify-end gap-1.5">
            <Button variant="default" size="sm" leftIcon={<X size={12} />} onClick={editor.handleCancel}>
              {t('common:cancel')}
            </Button>
            <Button
              variant="accent"
              size="sm"
              leftIcon={<Check size={12} />}
              loading={editor.isSaving}
              onClick={editor.handleSave}
            >
              {t('common:add')}
            </Button>
          </div>
        }
        footer={
          editor.actionError ? (
            <p className="text-[13px] px-1" style={{ color: '#c75c5c' }}>
              {editor.actionError}
            </p>
          ) : undefined
        }
      >
        <ScpDetailFields
          scp={CREATE_SCP_PLACEHOLDER}
          editMode
          register={editor.form.register}
          statusInTitleBar
        />
      </Drawer>
    )
  }

  if (!scp) return null

  const scpName = entityLabel('scp', scp)

  const drawerTabs: TabItem[] = [
    { key: 'info', label: t('device:scp.tab.info'), icon: <Info size={12} /> },
    {
      key: 'sios',
      label: `${t('device:scp.tab.sios')}${siosLoading ? '' : ` (${sios.length})`}`,
      icon: <Layers size={12} />,
    },
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
            gridStorageKey="axiquant.grid.controllers-sio-a"
            layout="stack"
          />
        )}
      </Drawer>

      <Modal
        open={editor.deleteOpen}
        title={t('device:scp.modal.deleteTitle')}
        description={t('device:scp.modal.deleteDescription', { name: scpName })}
        confirmLabel={t('common:delete')}
        variant="danger"
        loading={editor.isDeleting}
        onConfirm={editor.handleDeleteConfirm}
        onCancel={() => editor.setDeleteOpen(false)}
      />

      <Modal
        open={editor.resetOpen}
        title={t('device:scp.modal.resetTitle')}
        description={t('device:scp.modal.resetDescription', { name: scpName })}
        confirmLabel={t('common:reset')}
        variant="default"
        loading={editor.isResetting}
        onConfirm={editor.handleResetConfirm}
        onCancel={() => editor.setResetOpen(false)}
      />
    </>
  )
}
