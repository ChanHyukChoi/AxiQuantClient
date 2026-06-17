import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Layers } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { Modal } from '@/components/primitive/Modal'
import { ActiveStatusBadge } from '@/components/basic/ActiveStatusBadge'
import { AddButton, CrudDetailActions } from '@/components/page-actions'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { TabToolbar } from '@/layouts/TabToolbar'
import { useTranslation } from 'react-i18next'
import { useGridColumnLayout } from '@/hooks/ui/useGridColumnLayout'
import { useSioGridColumns } from '@/pages/ControllersPage/components/sioGridColumns'
import { SioDetailFields } from '@/pages/ControllersPage/components/SioDetailFields'
import { useSioEditor } from '@/pages/ControllersPage/useSioEditor'
import { entityLabel, isDeviceActive } from '@/lib/device/deviceHelpers'
import { fetchSioList } from '@/hooks/api/queryCache'
import type { ScpInfo, SioInfo } from '@/types/api'

interface SioWorkspaceProps {
  scp: ScpInfo | null
  sios: SioInfo[]
  siosLoading: boolean
  gridStorageKey: string
  layout?: 'stack' | 'panel'
}

export const SioWorkspace = ({
  scp,
  sios,
  siosLoading,
  gridStorageKey,
  layout = 'stack',
}: SioWorkspaceProps) => {
  const qc = useQueryClient()
  const { t } = useTranslation('device')
  const baseSioColumns = useSioGridColumns()
  const [selectedSioId, setSelectedSioId] = useState<number | null>(null)
  const scpId = scp?.id ?? 0

  const selectedSio = useMemo(
    () => sios.find((s) => s.id === selectedSioId) ?? null,
    [sios, selectedSioId],
  )

  useEffect(() => {
    setSelectedSioId(null)
  }, [scpId])

  useEffect(() => {
    if (!scp) {
      setSelectedSioId(null)
      return
    }
    if (sios.length === 0) {
      setSelectedSioId(null)
      return
    }
    if (selectedSioId == null || !sios.some((s) => s.id === selectedSioId)) {
      setSelectedSioId(sios[0]?.id ?? null)
    }
  }, [scp, sios, selectedSioId])

  const selectNewestSio = useCallback(async () => {
    if (scpId <= 0) return
    const list =
      (await fetchSioList(qc, scpId)) ?? []
    const newest = [...list].sort((a, b) => b.id - a.id)[0]
    if (newest) setSelectedSioId(newest.id)
  }, [scpId, qc])

  const editor = useSioEditor({
    sio: selectedSio,
    scpId,
    onAdded: (id) => {
      if (id > 0) setSelectedSioId(id)
      else void selectNewestSio()
    },
    onDeleted: () => setSelectedSioId(null),
  })

  const { columns, layoutGridProps } = useGridColumnLayout(baseSioColumns, {
    storageKey: gridStorageKey,
  })

  const scpName = scp ? entityLabel('scp', scp) : ''
  const sioName = selectedSio ? entityLabel('sio', selectedSio) : ''

  if (!scp) {
    return (
      <p className="text-[14px] p-4" style={{ color: 'var(--color-text-subtle)' }}>
        {t('sio.selectScpFirst')}
      </p>
    )
  }

  const gridSection = (
    <div
      className={layout === 'stack' ? 'flex flex-col min-h-0 overflow-hidden' : 'flex-1 min-h-0 overflow-hidden'}
      style={layout === 'stack' ? { flex: '0 0 45%', borderBottom: '0.5px solid var(--color-border)' } : undefined}
    >
      <Grid
        columns={columns}
        data={sios}
        selectedId={selectedSioId ?? undefined}
        onRowClick={(row) => setSelectedSioId(row.id)}
        totalCount={sios.length}
        loading={siosLoading}
        {...layoutGridProps}
      />
    </div>
  )

  const detailSection = selectedSio ? (
    <>
      <DetailTitleBar
        icon={<Layers size={14} style={{ color: 'var(--color-accent)' }} />}
        title={sioName}
        badge={<ActiveStatusBadge active={isDeviceActive(selectedSio.active)} />}
        actions={
          <CrudDetailActions
            editMode={editor.editMode}
            isSaving={editor.isSaving}
            isDeleting={editor.isDeleting}
            onEdit={editor.handleEdit}
            onDelete={() => editor.setDeleteOpen(true)}
            onSave={editor.handleSave}
            onCancel={editor.handleCancel}
          />
        }
      />
      {editor.actionError ? (
        <p className="text-[13px] px-3 py-1 text-right" style={{ color: '#c75c5c' }}>
          {editor.actionError}
        </p>
      ) : null}
      <div className="flex-1 min-h-0 p-3 overflow-y-auto app-scrollbar">
        <SioDetailFields
          item={selectedSio}
          editMode={editor.editMode}
          register={editor.form.register}
          activePending={editor.isSaving}
          onToggleActive={editor.handleToggleActive}
          layout={layout === 'panel' ? 'columns' : 'stack'}
          statusInTitleBar
        />
      </div>
    </>
  ) : (
    <p className="text-[14px] p-4" style={{ color: 'var(--color-text-subtle)' }}>
      {sios.length === 0
        ? `?${scpName}?? ????? ????. ?? ???? ?????.`
        : '???? ????? ?????.'}
    </p>
  )

  return (
    <div className={`flex flex-col flex-1 min-h-0 overflow-hidden ${layout === 'panel' ? 'h-full' : ''}`}>
      <TabToolbar>
        <AddButton
          onClick={() => void editor.handleAdd()}
          loading={editor.isAdding}
        />
      </TabToolbar>

      {layout === 'panel' ? (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {gridSection}
          <div className="flex flex-1 min-h-0 flex-col overflow-hidden">{detailSection}</div>
        </div>
      ) : (
        <>
          {gridSection}
          <div className="flex flex-1 min-h-0 flex-col overflow-hidden">{detailSection}</div>
        </>
      )}

      <Modal
        open={editor.deleteOpen}
        title="???? ??"
        description={selectedSio ? `?${sioName}? ????? ?????????` : undefined}
        confirmLabel="??"
        variant="danger"
        loading={editor.isDeleting}
        onConfirm={editor.handleDeleteConfirm}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </div>
  )
}
