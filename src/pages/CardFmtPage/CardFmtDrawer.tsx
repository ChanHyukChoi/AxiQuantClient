import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Binary, Check, Hash, Pencil, Settings, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { DrawerSelectPrompt } from '@/components/basic/DrawerSelectPrompt'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { BitVisualizer } from '@/pages/CardFmtPage/BitVisualizer'
import {
  createCardFmtEditSchema,
  type CardFmtEditFormValues,
} from '@/pages/CardFmtPage/formTypes'
import {
  cardfmtToForm,
  formToCardfmtPayload,
} from '@/pages/CardFmtPage/utils/cardFmtHelpers'
import { fallbackCardFmtName } from '@/lib/entityDisplayLabels'
import { useDeleteCardFmt, useUpdateCardFmt } from '@/hooks/api/useCardfmt'
import type { CardfmtInfo } from '@/types/api'

interface CardFmtDrawerProps {
  cardfmt: CardfmtInfo | null
}

const WIEGAND_BADGE_STYLE: React.CSSProperties = {
  background: 'color-mix(in srgb, #7f77dd 25%, transparent)',
  color: '#b8a8ff',
  border: '0.5px solid color-mix(in srgb, #7f77dd 50%, transparent)',
}

const EMPTY_CARD_FMT: CardfmtInfo = {
  id: 0,
  name: '',
  facility: 0,
  idOffset: 0,
  funcId: 0,
  flags: 0,
  totalBits: 0,
  evenBits: 0,
  evenLoc: 0,
  oddBits: 0,
  oddLoc: 0,
  fcBits: 0,
  fcLoc: 0,
  cardBits: 0,
  cardLoc: 0,
  issueBits: 0,
  issueLoc: 0,
  minDigits: 0,
  maxDigits: 0,
  ext: '',
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[14px] font-medium tracking-wide pb-1.5 mb-2 mt-4 first:mt-0"
    style={{
      color: 'var(--color-text-subtle)',
      borderBottom: '0.5px solid var(--color-border)',
    }}
  >
    {children}
  </p>
)

const FRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) => (
  <div className="flex justify-between items-center py-1 gap-2">
    <span
      className="text-[14px] flex items-center gap-1.5 flex-shrink-0"
      style={{ color: 'var(--color-text-subtle)' }}
    >
      {icon}
      {label}
    </span>
    {children}
  </div>
)

const BitStatCard = ({ label, value }: { label: string; value: number }) => (
  <div
    className="rounded p-2.5"
    style={{
      border: '0.5px solid var(--color-border)',
      background: 'var(--color-btn-hover)',
    }}
  >
    <p className="text-[12px] mb-1" style={{ color: 'var(--color-text-dim)' }}>
      {label}
    </p>
    <p
      className="text-[16px] font-mono font-medium"
      style={{ color: 'var(--color-text)' }}
    >
      {value}
    </p>
  </div>
)

const EditNumCell = ({
  label,
  name,
  register,
}: {
  label: string
  name: keyof CardFmtEditFormValues
  register: UseFormRegister<CardFmtEditFormValues>
}) => (
  <div>
    <label className="text-[12px] mb-1 block" style={{ color: 'var(--color-text-dim)' }}>
      {label}
    </label>
    <Input
      type="number"
      {...register(name, { valueAsNumber: true })}
      className="w-full"
    />
  </div>
)

const NumField = ({
  label,
  value,
  editMode,
  name,
  register,
}: {
  label: string
  value: number
  editMode: boolean
  name: keyof CardFmtEditFormValues
  register: UseFormRegister<CardFmtEditFormValues>
}) => (
  <FRow icon={<Hash size={12} />} label={label}>
    {editMode ? (
      <Input
        type="number"
        {...register(name, { valueAsNumber: true })}
        style={{ width: 100 }}
      />
    ) : (
      <span
        className="text-[15px] font-mono text-right"
        style={{ color: 'var(--color-text)' }}
      >
        {value}
      </span>
    )}
  </FRow>
)

