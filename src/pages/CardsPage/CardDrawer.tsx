import { useEffect, useMemo, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, CreditCard, DoorOpen, History, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Badge } from '@/components/primitive/Badge'
import { Button } from '@/components/primitive/Button'
import { Modal } from '@/components/primitive/Modal'
import { typeBadgeVariant } from '@/pages/CardsPage/components/CardFieldUi'
import { updateCardSchema, type UpdateCardFormValues } from '@/pages/CardsPage/formTypes'
import { CardAccessTab } from '@/pages/CardsPage/tabs/CardAccessTab'
import { CardHistTab } from '@/pages/CardsPage/tabs/CardHistTab'
import { CardInfoTab } from '@/pages/CardsPage/tabs/CardInfoTab'
import {
  cardIdFromNumber,
  cardStatusLabel,
  cardTypeLabel,
  toCreateRequest,
  toUpdateRequest,
  type CardRow,
} from '@/pages/CardsPage/utils/cardPageHelpers'
import { useCardAccLvList, useCreateCard, useDeleteCard, useUpdateCard } from '@/hooks/api/useCard'
import type { CardAccLvDisplayItem } from '@/pages/CardsPage/components/AccLvGroupCards'
import type { AccLvInfo, CardAccLvInfo, EmpInfo } from '@/types/api'

const CREATE_FORM_DEFAULTS: UpdateCardFormValues = {
  name: '',
  cardNum: '',
  empId: undefined,
  type: '직원',
  status: '활성',
}

const CREATE_PLACEHOLDER: CardRow = {
  id: 0,
  cid: 0,
  cardNumber: '',
  name: '',
  isActive: true,
  type: '직원',
  status: '활성',
}

interface CardDrawerProps {
  card: CardRow | null
  createMode: boolean
  empList: EmpInfo[] | undefined
  empNameMap: Record<number, string>
  accLvNameMap: Record<number, string>
  accLvList?: AccLvInfo[]
  onCreateModeChange: (active: boolean) => void
  onCreated: (id: number) => void
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
  onCreateModeChange,
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

  const { data: cardAccLvList } = useCardAccLvList(selectedId ?? 0)
  const { mutate: createCard, isPending: isCreating } = useCreateCard()
  const { mutate: updateCard, isPending: isUpdating } = useUpdateCard()
  const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard()

  const form = useForm<UpdateCardFormValues>({
    resolver: zodResolver(updateCardSchema) as Resolver<UpdateCardFormValues>,
  })

  useEffect(() => {
    if (!createMode) return
    setActiveTab('info')
    setEditMode(false)
    form.reset(CREATE_FORM_DEFAULTS)
    setExemptApb(false)
    setExemptPin(false)
  }, [createMode, form])

  useEffect(() => {
    if (createMode) return
    setActiveTab('info')
    setEditMode(false)
  }, [selectedId, createMode])

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

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

  const onEditClick = () => {
    if (!card) return
    form.reset({
      name: card.name ?? '',
      cardNum: card.cardNumber,
      empId: card.empId,
      type: cardTypeLabel(card),
      status: cardStatusLabel(card),
    })
    setExemptApb(!!card.exemptApb)
    setExemptPin(!!card.exemptPin)
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
    form.reset()
  }

  const handleCancelCreate = () => {
    onCreateModeChange(false)
    form.reset()
  }

  const onUpdateSubmit = (values: UpdateCardFormValues) => {
    if (!selectedId || !card) return
    const data = toUpdateRequest(values, card, exemptApb, exemptPin)
    updateCard(
      { id: selectedId, data },
      {
        onSuccess: (ok) => {
          if (!ok) return
          setEditing(false)
        },
      },
    )
  }

  const onCreateSubmit = (values: UpdateCardFormValues) => {
    const data = toCreateRequest(values, exemptApb, exemptPin)
    createCard(data, {
      onSuccess: (ok) => {
        if (!ok) return
        const newId = cardIdFromNumber(data.cardNumber)
        onCreateModeChange(false)
        form.reset()
        if (newId != null) onCreated(newId)
      },
    })
  }

  const handleSave = form.handleSubmit(createMode ? onCreateSubmit : onUpdateSubmit)

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

