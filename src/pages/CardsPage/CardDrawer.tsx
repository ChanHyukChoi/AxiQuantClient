import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Check, CreditCard, DoorOpen, History, Pencil, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Modal } from '@/components/primitive/Modal'
import { queryKeys } from '@/lib/query/queryKeys'
import { CardSummaryHeader } from '@/pages/CardsPage/components/CardSummaryHeader'
import { CardUpsertForm } from '@/pages/CardsPage/components/CardUpsertForm'
import { updateCardSchema, type UpdateCardFormValues } from '@/pages/CardsPage/formTypes'
import { CardAccessTab } from '@/pages/CardsPage/tabs/CardAccessTab'
import { CardHistTab } from '@/pages/CardsPage/tabs/CardHistTab'
import { CardInfoTab } from '@/pages/CardsPage/tabs/CardInfoTab'
import type { CardAccLvDisplayItem } from '@/pages/CardsPage/components/AccLvGroupCards'
import {
  cardIdFromNumber,
  cardStatusLabel,
  cardDatetimeToInput,
  cardTypeLabel,
  syncCardAccLv,
  toCreateRequest,
  toUpdateRequest,
  type CardRow,
} from '@/pages/CardsPage/utils/cardPageHelpers'
import { useCardAccLvList, useCreateCard, useDeleteCard, useUpdateCard } from '@/hooks/api/useCard'
import type { AccLvInfo, AreaInfo, CardAccLvInfo, EmpInfo } from '@/types/api'

const FORM_DEFAULTS: UpdateCardFormValues = {
  name: '',
  cardNum: '',
  empId: undefined,
  type: '직원',
  status: '활성',
  changePin: false,
  pin: '',
  pinConfirm: '',
  issuedAt: '',
  expiredAt: '',
}

interface CardDrawerProps {
  card: CardRow | null
  createMode: boolean
  empList: EmpInfo[] | undefined
  empNameMap: Record<number, string>
  accLvNameMap: Record<number, string>
  accLvList?: AccLvInfo[]
  areaList?: AreaInfo[]
  onCreateCancel: () => void
  onCreated: (id: number) => void | Promise<void>
  onDeleted: () => void
  onEditModeChange?: (editing: boolean) => void
}

const FONT_SIZE = 15

