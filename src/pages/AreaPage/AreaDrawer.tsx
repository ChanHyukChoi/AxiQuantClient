import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Info, MapPin, Pencil, ScanLine, Trash2, Users, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { DrawerSelectPrompt } from '@/components/basic/DrawerSelectPrompt'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { createAreaEditSchema, type AreaEditFormValues } from '@/pages/AreaPage/formTypes'
import { AreaInfoTab } from '@/pages/AreaPage/tabs/AreaInfoTab'
import { AreaOccupantsTab } from '@/pages/AreaPage/tabs/AreaOccupantsTab'
import { AreaReadersTab } from '@/pages/AreaPage/tabs/AreaReadersTab'
import { fallbackAreaName } from '@/lib/entityDisplayLabels'
import { areaToUpdatePayload, isAreaActive } from '@/pages/AreaPage/utils/areaHelpers'
import { useDeleteArea, useUpdateArea } from '@/hooks/api/useArea'
import type { AreaInfo } from '@/types/api'

interface AreaDrawerProps {
  area: AreaInfo | null
}

const areaToForm = (area: AreaInfo): AreaEditFormValues => ({
  name: area.name,
  active: area.active,
  occmax: area.occmax,
  multiocc: area.multiocc,
})

export const AreaDrawer = ({ area }: AreaDrawerProps) => {
  const { t } = useTranslation(['area', 'common'])
  const areaSchema = useMemo(() => createAreaEditSchema(t), [t])
  const [activeTab, setActiveTab] = useState('info')
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [setOccOpen, setSetOccOpen] = useState(false)
  const [occsetInput, setOccsetInput] = useState('0')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const updateAreaMut = useUpdateArea()
  const deleteAreaMut = useDeleteArea()

  const { register, handleSubmit, reset, control } = useForm<AreaEditFormValues>({
    resolver: zodResolver(areaSchema),
    defaultValues: { name: '', active: 1, occmax: 0, multiocc: 0 },
  })

  useEffect(() => {
    setEditMode(false)
    setSaveError(null)
    setActionError(null)
    setActiveTab('info')
    if (area) {
      reset(areaToForm(area))
      setOccsetInput(String(area.occset))
    }
  }, [area?.id, area, reset])

  const drawerTabs = area
    ? [
        { key: 'info', label: t('area:tab.info'), icon: <Info size={12} /> },
        { key: 'readers', label: t('area:tab.readers'), icon: <ScanLine size={12} /> },
        { key: 'occupants', label: t('area:tab.occupants'), icon: <Users size={12} /> },
      ]
    : undefined

  const handleEdit = () => {
    if (!area) return
    setSaveError(null)
    reset(areaToForm(area))
    setEditMode(true)
  }

  const handleCancel = () => {
    if (!area) return
    setEditMode(false)
    setSaveError(null)
    reset(areaToForm(area))
  }

  const handleSave = handleSubmit(async (values) => {
    if (!area) return
    setSaveError(null)
    const payload = {
      ...areaToUpdatePayload(area),
      name: values.name,
      active: values.active,
      occmax: values.occmax,
      multiocc: values.multiocc,
    }
    const ok = await updateAreaMut.mutateAsync({ id: area.id, data: payload })
    if (ok) {
      setEditMode(false)
    } else {
      setSaveError(t('area:error.saveFailed'))
    }
  })

  const handleDeleteConfirm = async () => {
    if (!area) return
    const ok = await deleteAreaMut.mutateAsync(area.id)
    if (ok) setDeleteOpen(false)
  }

  const handleResetOccupancyConfirm = async () => {
    if (!area) return
    setActionError(null)
    const ok = await updateAreaMut.mutateAsync({
      id: area.id,
      data: { ...areaToUpdatePayload(area), occup: 0, occdown: 0 },
    })
    if (ok) {
      setResetOpen(false)
    } else {
      setActionError(t('area:error.resetFailed'))
    }
  }

  const handleSetOccupancyConfirm = async () => {
    if (!area) return
    setActionError(null)
    const occset = Math.trunc(Number(occsetInput))
    if (!Number.isFinite(occset) || occset < 0) {
      setActionError(t('area:error.invalidNumber'))
      return
    }
    const ok = await updateAreaMut.mutateAsync({
      id: area.id,
      data: { ...areaToUpdatePayload(area), occset },
    })
    if (ok) {
      setSetOccOpen(false)
      setActionError(null)
    } else {
      setActionError(t('area:error.setFailed'))
    }
  }

  const drawerHeader = area ? (
    <div
      className="flex items-start gap-3 pb-3"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <div
        className="flex items-center justify-center rounded-md flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          background: 'var(--color-btn-hover)',
          color: 'var(--color-accent)',
        }}
      >
        <MapPin size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className="app-text-lg font-medium leading-tight truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {fallbackAreaName(area.name)}
        </span>
        <span className="app-text-md" style={{ color: 'var(--color-text-subtle)' }}>
          {t('area:summary.occupancy', {
            status: isAreaActive(area.active) ? t('common:active') : t('common:inactive'),
            occup: area.occup,
            occmax: area.occmax,
          })}
        </span>
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions = area ? (
    editMode ? (
      <div className="flex flex-col items-stretch gap-2 w-full max-w-[260px] ml-auto">
        {saveError ? (
          <p className="text-[13px] leading-snug text-right" style={{ color: '#c75c5c' }}>
            {saveError}
          </p>
        ) : null}
        <div className="flex justify-end gap-1.5">
          <Button
            variant="default"
            size="sm"
            leftIcon={<X size={12} />}
            onClick={handleCancel}
          >
            {t('common:cancel')}
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Check size={12} />}
            loading={updateAreaMut.isPending}
            onClick={handleSave}
          >
            {t('common:save')}
          </Button>
        </div>
      </div>
    ) : (
      <>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<Trash2 size={12} />}
          onClick={() => setDeleteOpen(true)}
        >
          {t('common:delete')}
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Pencil size={12} />}
          onClick={handleEdit}
        >
          {t('common:edit')}
        </Button>
      </>
    )
  ) : null

  const drawerChildren = !area ? (
    <DrawerSelectPrompt message={t('area:selectRow')} />
  ) : (
    <>
      {activeTab === 'info' && (
        <AreaInfoTab
          area={area}
          editMode={editMode}
          register={register}
          control={control}
          onResetOccupancy={() => {
            setActionError(null)
            setResetOpen(true)
          }}
          onSetOccupancy={() => {
            setActionError(null)
            setOccsetInput(String(area.occset))
            setSetOccOpen(true)
          }}
        />
      )}
      {activeTab === 'readers' && <AreaReadersTab />}
      {activeTab === 'occupants' && <AreaOccupantsTab />}
    </>
  )

  return (
    <>
      <Drawer
        fill
        borderLeft={false}
        contentFill={!area}
        header={drawerHeader}
        actions={drawerActions ?? undefined}
        tabs={drawerTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {drawerChildren}
      </Drawer>

      <Modal
        open={deleteOpen}
        title={t('area:modal.deleteTitle')}
        description={t('area:modal.deleteDescription', { name: area?.name ?? '' })}
        confirmLabel={t('common:delete')}
        variant="danger"
        loading={deleteAreaMut.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />

      <Modal
        open={resetOpen}
        title={t('area:modal.resetTitle')}
        description={
          actionError && resetOpen
            ? t('area:modal.resetDescriptionWithError', {
                occup: area?.occup ?? 0,
                error: actionError,
              })
            : t('area:modal.resetDescription', { occup: area?.occup ?? 0 })
        }
        confirmLabel={t('common:reset')}
        variant="danger"
        loading={updateAreaMut.isPending}
        onConfirm={handleResetOccupancyConfirm}
        onCancel={() => {
          setResetOpen(false)
          setActionError(null)
        }}
      />

      {setOccOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="rounded-md p-5 w-[300px]"
            style={{
              background: 'var(--color-sidebar)',
              border: '0.5px solid var(--color-border)',
            }}
          >
            <p
              className="text-[15px] font-medium mb-3"
              style={{ color: 'var(--color-text)' }}
            >
              {t('area:occupancy.setTitle')}
            </p>
            <Input
              type="number"
              value={occsetInput}
              onChange={(e) => setOccsetInput(e.target.value)}
              min={0}
            />
            {actionError ? (
              <p className="text-[13px] mt-2" style={{ color: '#c75c5c' }}>
                {actionError}
              </p>
            ) : null}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="default"
                onClick={() => {
                  setSetOccOpen(false)
                  setActionError(null)
                }}
              >
                {t('common:cancel')}
              </Button>
              <Button
                variant="accent"
                loading={updateAreaMut.isPending}
                onClick={handleSetOccupancyConfirm}
              >
                {t('common:apply')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
