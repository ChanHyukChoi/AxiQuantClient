import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  DoorOpen,
  Plus,
  Shield,
  Trash2,
  Pencil,
  X,
  Check,
  Cpu,
  ScanLine,
  Clock,
} from 'lucide-react'
import { ListPanel } from '@/components/ui/ListPanel'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  useAccLvList,
  useAccLvReaderList,
  useUpdateAccLv,
  useDeleteAccLv,
} from '@/hooks/useAccLv'
import { useScpList } from '@/hooks/useScp'
import { useTimezoneList } from '@/hooks/useTimezone'
import type { AccLvRdrInfo, UpdateAccLvRequest } from '@/types/api'

const accLvSchema = z.object({
  name: z.string().min(1, '권한명을 입력하세요'),
})

type AccLvFormValues = z.infer<typeof accLvSchema>

const SectionBlock = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) => (
  <div className="mb-5">
    <div className="flex items-center gap-1.5 mb-2">
      <span style={{ color: 'var(--color-text-subtle)' }}>{icon}</span>
      <span className="text-[12px] font-medium" style={{ color: 'var(--color-text)' }}>
        {title}
      </span>
    </div>
    {children}
  </div>
)

const IdNameTable = ({ rows }: { rows: { id: number; name: string }[] }) => {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th
            className="text-[10px] font-medium py-1.5 px-2 text-left border-b border-[#21252b]"
            style={{ color: '#3a3f4a' }}
          >
            ID
          </th>
          <th
            className="text-[10px] font-medium py-1.5 px-2 text-left border-b border-[#21252b]"
            style={{ color: '#3a3f4a' }}
          >
            명칭
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={2}
              className="text-[12px] py-2 px-2"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              —
            </td>
          </tr>
        ) : (
          rows.map((row, idx) => {
            const isLast = idx === rows.length - 1
            return (
              <tr
                key={`${row.id}-${idx}`}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === idx ? 'var(--color-btn-hover)' : 'transparent',
                }}
              >
                <td
                  className="py-1.5 px-2 font-mono text-[11px]"
                  style={{
                    color: '#555a63',
                    borderBottom: isLast ? 'none' : '1px solid #1e2127',
                  }}
                >
                  {row.id}
                </td>
                <td
                  className="text-[12px] py-1.5 px-2"
                  style={{
                    color: 'var(--color-text)',
                    borderBottom: isLast ? 'none' : '1px solid #1e2127',
                  }}
                >
                  {row.name}
                </td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}

export const AccessPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { data: accLvList, isLoading: accLvLoading } = useAccLvList()
  const { data: readerList, isLoading: readerLoading } = useAccLvReaderList(selectedId ?? 0)
  const { data: scpList } = useScpList()
  const { data: timezoneList, isLoading: timezoneLoading } = useTimezoneList()

  const { mutate: updateAccLv, isPending: isUpdating } = useUpdateAccLv()
  const { mutate: deleteAccLv, isPending: isDeleting } = useDeleteAccLv()

  const updateForm = useForm<AccLvFormValues>({
    resolver: zodResolver(accLvSchema),
  })

  const selectedAccLv = useMemo(
    () => accLvList?.find((a) => a.id === selectedId) ?? null,
    [accLvList, selectedId],
  )

  const filteredList = useMemo(() => {
    if (!accLvList) return []
    if (!searchQuery.trim()) return accLvList
    const q = searchQuery.toLowerCase()
    return accLvList.filter((a) => a.name.toLowerCase().includes(q))
  }, [accLvList, searchQuery])

  const scpNameMap = useMemo(() => {
    if (!scpList) return {} as Record<number, string>
    return scpList.reduce<Record<number, string>>((acc, s) => {
      acc[s.id] = s.name
      return acc
    }, {})
  }, [scpList])

  const uniqueScpRows = useMemo(() => {
    if (!readerList?.length) return [] as { id: number; name: string }[]
    const seen = new Set<number>()
    const out: { id: number; name: string }[] = []
    for (const r of readerList) {
      if (seen.has(r.scp)) continue
      seen.add(r.scp)
      const name = scpNameMap[r.scp] ?? r.scpName ?? `SCP ${r.scp}`
      out.push({ id: r.scp, name })
    }
    return out
  }, [readerList, scpNameMap])

  const readerRows = useMemo(() => {
    if (!readerList?.length) return []
    return readerList.map((r: AccLvRdrInfo) => ({
      id: r.rdr,
      name: r.readerName ?? `리더 ${r.rdr}`,
    }))
  }, [readerList])

  const timezoneRows = useMemo(() => {
    if (!timezoneList) return []
    return timezoneList.map((t) => ({ id: t.id, name: t.name }))
  }, [timezoneList])

  const onEditClick = () => {
    if (!selectedAccLv) return
    updateForm.reset({ name: selectedAccLv.name })
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    updateForm.reset()
  }

  const onUpdateSubmit = (values: AccLvFormValues) => {
    if (!selectedId || !selectedAccLv) return
    const data: UpdateAccLvRequest = {
      name: values.name.trim(),
      description: selectedAccLv.description,
    }
    updateAccLv(
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
    deleteAccLv(selectedId, {
      onSuccess: (ok) => {
        if (!ok) return
        setDeleteModalOpen(false)
        setSelectedId(null)
      },
    })
  }

  const drawerHeader = selectedAccLv ? (
    <div className="flex items-start gap-3 pb-3" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
      <div
        className="w-[38px] h-[38px] rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: '#1a3a5c' }}
      >
        <Shield size={20} style={{ color: 'var(--color-accent)' }} />
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {editMode ? (
          <Input {...updateForm.register('name')} error={updateForm.formState.errors.name?.message} />
        ) : (
          <span className="text-[14px] font-medium leading-tight" style={{ color: 'var(--color-text)' }}>
            {selectedAccLv.name}
          </span>
        )}
        <span
          className="inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-full font-mono"
          style={{
            background: 'var(--color-btn-hover)',
            color: 'var(--color-text-subtle)',
            border: '0.5px solid var(--color-border)',
            width: 'fit-content',
          }}
        >
          #{selectedAccLv.id}
        </span>
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions = selectedAccLv
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

  const drawerBody = !selectedAccLv ? (
    <div className="flex items-center justify-center min-h-[160px]">
      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        목록에서 항목을 선택하세요
      </span>
    </div>
  ) : (
    <div>
      <SectionBlock icon={<Cpu size={12} />} title="주 제어기">
        {readerLoading ? (
          <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
            불러오는 중...
          </span>
        ) : (
          <IdNameTable rows={uniqueScpRows} />
        )}
      </SectionBlock>
      <SectionBlock icon={<ScanLine size={12} />} title="리더">
        {readerLoading ? (
          <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
            불러오는 중...
          </span>
        ) : (
          <IdNameTable rows={readerRows} />
        )}
      </SectionBlock>
      <SectionBlock icon={<Clock size={12} />} title="타임존">
        {timezoneLoading ? (
          <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
            불러오는 중...
          </span>
        ) : (
          <IdNameTable rows={timezoneRows} />
        )}
      </SectionBlock>
    </div>
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex items-center justify-between flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid #2a2d32',
        }}
      >
        <div className="flex items-center gap-1.5">
          <DoorOpen style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
            접근 권한
          </span>
        </div>
        <Button variant="accent" leftIcon={<Plus size={12} />}>
          추가
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ListPanel
          items={filteredList.map((a) => ({ id: a.id, label: a.name }))}
          selectedId={selectedId ?? undefined}
          onItemClick={(item) => {
            if (editMode) setEditMode(false)
            setSelectedId(item.id)
          }}
          onSearch={setSearchQuery}
          searchPlaceholder="권한 검색..."
          totalCount={filteredList.length}
          width={240}
          loading={accLvLoading}
        />
        <Drawer header={drawerHeader} actions={drawerActions ?? undefined} fill>
          {drawerBody}
        </Drawer>
      </div>

      <Modal
        open={deleteModalOpen}
        title="접근 권한 삭제"
        description={`"${selectedAccLv?.name ?? ''}" 권한을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}
