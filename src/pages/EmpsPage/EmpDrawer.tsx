import { useEffect, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Check, CreditCard, Fingerprint, Pencil, Trash2, User, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Modal } from '@/components/primitive/Modal'
import { queryKeys } from '@/lib/query/queryKeys'
import { EmpSummaryHeader } from '@/pages/EmpsPage/components/EmpSummaryHeader'
import { EmpUpsertForm } from '@/pages/EmpsPage/components/EmpUpsertForm'
import { updateEmpSchema, type UpdateEmpFormValues } from '@/pages/EmpsPage/formTypes'
import { EmpBioTab } from '@/pages/EmpsPage/tabs/EmpBioTab'
import { EmpCardTab } from '@/pages/EmpsPage/tabs/EmpCardTab'
import { EmpInfoTab } from '@/pages/EmpsPage/tabs/EmpInfoTab'
import {
  empToFormValues,
  findCreatedEmpId,
  toCreateRequest,
  toUpdateRequest,
} from '@/pages/EmpsPage/utils/empHelpers'
import { useCreateEmp, useDeleteEmp, useUpdateEmp } from '@/hooks/api/useEmps'
import type { CardInfo, EmpInfo } from '@/types/api'

const FORM_DEFAULTS: UpdateEmpFormValues = {
  name: '',
  name2: '',
  lastName: '',
  empNo: '',
  birth: '',
  dept: 0,
  lv: 0,
  tel: '',
  email: '',
}

interface EmpDrawerProps {
  emp: EmpInfo | null
  createMode: boolean
  selectedCards: CardInfo[]
  onCreateCancel: () => void
  onCreated: (id: number | null) => void | Promise<void>
  onDeleted: () => void
  onEditModeChange?: (editing: boolean) => void
}

const FONT_SIZE = 15

export const EmpDrawer = ({
  emp,
  createMode,
  selectedCards,
  onCreateCancel,
  onCreated,
  onDeleted,
  onEditModeChange,
}: EmpDrawerProps) => {
  const selectedId = emp?.id ?? null
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const formActive = createMode || editMode
  const qc = useQueryClient()

  const { mutateAsync: createEmpAsync } = useCreateEmp()
  const { mutateAsync: updateEmpAsync } = useUpdateEmp()
  const deleteEmpMut = useDeleteEmp()

  const form = useForm<UpdateEmpFormValues>({
    resolver: zodResolver(updateEmpSchema) as Resolver<UpdateEmpFormValues>,
    defaultValues: FORM_DEFAULTS,
  })

  const watchedName = useWatch({ control: form.control, name: 'name' })
  const watchedDept = useWatch({ control: form.control, name: 'dept' })
  const watchedLv = useWatch({ control: form.control, name: 'lv' })

  const resetFormState = () => {
    form.reset(FORM_DEFAULTS)
    setSaveError(null)
  }

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

  useEffect(() => {
    if (!createMode) return
    setActiveTab('info')
    setEditMode(false)
    resetFormState()
  }, [createMode])

  useEffect(() => {
    if (createMode) return
    setEditMode(false)
  }, [selectedId, createMode])

  const onEditClick = () => {
    if (!emp) return
    setSaveError(null)
    form.reset(empToFormValues(emp))
    setEditing(true)
  }

  const handleCancelForm = () => {
    if (createMode) {
      onCreateCancel()
    } else {
      setEditing(false)
    }
    resetFormState()
  }

  const onFormSubmit = async (values: UpdateEmpFormValues) => {
    setIsSaving(true)
    setSaveError(null)
    try {
      if (createMode) {
        const beforeIds = new Set(
          (qc.getQueryData<EmpInfo[]>(queryKeys.emps.all) ?? []).map((e) => e.id),
        )
        const payload = toCreateRequest(values)
        const result = await createEmpAsync(payload)
        if (!result.ok) {
          setSaveError(
            result.message ||
              '서버에 저장하지 못했습니다. F12 네트워크에서 응답 상태(4xx/5xx)와 본문을 확인하세요.',
          )
          return
        }

        resetFormState()
        await qc.refetchQueries({ queryKey: queryKeys.emps.all })
        const fresh = qc.getQueryData<EmpInfo[]>(queryKeys.emps.all) ?? []
        const newId = findCreatedEmpId(fresh, values, beforeIds)
        await onCreated(newId)
        return
      }

      if (!selectedId || !emp) return
      const data = toUpdateRequest(values, emp)
      const result = await updateEmpAsync({ id: selectedId, data })
      if (!result.ok) {
        setSaveError(result.message)
        return
      }
      setEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = form.handleSubmit(onFormSubmit)

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

  const headerMode = createMode
    ? 'create'
    : editMode
      ? 'edit'
      : emp
        ? 'view'
        : 'empty'

  const drawerTabs =
    emp && !formActive
      ? [
          { key: 'info', label: '인적사항', icon: <User size={12} /> },
          { key: 'card', label: '카드', icon: <CreditCard size={12} /> },
          { key: 'bio', label: '바이오', icon: <Fingerprint size={12} /> },
        ]
      : undefined

  const drawerHeader = (
    <EmpSummaryHeader
      mode={headerMode}
      name={formActive ? watchedName : emp?.name}
      dept={formActive ? watchedDept : emp?.dept}
      lv={formActive ? watchedLv : emp?.lv}
      empId={emp?.id}
    />
  )

  const drawerActions = formActive ? (
    <div className="flex flex-col items-stretch gap-2 w-full max-w-[260px] ml-auto">
      {saveError ? (
        <p className="text-[11px] leading-snug text-right" style={{ color: '#c75c5c' }}>
          {saveError}
        </p>
      ) : null}
      <div className="flex justify-end gap-1.5">
        <Button
          variant="default"
          size="sm"
          leftIcon={<X size={15} />}
          onClick={handleCancelForm}
        >
          취소
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Check size={15} />}
          loading={isSaving}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  ) : emp ? (
    <>
      <Button
        variant="danger"
        size="sm"
        leftIcon={<Trash2 size={15} />}
        onClick={() => {
          setDeleteError(null)
          setDeleteModalOpen(true)
        }}
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
  ) : null

  const drawerChildren = formActive ? (
    <EmpUpsertForm
      mode={createMode ? 'create' : 'edit'}
      register={form.register}
      control={form.control}
      errors={form.formState.errors}
    />
  ) : !emp ? (
    <div className="flex-1 min-h-[120px]" aria-hidden />
  ) : (
    <>
      {activeTab === 'info' && <EmpInfoTab emp={emp} fontSize={FONT_SIZE} />}
      {activeTab === 'card' && <EmpCardTab cards={selectedCards} />}
      {activeTab === 'bio' && <EmpBioTab />}
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
