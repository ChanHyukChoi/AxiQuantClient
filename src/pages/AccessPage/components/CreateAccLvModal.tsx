import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { createAccLvSchema, type AccLvFormValues } from '@/pages/AccessPage/formTypes'
import { useCreateAccLv } from '@/hooks/api/useAccLv'

interface CreateAccLvModalProps {
  open: boolean
  onCancel: () => void
  onCreated: (name: string) => void
}

export const CreateAccLvModal = ({ open, onCancel, onCreated }: CreateAccLvModalProps) => {
  const { t } = useTranslation(['access', 'common'])
  const accLvSchema = useMemo(() => createAccLvSchema(t), [t])
  const { mutate: createAccLv, isPending } = useCreateAccLv()

  const { register, handleSubmit, reset, formState } = useForm<AccLvFormValues>({
    resolver: zodResolver(accLvSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (open) reset({ name: '' })
  }, [open, reset])

  if (!open) return null

  const onSubmit = (values: AccLvFormValues) => {
    const name = values.name.trim()
    createAccLv(
      { name },
      {
        onSuccess: (ok) => {
          if (!ok) return
          onCreated(name)
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="rounded-md p-5 min-w-[320px] max-w-[400px] w-full"
        style={{
          background: 'var(--color-sidebar)',
          border: '0.5px solid var(--color-border)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-acclv-title"
      >
        <div className="flex items-center justify-between mb-4">
          <p
            id="create-acclv-title"
            className="text-[15px] font-medium"
            style={{ color: 'var(--color-text)' }}
          >
            {t('access:modal.createTitle')}
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded"
            style={{ color: 'var(--color-text-subtle)' }}
            aria-label={t('common:close')}
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            {...register('name')}
            placeholder={t('access:field.name')}
            error={formState.errors.name?.message}
            autoFocus
          />

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="default" size="md" onClick={onCancel} disabled={isPending}>
              {t('common:cancel')}
            </Button>
            <Button type="submit" variant="accent" size="md" loading={isPending}>
              {t('common:add')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
