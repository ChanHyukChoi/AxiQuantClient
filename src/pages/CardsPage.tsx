import { useState, useMemo } from 'react'
import { CreditCard, Download, Printer, Plus, SlidersHorizontal } from 'lucide-react'
import { Grid } from '@/components/ui/Grid'
import { Drawer } from '@/components/ui/Drawer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useCardList } from '@/hooks/useCard'
import { useEmpList } from '@/hooks/useEmps'
import { useAccLvList } from '@/hooks/useAccLv'
import type { ColumnDef } from '@/components/ui/Grid'
import type { CardInfo } from '@/types/api'

// ─── Grid 호환 타입 (CardInfo.cid → id) ──────────────────────────────────────

type CardRow = CardInfo & { id: number }

// ─── Main page ────────────────────────────────────────────────────────────────

export const CardsPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('info')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { data: cardList, isLoading: cardLoading } = useCardList()
  const { data: empList } = useEmpList()
  const { data: accLvList } = useAccLvList()

  // cid → id 정규화
  const normalizedCards = useMemo<CardRow[]>(
    () => cardList?.map((c) => ({ ...c, id: c.cid })) ?? [],
    [cardList],
  )

  // 사원 이름 빠른 조회 맵
  const empNameMap = useMemo(() => {
    if (!empList) return {} as Record<number, string>
    return empList.reduce<Record<number, string>>((acc, emp) => {
      acc[emp.id] = emp.name
      return acc
    }, {})
  }, [empList])

  // 클라이언트 필터링
  const filteredCards = useMemo(() => {
    if (!normalizedCards.length) return normalizedCards
    if (!searchQuery) return normalizedCards
    const q = searchQuery.toLowerCase()
    return normalizedCards.filter(
      (c) =>
        c.cardNumber.toLowerCase().includes(q) ||
        (c.empId != null && (empNameMap[c.empId] ?? '').toLowerCase().includes(q)),
    )
  }, [normalizedCards, searchQuery, empNameMap])

  const selectedCard = useMemo(
    () => cardList?.find((c) => c.cid === selectedId) ?? null,
    [cardList, selectedId],
  )

  // accLvList를 사용하는 파트 2에서 활용 예정
  void accLvList

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleRowClick = (row: CardRow) => {
    if (editMode) setEditMode(false)
    setSelectedId(row.id)
    setActiveTab('info')
  }

  // ─── Column definitions ────────────────────────────────────────────────────

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
        render: () => '—',
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
        render: (value) => {
          if (value == null) return '—'
          return empNameMap[value as number] ?? '—'
        },
      },
      {
        key: 'type',
        header: '유형',
        width: 60,
        render: () => '—',
      },
      {
        key: 'isActive',
        header: '상태',
        width: 60,
        render: (value) =>
          value ? (
            <Badge variant="on">활성</Badge>
          ) : (
            <Badge variant="off">비활성</Badge>
          ),
      },
      {
        key: 'lastAccess',
        header: '마지막 접근 일시',
        width: 130,
        render: () => '—',
      },
    ],
    [empNameMap],
  )

  // ─── Drawer header ─────────────────────────────────────────────────────────

  const drawerHeader = selectedCard ? (
    <div className="pb-3" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
      <div className="flex items-center gap-1.5 mb-1">
        <CreditCard size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
        <span className="text-[15px] font-medium font-mono" style={{ color: 'var(--color-text)' }}>
          {selectedCard.cardNumber}
        </span>
      </div>
      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        {selectedCard.empId != null
          ? (empNameMap[selectedCard.empId] ?? selectedCard.empName ?? '—')
          : '미배정'}
      </span>
      <div className="mt-1.5">
        <span
          className="inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-full font-mono"
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
          <CreditCard style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
            카드
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
          tabs={undefined}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {!selectedCard ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
                목록에서 항목을 선택하세요
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
                카드 상세 준비 중
              </span>
            </div>
          )}
        </Drawer>
      </div>

      {/* Delete modal */}
      <Modal
        open={deleteModalOpen}
        title="카드 삭제"
        description={`카드 "${selectedCard?.cardNumber}"를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        variant="danger"
        onConfirm={() => setDeleteModalOpen(false)}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}
