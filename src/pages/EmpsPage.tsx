import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
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
import { useEmpList, useUpdateEmp, useDeleteEmp } from '@/hooks/useEmps'
import { useCardList } from '@/hooks/useCard'
import type { ColumnDef } from '@/components/ui/Grid'
import type { CardInfo, EmpInfo, UpdateEmpRequest } from '@/types/api'

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

// ─── Main page ────────────────────────────────────────────────────────────────

export const EmpsPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('info')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { data: empList, isLoading: empLoading } = useEmpList()
  const { data: cardList } = useCardList()
  const updateEmpMut = useUpdateEmp()
  const deleteEmpMut = useDeleteEmp()

  const { register, handleSubmit, reset } = useForm<UpdateEmpRequest>()

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
        emp.employeeNumber.toLowerCase().includes(q) ||
        (emp.department?.toLowerCase().includes(q) ?? false),
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

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleRowClick = (emp: EmpInfo) => {
    if (editMode) setEditMode(false)
    setSelectedId(emp.id)
    setActiveTab('info')
  }

  const handleEdit = () => {
    if (!selectedEmp) return
    reset({
      name: selectedEmp.name,
      employeeNumber: selectedEmp.employeeNumber,
      department: selectedEmp.department ?? '',
      email: selectedEmp.email ?? '',
      phone: selectedEmp.phone ?? '',
    })
    setEditMode(true)
  }

  const handleCancel = () => {
    setEditMode(false)
    reset()
  }

  const handleSave = handleSubmit(async (formData) => {
    if (!selectedId) return
    const ok = await updateEmpMut.mutateAsync({ id: selectedId, data: formData })
    if (ok) setEditMode(false)
  })

  const handleDeleteConfirm = async () => {
    if (!selectedId) return
    const ok = await deleteEmpMut.mutateAsync(selectedId)
    if (ok) {
      setSelectedId(null)
      setDeleteModalOpen(false)
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
        key: 'employeeNumber',
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
        key: 'department',
        header: '부서',
        width: 90,
        render: (value) => (value ? String(value) : '—'),
      },
      {
        key: 'rank',
        header: '직급',
        width: 60,
        render: () => '—',
      },
      {
        key: 'email',
        header: '이메일',
        width: 140,
        render: (value) =>
          value ? <span style={{ fontSize: 11 }}>{String(value)}</span> : '—',
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
          {selectedEmp.department ?? '—'} · {'—'}
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
      <>
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
      </>
    ) : (
      <>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<Trash2 size={12} />}
          onClick={() => setDeleteModalOpen(true)}
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
          {editMode ? (
            <Input {...register('employeeNumber')} style={{ width: 148 }} />
          ) : (
            val(selectedEmp.employeeNumber, true)
          )}
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
            <Input {...register('department')} style={{ width: 148 }} />
          ) : (
            val(selectedEmp.department)
          )}
        </FRow>
        <FRow icon={<Award size={12} />} label="직급">
          {val(undefined)}
        </FRow>

        <div className="mt-4" />
        <SectionTitle>연락처</SectionTitle>
        <FRow icon={<Phone size={12} />} label="전화">
          {editMode ? (
            <Input {...register('phone')} style={{ width: 148 }} />
          ) : (
            val(selectedEmp.phone, true)
          )}
        </FRow>
        <FRow icon={<Mail size={12} />} label="이메일">
          {editMode ? (
            <Input {...register('email')} style={{ width: 148 }} />
          ) : (
            <FieldValue small>{selectedEmp.email ?? '—'}</FieldValue>
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
          <Button variant="accent" leftIcon={<Plus size={12} />}>
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
        description={`"${selectedEmp?.name}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        variant="danger"
        loading={deleteEmpMut.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}
