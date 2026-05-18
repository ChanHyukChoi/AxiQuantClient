import { useState, useMemo, useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  BadgeCheck,
  Download,
  Printer,
  Plus,
  SlidersHorizontal,
  User,
  Hash,
  Users,
  Calendar,
  Building2,
  Network,
  Award,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Fingerprint,
  Trash2,
  Pencil,
  X,
  Check,
} from 'lucide-react'
import { Grid } from '@/components/ui/Grid'
import { Drawer } from '@/components/ui/Drawer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useEmpList, useCreateEmp, useUpdateEmp, useDeleteEmp } from '@/hooks/useEmps'
import { useCardList } from '@/hooks/useCard'
import type { ColumnDef } from '@/components/ui/Grid'
import type { CardInfo, CreateEmpRequest, EmpInfo, UpdateEmpRequest } from '@/types/api'

// ─── Local helpers ────────────────────────────────────────────────────────────

const Avatar = ({ name, size }: { name: string; size: 26 | 46 }) => (
  <div
    className="rounded-full flex-shrink-0 flex items-center justify-center font-medium"
    style={{
      width: size,
      height: size,
      background: 'var(--color-btn-accent-bg)',
      color: 'var(--color-accent)',
      fontSize: size === 26 ? 12 : 18,
    }}
  >
    {name.charAt(0)}
  </div>
)

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

const CardItem = ({ card }: { card: CardInfo }) => (
  <div className="rounded p-2.5 mb-2" style={{ border: '0.5px solid var(--color-border)' }}>
    <div className="flex items-center justify-between">
      <Badge variant="card">카드</Badge>
      <Badge variant={card.isActive ? 'on' : 'off'}>{card.isActive ? '활성' : '반납'}</Badge>
    </div>
    <p className="text-[13px] font-mono mt-1.5" style={{ color: 'var(--color-cell)' }}>
      {card.cardNumber}
    </p>
    <div className="flex gap-2 mt-1" style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
      {card.issuedAt && <span>발급: {card.issuedAt}</span>}
      {card.expiredAt && (
        <span>
          {card.isActive ? '만료:' : '반납:'} {card.expiredAt}
        </span>
      )}
    </div>
  </div>
)

const createEmpSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  name2: z.string().default(''),
  lastName: z.string().default(''),
  empNo: z.string().default(''),
  dept: z.coerce.number().default(0),
  lv: z.coerce.number().default(0),
  tel: z.string().default(''),
  email: z.union([z.literal(''), z.string().email('올바른 이메일 형식이 아닙니다')]).default(''),
})

type CreateEmpFormValues = z.output<typeof createEmpSchema>

const updateEmpEmailSchema = z.union([z.literal(''), z.string().email('올바른 이메일 형식이 아닙니다')])

const empToUpdatePayload = (emp: EmpInfo): UpdateEmpRequest => {
  const { id, ...rest } = emp
  void id
  return rest
}

// ─── Main page ────────────────────────────────────────────────────────────────