export const CardFmtDrawer = ({ cardfmt }: CardFmtDrawerProps) => {
  const { t } = useTranslation(['cardFmt', 'common'])
  const cardFmtEditSchema = useMemo(() => createCardFmtEditSchema(t), [t])
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const updateMut = useUpdateCardFmt()
  const deleteMut = useDeleteCardFmt()

  const { register, handleSubmit, reset, watch } = useForm<CardFmtEditFormValues>({
    resolver: zodResolver(cardFmtEditSchema),
    defaultValues: cardfmtToForm(EMPTY_CARD_FMT),
  })

  const watched = watch()

  useEffect(() => {
    setEditMode(false)
    setSaveError(null)
    if (cardfmt) reset(cardfmtToForm(cardfmt))
  }, [cardfmt?.id, cardfmt, reset])

  const vizSource: CardfmtInfo = cardfmt
    ? editMode
      ? { ...cardfmt, ...watched }
      : cardfmt
    : EMPTY_CARD_FMT

  const display = cardfmt ?? EMPTY_CARD_FMT

  const handleEdit = () => {
    if (!cardfmt) return
    setSaveError(null)
    reset(cardfmtToForm(cardfmt))
    setEditMode(true)
  }

  const handleCancel = () => {
    if (!cardfmt) return
    setEditMode(false)
    setSaveError(null)
    reset(cardfmtToForm(cardfmt))
  }

  const handleSave = handleSubmit(async (values) => {
    if (!cardfmt) return
    setSaveError(null)
    const ok = await updateMut.mutateAsync({
      id: cardfmt.id,
      data: formToCardfmtPayload(values),
    })
    if (ok) {
      setEditMode(false)
    } else {
      setSaveError(t('cardFmt:error.saveFailed'))
    }
  })

  const handleDeleteConfirm = async () => {
    if (!cardfmt) return
    const ok = await deleteMut.mutateAsync(cardfmt.id)
    if (ok) setDeleteOpen(false)
  }

  const drawerHeader = cardfmt ? (
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
          color: '#7f77dd',
        }}
      >
        <Binary size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[15px] font-medium leading-tight truncate"
            style={{ color: 'var(--color-text)' }}
          >
            {fallbackCardFmtName(cardfmt.name)}
          </span>
          <span
            className="inline-flex items-center text-[12px] font-medium px-1.5 py-0.5 rounded-full"
            style={WIEGAND_BADGE_STYLE}
          >
            WIEGAND
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions = cardfmt ? (
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
            loading={updateMut.isPending}
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

  const drawerChildren = !cardfmt ? (
    <DrawerSelectPrompt message={t('cardFmt:selectItem')} />
  ) : (
    <div>
      <SectionTitle>{t('cardFmt:section.basic')}</SectionTitle>

      <FRow icon={<Binary size={12} />} label={t('cardFmt:field.name')}>
        {editMode ? (
          <Input {...register('name')} style={{ width: 148 }} />
        ) : (
          <span className="text-[15px] text-right" style={{ color: 'var(--color-text)' }}>
            {display.name || t('common:empty')}
          </span>
        )}
      </FRow>

      <FRow icon={<Settings size={12} />} label={t('cardFmt:field.type')}>
        <span
          className="inline-flex items-center text-[12px] font-medium px-1.5 py-0.5 rounded-full"
          style={WIEGAND_BADGE_STYLE}
        >
          WIEGAND
        </span>
      </FRow>

      <NumField
        label={t('cardFmt:field.facility')}
        name="facility"
        value={display.facility}
        editMode={editMode}
        register={register}
      />
      <NumField
        label={t('cardFmt:field.idOffset')}
        name="idOffset"
        value={display.idOffset}
        editMode={editMode}
        register={register}
      />
      <NumField
        label={t('cardFmt:field.minDigits')}
        name="minDigits"
        value={display.minDigits}
        editMode={editMode}
        register={register}
      />
      <NumField
        label={t('cardFmt:field.maxDigits')}
        name="maxDigits"
        value={display.maxDigits}
        editMode={editMode}
        register={register}
      />

      <SectionTitle>{t('cardFmt:section.bitStructure')}</SectionTitle>

      {editMode ? (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <EditNumCell label={t('cardFmt:field.totalBits')} name="totalBits" register={register} />
          <EditNumCell label={t('cardFmt:field.cardBits')} name="cardBits" register={register} />
          <EditNumCell label={t('cardFmt:field.fcLoc')} name="fcLoc" register={register} />
          <EditNumCell label={t('cardFmt:field.fcBits')} name="fcBits" register={register} />
          <EditNumCell label={t('cardFmt:field.cardLoc')} name="cardLoc" register={register} />
          <EditNumCell label={t('cardFmt:field.evenBits')} name="evenBits" register={register} />
          <EditNumCell label={t('cardFmt:field.evenLoc')} name="evenLoc" register={register} />
          <EditNumCell label={t('cardFmt:field.oddBits')} name="oddBits" register={register} />
          <EditNumCell label={t('cardFmt:field.oddLoc')} name="oddLoc" register={register} />
          <EditNumCell label={t('cardFmt:field.issueBits')} name="issueBits" register={register} />
          <EditNumCell label={t('cardFmt:field.issueLoc')} name="issueLoc" register={register} />
          <EditNumCell label="funcId" name="funcId" register={register} />
          <EditNumCell label="flags" name="flags" register={register} />
          <div className="col-span-2">
            <label
              className="text-[12px] mb-1 block"
              style={{ color: 'var(--color-text-dim)' }}
            >
              ext
            </label>
            <Input {...register('ext')} className="w-full" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <BitStatCard label={t('cardFmt:field.totalBits')} value={display.totalBits} />
          <BitStatCard label={t('cardFmt:field.cardBits')} value={display.cardBits} />
          <BitStatCard label={t('cardFmt:field.fcLoc')} value={display.fcLoc} />
          <BitStatCard label={t('cardFmt:field.fcBits')} value={display.fcBits} />
          <BitStatCard label={t('cardFmt:field.cardLoc')} value={display.cardLoc} />
          <BitStatCard label={t('cardFmt:field.evenBits')} value={display.evenBits} />
        </div>
      )}

      <SectionTitle>{t('cardFmt:section.visualization')}</SectionTitle>
      <BitVisualizer fmt={vizSource} />
    </div>
  )

  return (
    <>
      <Drawer
        fill
        borderLeft={false}
        contentFill={!cardfmt}
        header={drawerHeader}
        actions={drawerActions ?? undefined}
      >
        {drawerChildren}
      </Drawer>

      <Modal
        open={deleteOpen}
        title={t('cardFmt:modal.deleteTitle')}
        description={t('cardFmt:modal.deleteDescription', { name: cardfmt?.name ?? '' })}
        confirmLabel={t('common:delete')}
        variant="danger"
        loading={deleteMut.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
