import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Check, CreditCard, Fingerprint, Pencil, Trash2, User, X } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/pages/EmpsPage/components/EmpFieldUi'
import { updateEmpEmailSchema } from '@/pages/EmpsPage/formTypes'
import { EmpBioTab } from '@/pages/EmpsPage/tabs/EmpBioTab'
import { EmpCardTab } from '@/pages/EmpsPage/tabs/EmpCardTab'
import { EmpInfoTab } from '@/pages/EmpsPage/tabs/EmpInfoTab'
import { empToUpdatePayload } from '@/pages/EmpsPage/utils/empHelpers'
import { useDeleteEmp, useUpdateEmp } from '@/hooks/useEmps'
import type { CardInfo, EmpInfo, UpdateEmpRequest } from '@/types/api'

interface EmpDrawerProps {
  emp: EmpInfo | null
  selectedCards: CardInfo[]
  onDeleted: () => void
  onEditModeChange?: (editing: boolean) => void
}

export const EmpDrawer = ({
  emp,
  selectedCards,
  onDeleted,
  onEditModeChange,
}: EmpDrawerProps) => {
  const selectedId = emp?.id ?? null
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editSaveError, setEditSaveError] = useState<string | null>(null)

  const updateEmpMut = useUpdateEmp()
  const deleteEmpMut = useDeleteEmp()

  const { register, handleSubmit, reset, setError, clearErrors, formState: { errors } } =
    useForm<UpdateEmpRequest>()

  useEffect(() => {
    setActiveTab('info')
    setEditMode(false)
    setEditSaveError(null)
  }, [selectedId])

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

  const handleEdit = () => {
    if (!emp) return
    setEditSaveError(null)
    reset(empToUpdatePayload(emp))
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    setEditSaveError(null)
    reset()
  }

  const handleSave = handleSubmit(async (formData) => {
    if (!selectedId || !emp) return
    setEditSaveError(null)
    const merged: UpdateEmpRequest = { ...empToUpdatePayload(emp), ...formData }
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
      setEditing(false)
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
      setDeleteModalOpen(false)
      setDeleteError(null)
      onDeleted()
    } else {
      setDeleteError(
        result.message ||
          '삭제하지 못했습니다. 카드·권한 등 다른 데이터가 참조 중이거나 서버가 거부했을 수 있습니다. F12 네트워크 응답을 확인하세요.',
      )
    }
  }

  const drawerTabs = emp
    ? [
        { key: 'info', label: '인적사항', icon: <User size={12} /> },
        { key: 'card', label: '카드', icon: <CreditCard size={12} /> },
        { key: 'bio', label: '바이오', icon: <Fingerprint size={12} /> },
      ]
    : undefined

  const drawerHeader = emp ? (
    <div
      className="flex items-start gap-3 pb-3"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <Avatar name={emp.name} size={46} />
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[15px] font-medium leading-tight" style={{ color: 'var(--color-text)' }}>
          {emp.name}
        </span>
        <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
          {emp.dept !== 0 ? String(emp.dept) : '—'} · {'—'}
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
          #{emp.id}
        </span>
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions = emp ? (
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

  const drawerChildren = !emp ? (
    <div className="flex items-center justify-center h-full">
      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        목록에서 항목을 선택하세요
      </span>
    </div>
  ) : (
    <>
      {activeTab === 'info' && <EmpInfoTab emp={emp} editMode={editMode} register={register} errors={errors} />}
      {activeTab === 'card' && <EmpCardTab cards={selectedCards} />}
      {activeTab === 'bio' && <EmpBioTab />}
    </>
  )

  return (
    <>
      <Drawer
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
        title="사용자 삭제"
        description={
          deleteError
            ? `"${emp?.name}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.\n\n${deleteError}`
            : `"${emp?.name}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
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
    </>
  )
}
