import { useState, useMemo, useEffect } from 'react'
import { useForm, type Resolver, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CreditCard,
  Download,
  Printer,
  Plus,
  SlidersHorizontal,
  Trash2,
  Pencil,
  X,
  Check,
  Tag,
  Layers,
  CircleCheck,
  User,
  CalendarCheck,
  CalendarX,
  MapPin,
  Shield,
  DoorOpen,
  History,
  Cpu,
  ScanLine,
  Clock,
} from 'lucide-react'
import { Grid } from '@/components/ui/Grid'
import { Drawer } from '@/components/ui/Drawer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  useCardList,
  useCreateCard,
  useUpdateCard,
  useDeleteCard,
  useCardAccLvList,
} from '@/hooks/useCard'
import { useEmpList } from '@/hooks/useEmps'
import { useAccLvList } from '@/hooks/useAccLv'
import type { ColumnDef } from '@/components/ui/Grid'
import type { CardAccLvInfo, CardInfo, CreateCardRequest, UpdateCardRequest } from '@/types/api'

// ─── Grid 호환 타입 (CardInfo.cid → id) ──────────────────────────────────────

type CardRow = CardInfo & { id: number }

const cardPrimaryKey = (c: CardInfo): number | undefined => {
  const row = c as CardInfo & { id?: number }
  const pk = row.cid ?? row.id
  if (typeof pk !== 'number' || !Number.isFinite(pk)) return undefined
  return pk
}

// ─── Zod ─────────────────────────────────────────────────────────────────────

const createCardSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  cardNum: z.string().min(1, '카드 번호를 입력하세요'),
  empId: z.number().optional(),
  type: z.string().optional().default('직원'),
  status: z.string().optional().default('활성'),
})

const updateCardSchema = createCardSchema

type CreateCardFormValues = z.infer<typeof createCardSchema>
type UpdateCardFormValues = z.infer<typeof updateCardSchema>

// ─── Local UI ─────────────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[12px] font-medium tracking-wide pb-1.5 mb-2"
    style={{ color: 'var(--color-text-subtle)', borderBottom: '0.5px solid var(--color-border)' }}
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
    <span className="text-[12px] flex items-center gap-1.5 flex-shrink-0" style={{ color: 'var(--color-text-subtle)' }}>
      {icon}
      {label}
    </span>
    {children}
  </div>
)

const FieldValue = ({
  children,
  mono = false,
  small = false,
}: {
  children: React.ReactNode
  mono?: boolean
  small?: boolean
}) => (
  <span
    className={['text-right', mono ? 'font-mono' : '', small ? 'text-[12px]' : 'text-[13px]']
      .filter(Boolean)
      .join(' ')}
    style={{ color: 'var(--color-text)' }}
  >
    {children}
  </span>
)

const selectLikeStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-btn-hover)',
  color: 'var(--color-text)',
  borderColor: 'var(--color-btn-default-border)',
}

const typeBadgeVariant = (type: string): NonNullable<React.ComponentProps<typeof Badge>['variant']> => {
  if (type === '방문') return 'visit'
  if (type === '발급') return 'issue'
  return 'card'
}

const cardTypeLabel = (c: CardInfo) => c.type ?? '직원'
const cardStatusLabel = (c: CardInfo) => c.status ?? (c.isActive ? '활성' : '비활성')

const toUpdateRequest = (
  values: UpdateCardFormValues,
  base: CardInfo,
  exemptApb: boolean,
  exemptPin: boolean,
): UpdateCardRequest => ({
  cardNumber: values.cardNum.trim(),
  name: values.name.trim(),
  empId: values.empId,
  isActive: values.status === '활성',
  type: values.type,
  status: values.status,
  issuedAt: base.issuedAt,
  expiredAt: base.expiredAt,
  area: base.area,
  lastCtrl: base.lastCtrl,
  lastReader: base.lastReader,
  lastAccess: base.lastAccess,
  exemptApb,
  exemptPin,
})

const CheckboxLook = ({ checked }: { checked: boolean }) => (
  <div
    className="w-[14px] h-[14px] rounded border flex items-center justify-center flex-shrink-0"
    style={{
      background: checked ? '#172d4a' : 'var(--color-btn-hover)',
      borderColor: checked ? '#1e4570' : '#2e3139',
    }}
  >
    {checked ? <Check size={10} style={{ color: 'var(--color-accent)' }} /> : null}
  </div>
)

// ─── Main page ────────────────────────────────────────────────────────────────

