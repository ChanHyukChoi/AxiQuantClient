import { useEffect, useState } from 'react'
import { useForm, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Binary, Check, Hash, Pencil, Settings, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { BitVisualizer } from '@/pages/CardFmtPage/BitVisualizer'
import {
  cardFmtEditSchema,
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
      setSaveError('저장하지 못했습니다. 서버 응답을 확인하세요.')
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
            취소
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Check size={12} />}
            loading={updateMut.isPending}
            onClick={handleSave}
          >
            저장
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
          삭제
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Pencil size={12} />}
          onClick={handleEdit}
        >
          수정
        </Button>
      </>
    )
  ) : null

  const drawerChildren = !cardfmt ? (
    <div className="flex items-center justify-center h-full min-h-[120px]">
      <span className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
        목록에서 카드 형식을 선택하세요
      </span>
    </div>
  ) : (
    <div>
      <SectionTitle>기본 정보</SectionTitle>

      <FRow icon={<Binary size={12} />} label="명칭">
        {editMode ? (
          <Input {...register('name')} style={{ width: 148 }} />
        ) : (
          <span className="text-[15px] text-right" style={{ color: 'var(--color-text)' }}>
            {display.name || '—'}
          </span>
        )}
      </FRow>

      <FRow icon={<Settings size={12} />} label="유형">
        <span
          className="inline-flex items-center text-[12px] font-medium px-1.5 py-0.5 rounded-full"
          style={WIEGAND_BADGE_STYLE}
        >
          WIEGAND
        </span>
      </FRow>

      <NumField
        label="시설 코드"
        name="facility"
        value={display.facility}
        editMode={editMode}
        register={register}
      />
      <NumField
        label="카드 오프셋"
        name="idOffset"
        value={display.idOffset}
        editMode={editMode}
        register={register}
      />
      <NumField
        label="최소 자릿수"
        name="minDigits"
        value={display.minDigits}
        editMode={editMode}
        register={register}
      />
      <NumField
        label="최대 자릿수"
        name="maxDigits"
        value={display.maxDigits}
        editMode={editMode}
        register={register}
      />

      <SectionTitle>비트 구조</SectionTitle>

      {editMode ? (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <EditNumCell label="총 비트 수" name="totalBits" register={register} />
          <EditNumCell label="카드 번호 비트 수" name="cardBits" register={register} />
          <EditNumCell label="시설 코드 시작" name="fcLoc" register={register} />
          <EditNumCell label="시설 코드 크기" name="fcBits" register={register} />
          <EditNumCell label="카드번호 시작" name="cardLoc" register={register} />
          <EditNumCell label="짝수 패리티" name="evenBits" register={register} />
          <EditNumCell label="짝수 위치" name="evenLoc" register={register} />
          <EditNumCell label="홀수 패리티" name="oddBits" register={register} />
          <EditNumCell label="홀수 위치" name="oddLoc" register={register} />
          <EditNumCell label="발급 비트" name="issueBits" register={register} />
          <EditNumCell label="발급 위치" name="issueLoc" register={register} />
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
          <BitStatCard label="총 비트 수" value={display.totalBits} />
          <BitStatCard label="카드 번호 비트 수" value={display.cardBits} />
          <BitStatCard label="시설 코드 시작" value={display.fcLoc} />
          <BitStatCard label="시설 코드 크기" value={display.fcBits} />
          <BitStatCard label="카드번호 시작" value={display.cardLoc} />
          <BitStatCard label="짝수 패리티" value={display.evenBits} />
        </div>
      )}

      <SectionTitle>비트 구조 시각화</SectionTitle>
      <BitVisualizer fmt={vizSource} />
    </div>
  )

  return (
    <>
      <Drawer
        fill
        borderLeft={false}
        header={drawerHeader}
        actions={drawerActions ?? undefined}
      >
        {drawerChildren}
      </Drawer>

      <Modal
        open={deleteOpen}
        title="카드 형식 삭제"
        description={`"${cardfmt?.name ?? ''}" 형식을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        variant="danger"
        loading={deleteMut.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
