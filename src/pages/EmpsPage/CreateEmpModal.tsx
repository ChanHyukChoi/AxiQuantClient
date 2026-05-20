import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { createEmpSchema, type CreateEmpFormValues } from '@/pages/EmpsPage/formTypes'
import { useCreateEmp } from '@/hooks/useEmps'
import type { CreateEmpRequest } from '@/types/api'

interface CreateEmpModalProps {
  open: boolean
  onClose: () => void
}

export const CreateEmpModal = ({ open, onClose }: CreateEmpModalProps) => {
  const { mutateAsync: createEmpAsync, isPending: isCreating } = useCreateEmp()

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
    handleCancel()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="rounded-md p-5 w-[320px]"
        style={{ background: 'var(--color-sidebar)', border: '0.5px solid #2a2d32' }}
      >
        <p
          className="text-[13px] font-medium mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          사용자 추가
        </p>
        <form
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="flex flex-col max-h-[min(520px,85vh)] overflow-y-auto pr-0.5"
        >
          <div className="mb-3">
            <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
              이름
            </label>
            <Input
              {...createForm.register('name')}
              error={createForm.formState.errors.name?.message}
            />
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
            <Input
              type="number"
              {...createForm.register('dept', { valueAsNumber: true })}
            />
          </div>
          <div className="mb-3">
            <label className="text-[11px] mb-1 block" style={{ color: '#555a63' }}>
              직급(lv)
            </label>
            <Input
              type="number"
              {...createForm.register('lv', { valueAsNumber: true })}
            />
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
            <Input
              {...createForm.register('email')}
              error={createForm.formState.errors.email?.message}
            />
          </div>
          {createForm.formState.errors.root?.message ? (
            <p className="text-[11px] mb-2 leading-snug" style={{ color: '#c75c5c' }}>
              {createForm.formState.errors.root.message}
            </p>
          ) : null}
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
