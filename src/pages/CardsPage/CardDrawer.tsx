import { useEffect, useMemo, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, CreditCard, DoorOpen, History, Pencil, Trash2, X } from 'lucide-react'
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
  cardStatusLabel,
  cardTypeLabel,
  toUpdateRequest,
  type CardRow,
} from '@/pages/CardsPage/utils/cardPageHelpers'
import { useCardAccLvList, useDeleteCard, useUpdateCard } from '@/hooks/useCard'
import type { CardAccLvInfo, EmpInfo } from '@/types/api'

interface CardDrawerProps {
  card: CardRow | null
  empList: EmpInfo[] | undefined
  empNameMap: Record<number, string>
  accLvNameMap: Record<number, string>
  onDeleted: () => void
  onEditModeChange?: (editing: boolean) => void
}

export const CardDrawer = ({
  card,
  empList,
  empNameMap,
  accLvNameMap,
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
  const { mutate: updateCard, isPending: isUpdating } = useUpdateCard()
  const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard()

  const updateForm = useForm<UpdateCardFormValues>({
    resolver: zodResolver(updateCardSchema) as Resolver<UpdateCardFormValues>,
  })

  useEffect(() => {
    setActiveTab('info')
    setEditMode(false)
  }, [selectedId])

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

  const accLvNamesDisplay = useMemo(() => {
    const rows: CardAccLvInfo[] = cardAccLvList ?? []
    if (!rows.length) return '—'
    const names = rows
      .map((row) => accLvNameMap[row.alvid] ?? `ID ${row.alvid}`)
      .filter(Boolean)
    return names.length ? names.join(', ') : '—'
  }, [cardAccLvList, accLvNameMap])

  const onEditClick = () => {
    if (!card) return
    updateForm.reset({
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
    updateForm.reset()
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

  const handleSave = updateForm.handleSubmit(onUpdateSubmit)

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

  const drawerTabs = card
    ? [
        { key: 'info', label: '기본', icon: <CreditCard size={12} /> },
        { key: 'access', label: '접근권한', icon: <DoorOpen size={12} /> },
        { key: 'hist', label: '최근이력', icon: <History size={12} /> },
      ]
    : undefined

  const drawerHeader = card ? (
    <div
      className="flex items-stretch gap-3 pb-3"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <div
        className="rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: 'var(--color-btn-accent-bg)',
          width: '42px',
          height: '42px',
        }}
      >
        <CreditCard size={30} style={{ color: 'var(--color-btn-accent-text)' }} />
      </div>
      <div className="flex gap-0 min-w-0 flex-1 ">
        <span
          className="font-medium leading-tight self-center"
          style={{ color: 'var(--color-text)', fontSize: 20 }}
        >
          {card.name}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap ml-2">
          <Badge variant={typeBadgeVariant(cardTypeLabel(card))}>
            {cardTypeLabel(card)}
          </Badge>
          <Badge variant={cardStatusLabel(card) === '활성' ? 'on' : 'off'}>
            {cardStatusLabel(card)}
          </Badge>
        </div>
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions = card ? (
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

  const drawerChildren = !card ? (
    <div className="flex items-center justify-center h-full min-h-[120px]">
      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        목록에서 항목을 선택하세요
      </span>
    </div>
  ) : (
    <>
      {activeTab === 'info' && (
        <CardInfoTab
          card={card}
          editMode={editMode}
          register={updateForm.register}
          control={updateForm.control}
          empList={empList}
          empNameMap={empNameMap}
          exemptApb={exemptApb}
          exemptPin={exemptPin}
          onExemptApbChange={setExemptApb}
          onExemptPinChange={setExemptPin}
        />
      )}
      {activeTab === 'access' && (
        <CardAccessTab card={card} accLvNamesDisplay={accLvNamesDisplay} />
      )}
      {activeTab === 'hist' && <CardHistTab card={card} />}
    </>
  )

  return (
    <>
      <Drawer
        width={400}
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
