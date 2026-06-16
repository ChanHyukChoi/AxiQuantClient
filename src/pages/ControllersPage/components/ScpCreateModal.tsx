import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { scpFormSchema, type ScpFormValues } from '@/pages/ControllersPage/scpFormTypes'
import { useCreateScp } from '@/hooks/api/useDeviceControl'
import type { CreateScpRequest } from '@/types/api'

const DEFAULT_VALUES: ScpFormValues = {
  name: '',
  active: 1,
  connstr: '',
  model: 0,
  ctype: 0,
  ext: '',
}

// TODO: 카드 페이지처럼 추가는 모달이 아니라 드로어 create 모드로 전환할 것
interface ScpCreateModalProps {
  open: boolean
  onCancel: () => void
  onCreated: (data: CreateScpRequest) => void
}

export const ScpCreateModal = ({
  open,
  onCancel,
  onCreated,
}: ScpCreateModalProps) => {
  const { mutate: createScp, isPending } = useCreateScp()
  const { register, handleSubmit, reset, formState } = useForm<ScpFormValues>({
    resolver: zodResolver(scpFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) reset(DEFAULT_VALUES)
  }, [open, reset])

  if (!open) return null

  const onSubmit = (values: ScpFormValues) => {
    const payload: CreateScpRequest = {
      name: values.name.trim(),
      active: Number(values.active) || 0,
      connstr: values.connstr ?? '',
      model: Number(values.model) || 0,
      ctype: Number(values.ctype) || 0,
      ext: values.ext ?? '',
    }

    createScp(payload, {
      onSuccess: (ok) => {
        if (ok) onCreated(payload)
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="rounded-md p-5 min-w-[360px] max-w-[440px] w-full"
        style={{
          background: 'var(--color-sidebar)',
          border: '0.5px solid var(--color-border)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-scp-title"
      >
        <div className="flex items-center justify-between mb-4">
          <p
            id="create-scp-title"
            className="text-[15px] font-medium"
            style={{ color: 'var(--color-text)' }}
          >
            주제어기 추가
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded"
            style={{ color: 'var(--color-text-subtle)' }}
            aria-label="닫기"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            {...register('name')}
            placeholder="명칭"
            error={formState.errors.name?.message}
            autoFocus
          />
          <Input {...register('connstr')} placeholder="연결문자열 (IP:포트)" />
          <div className="grid grid-cols-2 gap-2">
            <Input
              {...register('model', { valueAsNumber: true })}
              type="number"
              placeholder="모델"
            />
            <Input
              {...register('ctype', { valueAsNumber: true })}
              type="number"
              placeholder="통신유형"
            />
          </div>

          <div className="flex justify-end gap-1.5 pt-1">
            <Button type="button" variant="default" size="sm" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={isPending}>
              추가
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
