import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Shield } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { PageHeader } from '@/layouts/PageHeader'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { AddButton, CrudDetailActions } from '@/components/page-actions'
import { useGridColumnLayout } from '@/hooks/ui/useGridColumnLayout'
import { AccLvReaderEditModal } from '@/pages/AccessPage/components/AccLvReaderEditModal'
import { AccLvReaderTable } from '@/pages/AccessPage/components/AccLvReaderTable'
import { accLvSchema, type AccLvFormValues } from '@/pages/AccessPage/formTypes'
import { toAccLvReaderRows } from '@/pages/AccessPage/utils/accLvHelpers'
import { mockReadersForAccLv } from '@/pages/AccessPageB/accessBMockData'
import { fallbackAccLvName, fallbackScpName, fallbackTimezoneName } from '@/lib/entityDisplayLabels'
import {
  useAccLvList,
  useAccLvReaderList,
  useDeleteAccLv,
  useUpdateAccLv,
} from '@/hooks/api/useAccLv'
import { useScps } from '@/hooks/api/useDevices'
import { useTimezoneList } from '@/hooks/api/useTimezone'
import type { AccLvInfo, UpdateAccLvRequest } from '@/types/api'

const GRID_COLUMNS: ColumnDef<AccLvInfo>[] = [
  {
    key: 'name',
    header: '권한명',
    width: 200,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {fallbackAccLvName(typeof value === 'string' ? value : '')}
      </span>
    ),
  },
]