  const drawerTabs =
    card && !createMode
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

  const drawerHeader = createMode ? (
    <div className="pb-3 w-full min-w-0">
      <div
        className="w-full min-w-0"
        style={{
          border: '0.5px solid var(--color-border)',
          borderRadius: 8,
          background: 'var(--color-bg)',
          padding: '12px 14px',
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Plus
            size={16}
            className="flex-shrink-0"
            style={{ color: 'var(--color-accent)' }}
          />
          <span
            className="font-medium leading-tight truncate min-w-0"
            style={{ color: 'var(--color-text)', fontSize: 20 }}
          >
            카드 추가
          </span>
        </div>
        <span
          className="block leading-tight mt-1"
          style={{
            color: 'var(--color-text-muted)',
            paddingLeft: 22,
            fontSize: FONT_SIZE,
          }}
        >
          새 카드 정보를 입력하세요
        </span>
      </div>
    </div>
  ) : card ? (
    <div className="pb-3 w-full min-w-0">
      <div
        className="w-full min-w-0"
        style={{
          border: '0.5px solid var(--color-border)',
          borderRadius: 8,
          background: 'var(--color-bg)',
          padding: '12px 14px',
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <CreditCard
            size={16}
            className="flex-shrink-0"
            style={{ color: 'var(--color-accent)' }}
          />
          <span
            className="font-medium leading-tight truncate min-w-0"
            style={{ color: 'var(--color-text)', fontSize: 20 }}
          >
            {card.name}
          </span>
        </div>
        <span
          className="block font-mono leading-tight mt-1"
          style={{
            color: 'var(--color-text-muted)',
            letterSpacing: '0.05em',
            paddingLeft: 22,
            fontSize: FONT_SIZE,
          }}
        >
          {card.cardNumber}
        </span>
        <div className="flex justify-between items-center mt-2 gap-2">
          <span className="flex-1 min-w-0" aria-hidden />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge variant={typeBadgeVariant(cardTypeLabel(card))}>
              {cardTypeLabel(card)}
            </Badge>
            <Badge variant={cardStatusLabel(card) === '활성' ? 'on' : 'off'}>
              {cardStatusLabel(card)}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions = createMode ? (
    <>
      <Button
        variant="default"
        size="sm"
        leftIcon={<X size={15} />}
        onClick={handleCancelCreate}
      >
        취소
      </Button>
      <Button
        variant="accent"
        size="sm"
        leftIcon={<Check size={15} />}
        loading={isCreating}
        onClick={handleSave}
      >
        저장
      </Button>
    </>
  ) : card ? (
    editMode ? (
      <>
        <Button
          variant="default"
          size="sm"
          leftIcon={<X size={15} />}
          onClick={handleCancelEdit}
        >
          취소
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Check size={15} />}
          loading={isUpdating}
          onClick={handleSave}
        >
          저장
        </Button>
      </>
    ) : (
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
    )
  ) : null

  const drawerChildren = createMode ? (
    <CardInfoTab
      card={CREATE_PLACEHOLDER}
      editMode
      register={form.register}
      control={form.control}
      empList={empList}
      empNameMap={empNameMap}
      exemptApb={exemptApb}
      exemptPin={exemptPin}
      onExemptApbChange={setExemptApb}
      onExemptPinChange={setExemptPin}
    />
  ) : !card ? (
    <div className="flex items-center justify-center h-full min-h-[120px]">
      <span style={{ color: 'var(--color-text-subtle)', fontSize: FONT_SIZE }}>
        목록에서 항목을 선택하세요
      </span>
    </div>
  ) : (
    <>
      {activeTab === 'info' && (
        <CardInfoTab
          card={card}
          editMode={editMode}
          register={form.register}
          control={form.control}
          empList={empList}
          empNameMap={empNameMap}
          exemptApb={exemptApb}
          exemptPin={exemptPin}
          onExemptApbChange={setExemptApb}
          onExemptPinChange={setExemptPin}
        />
      )}
      {activeTab === 'access' && (
        <CardAccessTab card={card} accLvItems={accLvItems} fontSize={FONT_SIZE} />
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