export const CardsPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('info')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [exemptApb, setExemptApb] = useState(false)
  const [exemptPin, setExemptPin] = useState(false)

  const { data: cardList, isLoading: cardLoading } = useCardList()
  const { data: empList } = useEmpList()
  const { data: accLvList } = useAccLvList()
  const { data: cardAccLvList } = useCardAccLvList(selectedId ?? 0)

  const { mutate: createCard, isPending: isCreating } = useCreateCard()
  const { mutate: updateCard, isPending: isUpdating } = useUpdateCard()
  const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard()

  const updateForm = useForm<UpdateCardFormValues>({
    resolver: zodResolver(updateCardSchema) as Resolver<UpdateCardFormValues>,
  })

  const createForm = useForm<CreateCardFormValues>({
    resolver: zodResolver(createCardSchema) as Resolver<CreateCardFormValues>,
    defaultValues: {
      name: '',
      cardNum: '',
      empId: undefined,
      type: '직원',
      status: '활성',
    },
  })
  const { reset: resetCreateForm } = createForm

  const normalizedCards = useMemo<CardRow[]>(
    () =>
      cardList?.flatMap((c) => {
        const pk = cardPrimaryKey(c)
        if (pk === undefined) return []
        const normalized: CardRow = { ...c, cid: pk, id: pk }
        return [normalized]
      }) ?? [],
    [cardList],
  )

  const empNameMap = useMemo(() => {
    if (!empList) return {} as Record<number, string>
    return empList.reduce<Record<number, string>>((acc, emp) => {
      acc[emp.id] = emp.name
      return acc
    }, {})
  }, [empList])

  const accLvNameMap = useMemo(() => {
    if (!accLvList) return {} as Record<number, string>
    return accLvList.reduce<Record<number, string>>((acc, a) => {
      acc[a.id] = a.name
      return acc
    }, {})
  }, [accLvList])

  const filteredCards = useMemo(() => {
    if (!normalizedCards.length) return normalizedCards
    if (!searchQuery) return normalizedCards
    const q = searchQuery.toLowerCase()
    return normalizedCards.filter((c) => {
      const name = (c.name ?? '').toLowerCase()
      const num = c.cardNumber.toLowerCase()
      const emp =
        c.empId != null ? (empNameMap[c.empId] ?? c.empName ?? '').toLowerCase() : ''
      return name.includes(q) || num.includes(q) || emp.includes(q)
    })
  }, [normalizedCards, searchQuery, empNameMap])

  const selectedCard = useMemo(
    () => normalizedCards.find((c) => c.id === selectedId) ?? null,
    [normalizedCards, selectedId],
  )

  useEffect(() => {
    if (!createModalOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCreateModalOpen(false)
        resetCreateForm()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [createModalOpen, resetCreateForm])

  const handleRowClick = (row: CardRow) => {
    if (editMode) setEditMode(false)
    setSelectedId(row.id)
    setActiveTab('info')
  }

  const onEditClick = () => {
    if (!selectedCard) return
    updateForm.reset({
      name: selectedCard.name ?? '',
      cardNum: selectedCard.cardNumber,
      empId: selectedCard.empId,
      type: cardTypeLabel(selectedCard),
      status: cardStatusLabel(selectedCard),
    })
    setExemptApb(!!selectedCard.exemptApb)
    setExemptPin(!!selectedCard.exemptPin)
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    updateForm.reset()
  }

  const onUpdateSubmit = (values: UpdateCardFormValues) => {
    if (!selectedId || !selectedCard) return
    const data = toUpdateRequest(values, selectedCard, exemptApb, exemptPin)
    updateCard(
      { id: selectedId, data },
      {
        onSuccess: (ok) => {
          if (!ok) return
          setEditMode(false)
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
        setSelectedId(null)
      },
    })
  }

  const onCreateSubmit = (values: CreateCardFormValues) => {
    const payload: CreateCardRequest = {
      cardNumber: values.cardNum.trim(),
      name: values.name.trim(),
      empId: values.empId,
      isActive: values.status === '활성',
      type: values.type,
      status: values.status,
      exemptApb: false,
      exemptPin: false,
    }
    createCard(payload, {
      onSuccess: (ok) => {
        if (!ok) return
        setCreateModalOpen(false)
        resetCreateForm()
      },
    })
  }

  const handleCreateModalCancel = () => {
    setCreateModalOpen(false)
    resetCreateForm()
  }

  const columns: ColumnDef<CardRow>[] = useMemo(
    () => [
      {
        key: 'id',
        header: 'ID',
        width: 50,
        render: (value) => (
          <span style={{ fontSize: 11, color: 'var(--color-text-dim)', fontFamily: 'monospace' }}>
            {String(value)}
          </span>
        ),
      },
      {
        key: 'name',
        header: '명칭',
        width: 90,
        render: (_, row) => (row.name?.trim() ? row.name : '—'),
      },
      {
        key: 'cardNumber',
        header: '카드 번호',
        width: 110,
        render: (value) => (
          <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{String(value ?? '')}</span>
        ),
      },
      {
        key: 'empId',
        header: '카드 사용자',
        width: 90,
        render: (value, row) => {
          if (value == null) return '—'
          return empNameMap[value as number] ?? row.empName ?? '—'
        },
      },
      {
        key: 'type',
        header: '유형',
        width: 72,
        render: (_, row) => <Badge variant={typeBadgeVariant(cardTypeLabel(row))}>{cardTypeLabel(row)}</Badge>,
      },
      {
        key: 'isActive',
        header: '상태',
        width: 72,
        render: (_, row) => (
          <Badge variant={cardStatusLabel(row) === '활성' ? 'on' : 'off'}>{cardStatusLabel(row)}</Badge>
        ),
      },
      {
        key: 'lastAccess',
        header: '마지막 접근 일시',
        width: 130,
        render: (_, row) => (row.lastAccess?.trim() ? row.lastAccess : '—'),
      },
    ],
    [empNameMap],
  )

  const drawerHeader = selectedCard ? (
    <div className="flex items-start gap-3 pb-3" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
      <div
        className="w-[42px] h-[42px] rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: '#1a3a5c' }}
      >
        <CreditCard size={22} style={{ color: 'var(--color-accent)' }} />
      </div>
      <div className="flex flex-col gap-0 min-w-0 flex-1">
        <span className="text-[13px] font-medium font-mono leading-tight" style={{ color: 'var(--color-text)' }}>
          {selectedCard.cardNumber}
        </span>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <Badge variant={typeBadgeVariant(cardTypeLabel(selectedCard))}>{cardTypeLabel(selectedCard)}</Badge>
          <Badge variant={cardStatusLabel(selectedCard) === '활성' ? 'on' : 'off'}>{cardStatusLabel(selectedCard)}</Badge>
        </div>
        <span
          className="inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-full font-mono mt-1.5"
          style={{
            background: 'var(--color-btn-hover)',
            color: 'var(--color-text-subtle)',
            border: '0.5px solid var(--color-border)',
            width: 'fit-content',
          }}
        >
          #{selectedCard.cid}
        </span>
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions = selectedCard
    ? editMode
      ? (
          <>
            <Button variant="default" size="sm" leftIcon={<X size={12} />} onClick={handleCancelEdit}>
              취소
            </Button>
            <Button
              variant="accent"
              size="sm"
              leftIcon={<Check size={12} />}
              loading={isUpdating}
              onClick={handleSave}
            >
              저장
            </Button>
          </>
        )
      : (
          <>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 size={12} />}
              onClick={() => setDeleteModalOpen(true)}
            >
              삭제
            </Button>
            <Button variant="accent" size="sm" leftIcon={<Pencil size={12} />} onClick={onEditClick}>
              수정
            </Button>
          </>
        )
    : null

  const drawerTabs = [
    { key: 'info', label: '기본', icon: <CreditCard size={12} /> },
    { key: 'access', label: '접근권한', icon: <DoorOpen size={12} /> },
    { key: 'hist', label: '최근이력', icon: <History size={12} /> },
  ]

  const accLvNamesDisplay = useMemo(() => {
    const rows: CardAccLvInfo[] = cardAccLvList ?? []
    if (!rows.length) return '—'
    const names = rows
      .map((row) => accLvNameMap[row.alvid] ?? `ID ${row.alvid}`)
      .filter(Boolean)
    return names.length ? names.join(', ') : '—'
  }, [cardAccLvList, accLvNameMap])

  const renderHistRow = (icon: React.ReactNode, title: string, sub: string) => (
    <div className="flex items-start gap-2 py-1.5 border-b border-[#21252b]">
      <span className="text-[#3a3f4a] mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px]" style={{ color: 'var(--color-text)' }}>
          {title || '—'}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: '#555a63' }}>
          {sub}
        </p>
      </div>
    </div>
  )

  const renderInfoTab = () => {
    if (!selectedCard) return null
    const t = cardTypeLabel(selectedCard)
    const s = cardStatusLabel(selectedCard)
    const empLabel =
      selectedCard.empId != null ? (empNameMap[selectedCard.empId] ?? selectedCard.empName ?? '—') : '—'
    const activeAt = selectedCard.issuedAt?.trim() ? selectedCard.issuedAt : '—'
    const inactiveAt = selectedCard.expiredAt?.trim() ? selectedCard.expiredAt : '—'

    return (
      <div>
        <SectionTitle>카드 정보</SectionTitle>
        <FRow icon={<CreditCard size={12} />} label="카드 번호">
          {editMode ? (
            <Input {...updateForm.register('cardNum')} style={{ width: 148 }} />
          ) : (
            <FieldValue mono>{selectedCard.cardNumber}</FieldValue>
          )}
        </FRow>
        <FRow icon={<Tag size={12} />} label="명칭">
          {editMode ? (
            <Input {...updateForm.register('name')} style={{ width: 148 }} />
          ) : (
            <FieldValue>{selectedCard.name?.trim() ? selectedCard.name : '—'}</FieldValue>
          )}
        </FRow>
        <FRow icon={<Layers size={12} />} label="유형">
          {editMode ? (
            <select
              {...updateForm.register('type')}
              className="w-full text-[12px] px-2 py-1 rounded border outline-none"
              style={{ ...selectLikeStyle, width: 148 }}
            >
              <option value="직원">직원</option>
              <option value="방문">방문</option>
              <option value="발급">발급</option>
            </select>
          ) : (
            <Badge variant={typeBadgeVariant(t)}>{t}</Badge>
          )}
        </FRow>
        <FRow icon={<CircleCheck size={12} />} label="상태">
          {editMode ? (
            <select
              {...updateForm.register('status')}
              className="w-full text-[12px] px-2 py-1 rounded border outline-none"
              style={{ ...selectLikeStyle, width: 148 }}
            >
              <option value="활성">활성</option>
              <option value="비활성">비활성</option>
            </select>
          ) : (
            <Badge variant={s === '활성' ? 'on' : 'off'}>{s}</Badge>
          )}
        </FRow>

        <div className="mt-4" />
        <SectionTitle>사용자</SectionTitle>
        <FRow icon={<User size={12} />} label="카드 사용자">
          {editMode ? (
            <Controller
              name="empId"
              control={updateForm.control}
              render={({ field }) => (
                <select
                  className="w-full text-[12px] px-2 py-1 rounded border outline-none"
                  style={{ ...selectLikeStyle, width: 148 }}
                  value={field.value === undefined ? '' : String(field.value)}
                  onChange={(e) => {
                    const v = e.target.value
                    field.onChange(v === '' ? undefined : Number(v))
                  }}
                >
                  <option value="">선택 안 함</option>
                  {(empList ?? []).map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              )}
            />
          ) : (
            <FieldValue>{empLabel}</FieldValue>
          )}
        </FRow>

        <div className="mt-4" />
        <SectionTitle>기간</SectionTitle>
        <FRow icon={<CalendarCheck size={12} />} label="활성 일시">
          <span className="text-[11px] text-right" style={{ color: 'var(--color-text)' }}>
            {activeAt}
          </span>
        </FRow>
        <FRow icon={<CalendarX size={12} />} label="비활성 일시">
          <span className="text-[11px] text-right" style={{ color: 'var(--color-text)' }}>
            {inactiveAt}
          </span>
        </FRow>

        <div className="mt-4" />
        <SectionTitle>옵션</SectionTitle>
        <FRow icon={<span className="w-3" />} label="APB 면제">
          {editMode ? (
            <label className="flex items-center justify-end gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exemptApb}
                onChange={(e) => setExemptApb(e.target.checked)}
                className="accent-[var(--color-accent)]"
              />
            </label>
          ) : (
            <span className="flex justify-end">
              <CheckboxLook checked={!!selectedCard.exemptApb} />
            </span>
          )}
        </FRow>
        <FRow icon={<span className="w-3" />} label="PIN 면제">
          {editMode ? (
            <label className="flex items-center justify-end gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exemptPin}
                onChange={(e) => setExemptPin(e.target.checked)}
                className="accent-[var(--color-accent)]"
              />
            </label>
          ) : (
            <span className="flex justify-end">
              <CheckboxLook checked={!!selectedCard.exemptPin} />
            </span>
          )}
        </FRow>
      </div>
    )
  }

  const renderAccessTab = () => {
    if (!selectedCard) return null
    const area = selectedCard.area?.trim() ? selectedCard.area : '—'
    return (
      <div>
        <SectionTitle>접근 권한</SectionTitle>
        <FRow icon={<Shield size={12} />} label="권한 그룹">
          <FieldValue small>{accLvNamesDisplay}</FieldValue>
        </FRow>
        <div className="mt-4" />
        <SectionTitle>영역</SectionTitle>
        <FRow icon={<MapPin size={12} />} label="마지막 영역">
          <FieldValue small>{area}</FieldValue>
        </FRow>
      </div>
    )
  }

  const renderHistTab = () => {
    if (!selectedCard) return null
    return (
      <div>
        <SectionTitle>마지막 접근</SectionTitle>
        {renderHistRow(
          <Cpu size={14} />,
          selectedCard.lastCtrl?.trim() ?? '—',
          '주 제어기',
        )}
        {renderHistRow(
          <ScanLine size={14} />,
          selectedCard.lastReader?.trim() ?? '—',
          '리더',
        )}
        {renderHistRow(
          <Clock size={14} />,
          selectedCard.lastAccess?.trim() ?? '—',
          '접근 일시',
        )}
      </div>
    )
  }

  const drawerChildren = !selectedCard ? (
    <div className="flex items-center justify-center h-full min-h-[120px]">
      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        목록에서 항목을 선택하세요
      </span>
    </div>
  ) : (
    <>
      {activeTab === 'info' && renderInfoTab()}
      {activeTab === 'access' && renderAccessTab()}
      {activeTab === 'hist' && renderHistTab()}
    </>
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex items-center justify-between flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <CreditCard style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
            카드
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="default" leftIcon={<Download size={12} />}>
           보내기
          </Button>
          <Button variant="default" leftIcon={<Printer size={12} />}>
            인쇄
          </Button>
          <Button variant="accent" leftIcon={<Plus size={12} />} onClick={() => setCreateModalOpen(true)}>
            추가
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Grid
          columns={columns}
          data={filteredCards}
          selectedId={selectedId ?? undefined}
          onRowClick={handleRowClick}
          searchPlaceholder="카드번호, 명칭, 사용자 검색..."
          onSearch={setSearchQuery}
          totalCount={filteredCards.length}
          loading={cardLoading}
          actions={
            <Button variant="default" size="sm" leftIcon={<SlidersHorizontal size={12} />}>
              필터
            </Button>
          }
        />
        <Drawer
          header={drawerHeader}
          actions={drawerActions ?? undefined}
          tabs={selectedCard ? drawerTabs : undefined}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {drawerChildren}
        </Drawer>
      </div>

      <Modal
        open={deleteModalOpen}
        title="카드 삭제"
        description={`카드 "${selectedCard?.cardNumber ?? ''}"를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {createModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="rounded-md p-5 w-[320px]"
            style={{ background: 'var(--color-sidebar)', border: '0.5px solid #2a2d32' }}
          >
            <p className="text-[13px] font-medium mb-4" style={{ color: 'var(--color-text)' }}>
              카드 추가
            </p>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex flex-col">
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  카드 번호
                </label>
                <Input {...createForm.register('cardNum')} error={createForm.formState.errors.cardNum?.message} />
              </div>
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  명칭
                </label>
                <Input {...createForm.register('name')} error={createForm.formState.errors.name?.message} />
              </div>
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  카드 사용자
                </label>
                <Controller
                  name="empId"
                  control={createForm.control}
                  render={({ field }) => (
                    <select
                      className="w-full text-[12px] px-2 py-1 rounded border outline-none"
                      style={selectLikeStyle}
                      value={field.value === undefined ? '' : String(field.value)}
                      onChange={(e) => {
                        const v = e.target.value
                        field.onChange(v === '' ? undefined : Number(v))
                      }}
                    >
                      <option value="">선택 안 함</option>
                      {(empList ?? []).map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  유형
                </label>
                <select
                  {...createForm.register('type')}
                  className="w-full text-[12px] px-2 py-1 rounded border outline-none"
                  style={selectLikeStyle}
                >
                  <option value="직원">직원</option>
                  <option value="방문">방문</option>
                  <option value="발급">발급</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <Button type="button" variant="default" onClick={handleCreateModalCancel}>
                  취소
                </Button>
                <Button type="submit" variant="accent" loading={isCreating}>
                  저장
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