/** 접근 권한 2안 — WPF 레이아웃 샘플 (Grid 목록 + 하단 요약/리더 패널) */
export const AccessPageB = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [readerEditOpen, setReaderEditOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { data: accLvList, isLoading } = useAccLvList()
  const { data: readerList, isLoading: readerLoading } = useAccLvReaderList(selectedId ?? 0)
  const { data: scpList } = useScps()
  const { data: timezoneList } = useTimezoneList()
  const { mutate: updateAccLv, isPending: isUpdating } = useUpdateAccLv()
  const { mutate: deleteAccLv, isPending: isDeleting } = useDeleteAccLv()

  const updateForm = useForm<AccLvFormValues>({
    resolver: zodResolver(accLvSchema),
  })

  const filteredList = useMemo(() => {
    const list = accLvList ?? []
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter((a) => a.name.toLowerCase().includes(q))
  }, [accLvList, searchQuery])

  const selectedAccLv = useMemo(
    () => filteredList.find((a) => a.id === selectedId) ?? null,
    [filteredList, selectedId],
  )

  const scpNameMap = useMemo(() => {
    if (!scpList) return {} as Record<number, string>
    return scpList.reduce<Record<number, string>>((acc, s) => {
      acc[s.id] = fallbackScpName(s.name)
      return acc
    }, {})
  }, [scpList])

  const timezoneNameMap = useMemo(() => {
    if (!timezoneList) return {} as Record<number, string>
    return timezoneList.reduce<Record<number, string>>((acc, t) => {
      acc[t.id] = fallbackTimezoneName(t.name)
      return acc
    }, {})
  }, [timezoneList])

  const readerRows = useMemo(() => {
    const fromApi = toAccLvReaderRows(readerList ?? [], scpNameMap, timezoneNameMap)
    if (fromApi.length > 0) return fromApi
    return selectedId != null ? mockReadersForAccLv(selectedId) : []
  }, [readerList, scpNameMap, timezoneNameMap, selectedId])

  const { columns, layoutGridProps } = useGridColumnLayout(GRID_COLUMNS, {
    storageKey: 'axiquant.grid.access-b',
  })

  useEffect(() => {
    setEditMode(false)
    setReaderEditOpen(false)
    setDeleteModalOpen(false)
  }, [selectedId])

  const handleEditClick = () => {
    if (!selectedAccLv) return
    updateForm.reset({ name: selectedAccLv.name })
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    updateForm.reset()
  }

  const onUpdateSubmit = (values: AccLvFormValues) => {
    if (!selectedAccLv || selectedId == null) return
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

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="접근 권한"
        icon={<Lock size={15} />}
        variantPaths={{ a: '/access', b: '/access-b' }}
        actions={<AddButton onClick={() => undefined} />}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div
          className="flex flex-col min-h-0 overflow-hidden"
          style={{
            flex: '0 0 42%',
            borderBottom: '0.5px solid var(--color-border)',
          }}
        >
          <Grid
            columns={columns}
            data={filteredList}
            selectedId={selectedId ?? undefined}
            onRowClick={(row) => setSelectedId(row.id)}
            onSearch={setSearchQuery}
            searchPlaceholder="권한명 검색..."
            totalCount={filteredList.length}
            loading={isLoading}
            {...layoutGridProps}
          />
        </div>

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {selectedAccLv ? (
            <DetailTitleBar
              icon={<Shield size={14} style={{ color: 'var(--color-accent)' }} />}
              title={
                editMode ? (
                  <Input
                    {...updateForm.register('name')}
                    error={updateForm.formState.errors.name?.message}
                    className="max-w-[240px]"
                  />
                ) : (
                  fallbackAccLvName(selectedAccLv.name)
                )
              }
              actions={
                <CrudDetailActions
                  editMode={editMode}
                  isSaving={isUpdating}
                  isDeleting={isDeleting}
                  onEdit={handleEditClick}
                  onDelete={() => setDeleteModalOpen(true)}
                  onSave={handleSave}
                  onCancel={handleCancelEdit}
                />
              }
            />
          ) : null}

          <div className="flex flex-1 min-h-0 overflow-hidden">
          <div
            className="flex flex-col flex-shrink-0 overflow-hidden"
            style={{
              width: 220,
              borderRight: '0.5px solid var(--color-border)',
              background: 'var(--color-sidebar)',
            }}
          >
            <div
              className="flex-shrink-0 px-3 py-2 app-text-md font-medium"
              style={{
                background: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                borderBottom: '0.5px solid var(--color-border)',
              }}
            >
              권한 정보
            </div>
            <div className="flex-1 p-3 overflow-y-auto app-scrollbar">
              {selectedAccLv ? (
                <div className="flex flex-col gap-3">
                  {selectedAccLv.description?.trim() ? (
                    <DetailInfoField label="설명">
                      {selectedAccLv.description.trim()}
                    </DetailInfoField>
                  ) : (
                    <p className="app-text-md" style={{ color: 'var(--color-text-subtle)' }}>
                      추가 정보 없음
                    </p>
                  )}
                </div>
              ) : (
                <p className="app-text-md" style={{ color: 'var(--color-text-subtle)' }}>
                  목록에서 접근 권한을 선택하세요.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <div
              className="flex items-center justify-between flex-shrink-0 px-3 py-2"
              style={{ borderBottom: '0.5px solid var(--color-border)' }}
            >
              <h2 className="text-[14px] font-medium" style={{ color: 'var(--color-text)' }}>
                연결된 리더
              </h2>
              {editMode && selectedAccLv ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setReaderEditOpen(true)}
                  disabled={readerLoading}
                >
                  변경
                </Button>
              ) : null}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto app-scrollbar p-3">
              {selectedAccLv ? (
                <AccLvReaderTable rows={readerRows} loading={readerLoading} />
              ) : (
                <p
                  className="text-[14px] text-center py-8"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  연결된 리더를 보려면 권한을 선택하세요.
                </p>
              )}
            </div>
          </div>
          </div>
        </div>
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

      {selectedAccLv ? (
        <AccLvReaderEditModal
          open={readerEditOpen}
          alvId={selectedAccLv.id}
          readers={readerList ?? []}
          scpNameMap={scpNameMap}
          onCancel={() => setReaderEditOpen(false)}
          onSaved={() => setReaderEditOpen(false)}
        />
      ) : null}
    </div>
  )
}
