import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Pencil, Shield, Trash2, X } from 'lucide-react'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { AccLvReaderEditModal } from '@/pages/AccessPage/components/AccLvReaderEditModal'
import { AccLvReaderTable } from '@/pages/AccessPage/components/AccLvReaderTable'
import { accLvSchema, type AccLvFormValues } from '@/pages/AccessPage/formTypes'
import { toAccLvReaderRows } from '@/pages/AccessPage/utils/accLvHelpers'
import {
  fallbackAccLvName,
  fallbackScpName,
  fallbackTimezoneName,
} from '@/lib/entityDisplayLabels'
import {
  useAccLvReaderList,
  useDeleteAccLv,
  useUpdateAccLv,
} from '@/hooks/api/useAccLv'
import { useScps } from '@/hooks/api/useDevices'
import { useTimezoneList } from '@/hooks/api/useTimezone'
import type { AccLvInfo, UpdateAccLvRequest } from '@/types/api'

interface AccessDetailPanelProps {
  accLv: AccLvInfo | null
  onDeleted: () => void
  onEditModeChange?: (editing: boolean) => void
}

export const AccessDetailPanel = ({
  accLv,
  onDeleted,
  onEditModeChange,
}: AccessDetailPanelProps) => {
  const selectedId = accLv?.id ?? 0
  const [editMode, setEditMode] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [readerEditOpen, setReaderEditOpen] = useState(false)

  const { data: readerList, isLoading: readerLoading } = useAccLvReaderList(selectedId)
  const { data: scpList } = useScps()
  const { data: timezoneList } = useTimezoneList()

  const { mutate: updateAccLv, isPending: isUpdating } = useUpdateAccLv()
  const { mutate: deleteAccLv, isPending: isDeleting } = useDeleteAccLv()

  const updateForm = useForm<AccLvFormValues>({
    resolver: zodResolver(accLvSchema),
  })

  useEffect(() => {
    setEditMode(false)
    setReaderEditOpen(false)
    onEditModeChange?.(false)
  }, [accLv?.id, onEditModeChange])

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

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

  const readerRows = useMemo(
    () => toAccLvReaderRows(readerList ?? [], scpNameMap, timezoneNameMap),
    [readerList, scpNameMap, timezoneNameMap],
  )

  const onEditClick = () => {
    if (!accLv) return
    updateForm.reset({ name: accLv.name })
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
    updateForm.reset()
  }

  const onUpdateSubmit = (values: AccLvFormValues) => {
    if (!selectedId || !accLv) return
    const data: UpdateAccLvRequest = {
      name: values.name.trim(),
      description: accLv.description,
    }
    updateAccLv(
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
    if (selectedId <= 0) return
    deleteAccLv(selectedId, {
      onSuccess: (ok) => {
        if (!ok) return
        setDeleteModalOpen(false)
        onDeleted()
      },
    })
  }

  const drawerHeader = accLv ? (
    <div
      className="flex items-start gap-3 pb-3"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <div
        className="w-[38px] h-[38px] rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: '#1a3a5c' }}
      >
        <Shield size={20} style={{ color: 'var(--color-accent)' }} />
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {editMode ? (
          <Input
            {...updateForm.register('name')}
            error={updateForm.formState.errors.name?.message}
          />
        ) : (
          <span
            className="app-text-lg font-medium leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {fallbackAccLvName(accLv.name)}
          </span>
        )}
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions = accLv ? (
    editMode ? (
      <>
        <Button
          variant="default"
          size="sm"
          leftIcon={<X size={12} />}
          onClick={handleCancelEdit}
        >
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
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Pencil size={12} />}
          onClick={onEditClick}
        >
          수정
        </Button>
      </>
    )
  ) : null

  const drawerBody = !accLv ? (
    <div className="flex items-center justify-center min-h-[160px]">
      <span className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
        목록에서 접근 권한을 선택하세요
      </span>
    </div>
  ) : (
    <section>
      {accLv.description?.trim() ? (
        <DetailInfoField label="설명" className="mb-4">
          {accLv.description.trim()}
        </DetailInfoField>
      ) : null}

      <div className="flex items-center justify-between mb-2">
        <h2 className="app-text-md font-medium" style={{ color: 'var(--color-text)' }}>
          연결된 리더
        </h2>
        {editMode ? (
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

      <div
        className="rounded overflow-hidden"
        style={{ border: '0.5px solid var(--color-border)' }}
      >
        <AccLvReaderTable rows={readerRows} loading={readerLoading} />
      </div>

      <p className="text-[13px] mt-2" style={{ color: 'var(--color-text-dim)' }}>
        전체 {readerRows.length}건
      </p>
    </section>
  )

  return (
    <>
      <Drawer
        fill
        borderLeft={false}
        header={drawerHeader}
        actions={drawerActions ?? undefined}
      >
        {drawerBody}
      </Drawer>

      <Modal
        open={deleteModalOpen}
        title="접근 권한 삭제"
        description={`"${accLv?.name ?? ''}" 권한을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {accLv ? (
        <AccLvReaderEditModal
          open={readerEditOpen}
          alvId={accLv.id}
          readers={readerList ?? []}
          scpNameMap={scpNameMap}
          onCancel={() => setReaderEditOpen(false)}
          onSaved={() => setReaderEditOpen(false)}
        />
      ) : null}
    </>
  )
}
