import { useEffect } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { selectLikeStyle } from '@/pages/CardsPage/components/CardFieldUi'
import { createCardSchema, type CreateCardFormValues } from '@/pages/CardsPage/formTypes'
import { useCreateCard } from '@/hooks/useCard'
import type { CreateCardRequest, EmpInfo } from '@/types/api'

interface CreateCardModalProps {
  open: boolean
  empList: EmpInfo[] | undefined
  onClose: () => void
}

export const CreateCardModal = ({ open, empList, onClose }: CreateCardModalProps) => {
  const { mutate: createCard, isPending: isCreating } = useCreateCard()

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

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        resetCreateForm()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, resetCreateForm])

  const handleCancel = () => {
    onClose()
    resetCreateForm()
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
        handleCancel()
      },
    })
  }

  if (!open) return null

  return (
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
            <Button type="button" variant="default" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit" variant="accent" loading={isCreating}>
              저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