export const EmpsPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('info')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editSaveError, setEditSaveError] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { data: empList, isLoading: empLoading } = useEmpList()
  const { data: cardList } = useCardList()
  const { mutateAsync: createEmpAsync, isPending: isCreating } = useCreateEmp()
  const updateEmpMut = useUpdateEmp()
  const deleteEmpMut = useDeleteEmp()

  const { register, handleSubmit, reset, setError, clearErrors, formState: { errors } } = useForm<UpdateEmpRequest>()

  const createForm = useForm<CreateEmpFormValues>({
    resolver: zodResolver(createEmpSchema) as Resolver<CreateEmpFormValues>,
    defaultValues: {
      name: '',
      name2: '',
      lastName: '',
      empNo: '',
      dept: 0,
      lv: 0,
      tel: '',
      email: '',
    },
  })
  const { reset: resetCreateForm } = createForm

  const selectedEmp = useMemo(
    () => empList?.find((e) => e.id === selectedId) ?? null,
    [empList, selectedId],
  )

  const filteredEmps = useMemo(() => {
    if (!empList) return []
    if (!searchQuery) return empList
    const q = searchQuery.toLowerCase()
    return empList.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.udef.toLowerCase().includes(q) ||
        String(emp.dept).includes(q),
    )
  }, [empList, searchQuery])

  const empCardCountMap = useMemo(() => {
    if (!cardList) return {} as Record<number, number>
    return cardList.reduce<Record<number, number>>((acc, card) => {
      if (card.empId != null) {
        acc[card.empId] = (acc[card.empId] ?? 0) + 1
      }
      return acc
    }, {})
  }, [cardList])

  const selectedCards = useMemo(
    () => cardList?.filter((c) => c.empId === selectedId) ?? [],
    [cardList, selectedId],
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

  const onCreateSubmit = async (values: CreateEmpFormValues) => {
    createForm.clearErrors('root')
    const payload: CreateEmpRequest = {
      name: values.name,
      name2: values.name2 ?? '',
      lastName: values.lastName ?? '',
      ssn: '',
      birth: '',
      company: 0,
      dept: values.dept ?? 0,
      lv: values.lv ?? 0,
      empType: 0,
      tel: values.tel ?? '',
      email: values.email ?? '',
      addr: '',
      /** WPF `EmpEditModel.ToInfo` 와 동일 — wire 에서는 `emps.ts` 가 항상 `"{}"` 로 보냄 */
      udef: '{}',
    }
    void values.empNo
    const result = await createEmpAsync(payload)
    if (!result.ok) {
      createForm.setError('root', {
        type: 'server',
        message:
          result.message ||
          '서버에 저장하지 못했습니다. F12 네트워크에서 응답 상태(4xx/5xx)와 본문을 확인하세요. 개발 모드에서는 콘솔에 [api/emps] 로그가 남습니다.',
      })
      return
    }
    setCreateModalOpen(false)
    resetCreateForm()
  }

  const handleCreateModalCancel = () => {
    setCreateModalOpen(false)
    resetCreateForm()
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleRowClick = (emp: EmpInfo) => {
    if (editMode) setEditMode(false)
    setEditSaveError(null)
    setSelectedId(emp.id)
    setActiveTab('info')
  }

  const handleEdit = () => {
    if (!selectedEmp) return
    setEditSaveError(null)
    reset(empToUpdatePayload(selectedEmp))
    setEditMode(true)
  }

  const handleCancel = () => {
    setEditMode(false)
    setEditSaveError(null)
    reset()
  }

  const handleSave = handleSubmit(async (formData) => {
    if (!selectedId || !selectedEmp) return
    setEditSaveError(null)
    const merged: UpdateEmpRequest = { ...empToUpdatePayload(selectedEmp), ...formData }
    const emailParsed = updateEmpEmailSchema.safeParse(merged.email.trim())
    if (!emailParsed.success) {
      const msg = emailParsed.error.issues[0]?.message ?? '올바른 이메일 형식이 아닙니다'
      setError('email', { type: 'manual', message: msg })
      return
    }
    clearErrors('email')
    const data: UpdateEmpRequest = { ...merged, email: emailParsed.data }
    const result = await updateEmpMut.mutateAsync({ id: selectedId, data })
    if (result.ok) {
      setEditMode(false)
      setEditSaveError(null)
    } else {
      setEditSaveError(result.message)
    }
  })

  const handleDeleteConfirm = async () => {
    if (!selectedId) return
    setDeleteError(null)
    const result = await deleteEmpMut.mutateAsync(selectedId)
    if (result.ok) {
      setSelectedId(null)
      setDeleteModalOpen(false)
      setDeleteError(null)
    } else {
      setDeleteError(
        result.message ||
          '삭제하지 못했습니다. 카드·권한 등 다른 데이터가 참조 중이거나 서버가 거부했을 수 있습니다. F12 네트워크 응답을 확인하세요.',
      )
    }
  }

  // ─── Column definitions ────────────────────────────────────────────────────

  const columns: ColumnDef<EmpInfo>[] = useMemo(
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
        header: '이름',
        width: 120,
        render: (_, row) => (
          <div className="flex items-center gap-2">
            <Avatar name={row.name} size={26} />
            <span>{row.name}</span>
          </div>
        ),
      },
      {
        key: 'udef',
        header: '사번',
        width: 70,
        render: (value) =>
          value ? (
            <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{String(value)}</span>
          ) : (
            '—'
          ),
      },
      {
        key: 'dept',
        header: '부서',
        width: 90,
        render: (value) => {
          const n = typeof value === 'number' ? value : Number(value)
          return Number.isFinite(n) && n !== 0 ? String(n) : '—'
        },
      },
      {
        key: 'lv',
        header: '직급',
        width: 60,
        render: (value) => {
          const n = typeof value === 'number' ? value : Number(value)
          return Number.isFinite(n) && n !== 0 ? String(n) : '—'
        },
      },
      {
        key: 'email',
        header: '이메일',
        width: 140,
        render: (value) =>
          value && String(value).trim() !== ''
            ? <span style={{ fontSize: 11 }}>{String(value)}</span>
            : '—',
      },
      {
        key: 'cardCount',
        header: '카드',
        width: 60,
        render: (_, row) => {
          const count = empCardCountMap[row.id] ?? 0
          return count === 0 ? (
            <Badge variant="off">없음</Badge>
          ) : (
            <Badge variant="on">{count}장</Badge>
          )
        },
      },
    ],
    [empCardCountMap],
  )

  // ─── Drawer header ─────────────────────────────────────────────────────────

  const drawerHeader = selectedEmp ? (
    <div
      className="flex items-start gap-3 pb-3"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <Avatar name={selectedEmp.name} size={46} />
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[15px] font-medium leading-tight" style={{ color: 'var(--color-text)' }}>
          {selectedEmp.name}
        </span>
        <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
          {selectedEmp.dept !== 0 ? String(selectedEmp.dept) : '—'} · {'—'}
        </span>
        <span
          className="inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-full font-mono"
          style={{
            background: 'var(--color-btn-hover)',
            color: 'var(--color-text-subtle)',
            border: '0.5px solid var(--color-border)',
            width: 'fit-content',
          }}
        >
          #{selectedEmp.id}
        </span>
      </div>
    </div>
  ) : (
    <div />
  )

  // ─── Drawer actions ────────────────────────────────────────────────────────

  const drawerActions = selectedEmp ? (
    editMode ? (
      <div className="flex flex-col items-stretch gap-2 w-full max-w-[260px] ml-auto">
        {editSaveError ? (
          <p className="text-[11px] leading-snug text-right" style={{ color: '#c75c5c' }}>
            {editSaveError}
          </p>
        ) : null}
        <div className="flex justify-end gap-1.5">
          <Button variant="default" size="sm" leftIcon={<X size={12} />} onClick={handleCancel}>
            취소
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Check size={12} />}
            loading={updateEmpMut.isPending}
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
          onClick={() => {
            setDeleteError(null)
            setDeleteModalOpen(true)
          }}
        >
          삭제
        </Button>
        <Button variant="accent" size="sm" leftIcon={<Pencil size={12} />} onClick={handleEdit}>
          수정
        </Button>
      </>
    )
  ) : null

  // ─── Tab definitions ────────────────────────────────────────────────────────

  const drawerTabs = [
    { key: 'info', label: '인적사항', icon: <User size={12} /> },
    { key: 'card', label: '카드', icon: <CreditCard size={12} /> },
    { key: 'bio', label: '바이오', icon: <Fingerprint size={12} /> },
  ]

  // ─── Tab content: info ─────────────────────────────────────────────────────

  const renderInfoTab = () => {
    if (!selectedEmp) return null

    const val = (content: string | undefined, mono?: boolean, small?: boolean) => (
      <FieldValue mono={mono} small={small}>
        {content || '—'}
      </FieldValue>
    )

    return (
      <div>
        <SectionTitle>기본 정보</SectionTitle>
        <FRow icon={<User size={12} />} label="이름">
          {editMode ? (
            <Input {...register('name')} style={{ width: 148 }} />
          ) : (
            val(selectedEmp.name)
          )}
        </FRow>
        <FRow icon={<Hash size={12} />} label="사번">
          {val(selectedEmp.udef, true)}
        </FRow>
        <FRow icon={<Users size={12} />} label="성별">
          {val(undefined)}
        </FRow>
        <FRow icon={<Calendar size={12} />} label="생년월일">
          {val(undefined, true)}
        </FRow>

        <div className="mt-4" />
        <SectionTitle>소속</SectionTitle>
        <FRow icon={<Building2 size={12} />} label="회사">
          {val(undefined)}
        </FRow>
        <FRow icon={<Network size={12} />} label="부서">
          {editMode ? (
            <Input type="number" {...register('dept', { valueAsNumber: true })} style={{ width: 148 }} />
          ) : (
            val(selectedEmp.dept !== 0 ? String(selectedEmp.dept) : undefined)
          )}
        </FRow>
        <FRow icon={<Award size={12} />} label="직급">
          {val(undefined)}
        </FRow>

        <div className="mt-4" />
        <SectionTitle>연락처</SectionTitle>
        <FRow icon={<Phone size={12} />} label="전화">
          {editMode ? (
            <Input {...register('tel')} style={{ width: 148 }} />
          ) : (
            val(selectedEmp.tel, true)
          )}
        </FRow>
        <FRow icon={<Mail size={12} />} label="이메일">
          {editMode ? (
            <Input {...register('email')} error={errors.email?.message} style={{ width: 148 }} />
          ) : (
            <FieldValue small>{selectedEmp.email.trim() !== '' ? selectedEmp.email : '—'}</FieldValue>
          )}
        </FRow>
        <FRow icon={<MapPin size={12} />} label="주소">
          <span
            className="text-[12px] text-right"
            style={{ color: 'var(--color-text)', maxWidth: 148, lineHeight: 1.5 }}
          >
            —
          </span>
        </FRow>
      </div>
    )
  }

  // ─── Tab content: card ─────────────────────────────────────────────────────

  const renderCardTab = () => {
    if (!selectedEmp) return null
    if (selectedCards.length === 0) {
      return (
        <p className="text-[12px] text-center py-4" style={{ color: 'var(--color-text-subtle)' }}>
          발급된 카드가 없습니다
        </p>
      )
    }
    return (
      <div>
        {selectedCards.map((card) => (
          <CardItem key={card.cid} card={card} />
        ))}
      </div>
    )
  }

  // ─── Tab content: bio ──────────────────────────────────────────────────────

  const renderBioTab = () => (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      <Fingerprint size={32} style={{ color: 'var(--color-border)' }} />
      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        바이오 기능 준비 중
      </span>
    </div>
  )

  // ─── Drawer children ───────────────────────────────────────────────────────

  const drawerChildren = !selectedEmp ? (
    <div className="flex items-center justify-center h-full">
      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        목록에서 항목을 선택하세요
      </span>
    </div>
  ) : (
    <>
      {activeTab === 'info' && renderInfoTab()}
      {activeTab === 'card' && renderCardTab()}
      {activeTab === 'bio' && renderBioTab()}
    </>
  )

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Page header */}
      <div
        className="flex items-center justify-between flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <BadgeCheck style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
            카드 사용자
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="default" leftIcon={<Download size={12} />}>
            내보내기
          </Button>
          <Button variant="default" leftIcon={<Printer size={12} />}>
            인쇄
          </Button>
          <Button variant="accent" leftIcon={<Plus size={12} />} onClick={() => {
            createForm.clearErrors('root')
            setCreateModalOpen(true)
          }}>
            추가
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        <Grid
          columns={columns}
          data={filteredEmps}
          selectedId={selectedId ?? undefined}
          onRowClick={handleRowClick}
          searchPlaceholder="이름, 사번, 부서 검색..."
          onSearch={setSearchQuery}
          totalCount={filteredEmps.length}
          loading={empLoading}
          actions={
            <Button variant="default" size="sm" leftIcon={<SlidersHorizontal size={12} />}>
              필터
            </Button>
          }
        />
        <Drawer
          header={drawerHeader}
          actions={drawerActions ?? undefined}
          tabs={selectedEmp ? drawerTabs : undefined}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {drawerChildren}
        </Drawer>
      </div>

      {/* Delete modal */}
      <Modal
        open={deleteModalOpen}
        title="사용자 삭제"
        description={
          deleteError
            ? `"${selectedEmp?.name}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.\n\n${deleteError}`
            : `"${selectedEmp?.name}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
        }
        confirmLabel="삭제"
        variant="danger"
        loading={deleteEmpMut.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteError(null)
          setDeleteModalOpen(false)
        }}
      />

      {createModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="rounded-md p-5 w-[320px]"
            style={{ background: 'var(--color-sidebar)', border: '0.5px solid #2a2d32' }}
          >
            <p className="text-[13px] font-medium mb-4" style={{ color: 'var(--color-text)' }}>
              사용자 추가
            </p>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex flex-col max-h-[min(520px,85vh)] overflow-y-auto pr-0.5">
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  이름
                </label>
                <Input {...createForm.register('name')} error={createForm.formState.errors.name?.message} />
              </div>
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  이름2
                </label>
                <Input {...createForm.register('name2')} />
              </div>
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  성
                </label>
                <Input {...createForm.register('lastName')} />
              </div>
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  사번
                </label>
                <Input {...createForm.register('empNo')} />
                <p className="text-[10px] mt-0.5 leading-snug" style={{ color: '#555a63' }}>
                  WPF AdminClient와 동일: 이 값은 API 본문에 넣지 않습니다.
                </p>
              </div>
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  부서
                </label>
                <Input type="number" {...createForm.register('dept', { valueAsNumber: true })} />
              </div>
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  직급(lv)
                </label>
                <Input type="number" {...createForm.register('lv', { valueAsNumber: true })} />
              </div>
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  전화
                </label>
                <Input {...createForm.register('tel')} />
              </div>
              <div className="mb-3">
                <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
                  이메일
                </label>
                <Input {...createForm.register('email')} error={createForm.formState.errors.email?.message} />
              </div>
              {createForm.formState.errors.root?.message ? (
                <p className="text-[11px] mb-2 leading-snug" style={{ color: '#c75c5c' }}>
                  {createForm.formState.errors.root.message}
                </p>
              ) : null}
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