export const CardDrawer = ({
  card,
  createMode,
  empList,
  empNameMap,
  accLvNameMap,
  accLvList,
  areaList,
  onCreateCancel,
  onCreated,
  onDeleted,
  onEditModeChange,
}: CardDrawerProps) => {
  const selectedId = card?.id ?? null
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [exemptApb, setExemptApb] = useState(false)
  const [exemptPin, setExemptPin] = useState(false)
  const [selectedAccLvIds, setSelectedAccLvIds] = useState<number[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const formActive = createMode || editMode
  const qc = useQueryClient()

  const { data: cardAccLvList } = useCardAccLvList(selectedId ?? 0)
  const { mutateAsync: createCardAsync } = useCreateCard()
  const { mutateAsync: updateCardAsync } = useUpdateCard()
  const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard()

  const form = useForm<UpdateCardFormValues>({
    resolver: zodResolver(updateCardSchema) as Resolver<UpdateCardFormValues>,
    defaultValues: FORM_DEFAULTS,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const watchedName = useWatch({ control: form.control, name: 'name' })
  const watchedCardNum = useWatch({ control: form.control, name: 'cardNum' })
  const watchedType = useWatch({ control: form.control, name: 'type' })
  const watchedStatus = useWatch({ control: form.control, name: 'status' })

  const resetFormState = () => {
    form.reset(FORM_DEFAULTS)
    setExemptApb(false)
    setExemptPin(false)
    setSelectedAccLvIds([])
    setSaveError(null)
  }

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

  useEffect(() => {
    if (!createMode) return
    setActiveTab('info')
    setEditMode(false)
    resetFormState()
  }, [createMode])

  useEffect(() => {
    if (createMode) return
    setEditMode(false)
  }, [selectedId, createMode])

  const accLvItems = useMemo<CardAccLvDisplayItem[]>(() => {
    const rows: CardAccLvInfo[] = cardAccLvList ?? []
    return rows.map((row) => {
      const meta = accLvList?.find((a) => a.id === row.alvid)
      const acttm = row.acttm?.trim()
      return {
        id: row.alvid,
        name: accLvNameMap[row.alvid] ?? meta?.name ?? `권한 #${row.alvid}`,
        isActive: (row.state ?? 1) > 0,
        description: meta?.description?.trim() || undefined,
        acttm: acttm || undefined,
      }
    })
  }, [cardAccLvList, accLvNameMap, accLvList])

  useEffect(() => {
    if (!editMode || createMode || cardAccLvList == null) return
    setSelectedAccLvIds((prev) =>
      prev.length > 0 ? prev : accLvItems.map((item) => item.id),
    )
  }, [editMode, createMode, cardAccLvList, accLvItems])

  const scrollToFirstFieldError = () => {
    requestAnimationFrame(() => {
      document
        .querySelector('.app-drawer-form .app-field-error')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  const onEditClick = () => {
    if (!card) return
    setSaveError(null)
    form.reset({
      name: card.name ?? '',
      cardNum: card.cardNumber,
      empId: card.empId,
      type: cardTypeLabel(card),
      status: cardStatusLabel(card),
      changePin: false,
      pin: '',
      pinConfirm: '',
      issuedAt: cardDatetimeToInput(card.issuedAt),
      expiredAt: cardDatetimeToInput(card.expiredAt),
    })
    setExemptApb(!!card.exemptApb)
    setExemptPin(!!card.exemptPin)
    setSelectedAccLvIds(accLvItems.map((item) => item.id))
    setEditing(true)
  }

  const handleCancelForm = () => {
    if (createMode) {
      onCreateCancel()
    } else {
      setEditing(false)
    }
    resetFormState()
  }

  const invalidateAccLv = (cid: number) => {
    void qc.invalidateQueries({ queryKey: queryKeys.card.acclv(cid) })
  }

  const onFormSubmit = async (values: UpdateCardFormValues) => {
    setIsSaving(true)
    setSaveError(null)
    try {
      if (createMode) {
        const data = toCreateRequest(values, exemptApb, exemptPin)
        const ok = await createCardAsync(data)
        if (!ok) {
          setSaveError(
            '서버에 저장하지 못했습니다. 카드 번호·필수 값을 확인하거나 F12 네트워크 응답을 확인하세요.',
          )
          return
        }

        const newId = cardIdFromNumber(data.cardNumber)
        if (newId == null) {
          setSaveError('카드 번호 형식이 올바르지 않습니다.')
          return
        }

        if (selectedAccLvIds.length > 0) {
          const synced = await syncCardAccLv(newId, [], selectedAccLvIds)
          if (!synced) {
            setSaveError('카드는 저장됐지만 접근 권한 연결에 실패했습니다.')
            return
          }
          invalidateAccLv(newId)
        }

        resetFormState()
        await onCreated(newId)
        return
      }

      if (!selectedId || !card) return
      const beforeIds = (cardAccLvList ?? []).map((row) => row.alvid)
      const data = toUpdateRequest(values, card, exemptApb, exemptPin)
      const ok = await updateCardAsync({ id: selectedId, data })
      if (!ok) {
        setSaveError('서버에 저장하지 못했습니다. F12 네트워크 응답을 확인하세요.')
        return
      }

      const synced = await syncCardAccLv(selectedId, beforeIds, selectedAccLvIds)
      if (!synced) {
        setSaveError('카드는 저장됐지만 접근 권한 연결에 실패했습니다.')
        return
      }
      invalidateAccLv(selectedId)
      setEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = form.handleSubmit(onFormSubmit, () => {
    scrollToFirstFieldError()
  })

  const handleDeleteConfirm = () => {
    if (selectedId == null) return
    deleteCard(selectedId, {
      onSuccess: (ok) => {
        if (!ok) return
        setDeleteModalOpen(false)
        onDeleted()
      },
    })
  }

  const headerMode = createMode
    ? 'create'
    : editMode
      ? 'edit'
      : card
        ? 'view'
        : 'empty'

  const drawerTabs =
    card && !formActive
      ? [
          {
            key: 'info',
            label: '기본',
            icon: <CreditCard size={12} />,
            fontSize: FONT_SIZE,
          },
          {
            key: 'access',
            label: '접근권한',
            icon: <DoorOpen size={12} />,
            fontSize: FONT_SIZE,
          },
          {
            key: 'hist',
            label: '최근이력',
            icon: <History size={12} />,
            fontSize: FONT_SIZE,
          },
        ]
      : undefined

  const drawerHeader = (
    <CardSummaryHeader
      mode={headerMode}
      name={formActive ? watchedName : card?.name}
      cardNumber={formActive ? watchedCardNum : card?.cardNumber}
      type={formActive ? watchedType : card ? cardTypeLabel(card) : undefined}
      status={formActive ? watchedStatus : card ? cardStatusLabel(card) : undefined}
    />
  )

  const drawerActions = formActive ? (
    <div className="flex flex-col items-stretch gap-2 w-full max-w-[260px] ml-auto">
      {saveError ? <p className="app-field-error">{saveError}</p> : null}
      <div className="flex justify-end gap-1.5">
        <Button
          variant="default"
          size="sm"
          leftIcon={<X size={15} />}
          onClick={handleCancelForm}
        >
          취소
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Check size={15} />}
          loading={isSaving}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  ) : card ? (
    <>
      <Button
        variant="danger"
        size="sm"
        leftIcon={<Trash2 size={15} />}
        onClick={() => setDeleteModalOpen(true)}
      >
        삭제
      </Button>
      <Button
        variant="accent"
        size="sm"
        leftIcon={<Pencil size={15} />}
        onClick={onEditClick}
      >
        수정
      </Button>
    </>
  ) : null

  const drawerChildren = formActive ? (
    <CardUpsertForm
      mode={createMode ? 'create' : 'edit'}
      baseCard={createMode ? undefined : card ?? undefined}
      register={form.register}
      control={form.control}
      setValue={form.setValue}
      clearErrors={form.clearErrors}
      empList={empList}
      empNameMap={empNameMap}
      accLvList={accLvList}
      accLvNameMap={accLvNameMap}
      selectedAccLvIds={selectedAccLvIds}
      onAccLvIdsChange={setSelectedAccLvIds}
      exemptApb={exemptApb}
      exemptPin={exemptPin}
      onExemptApbChange={setExemptApb}
      onExemptPinChange={setExemptPin}
    />
  ) : !card ? (
    <div className="flex-1 min-h-[120px]" aria-hidden />
  ) : (
    <>
      {activeTab === 'info' && (
        <CardInfoTab card={card} empNameMap={empNameMap} />
      )}
      {activeTab === 'access' && (
        <CardAccessTab
          card={card}
          accLvItems={accLvItems}
          areaList={areaList}
          fontSize={FONT_SIZE}
        />
      )}
      {activeTab === 'hist' && <CardHistTab card={card} fontSize={FONT_SIZE} />}
    </>
  )

  return (
    <>
      <Drawer
        fill
        borderLeft={false}
        header={drawerHeader}
        actions={drawerActions ?? undefined}
        tabs={drawerTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {drawerChildren}
      </Drawer>

      <Modal
        open={deleteModalOpen}
        title="카드 삭제"
        description={`카드 "${card?.cardNumber ?? ''}"를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </>
  )
}
