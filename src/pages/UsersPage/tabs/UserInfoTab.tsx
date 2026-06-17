import { useTranslation } from 'react-i18next'
import { Globe, Hash, Key, Lock, Tag, ToggleLeft, ToggleRight } from 'lucide-react'
import type { UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/primitive/Input'
import type { UserEditFormValues } from '@/pages/UsersPage/formTypes'

interface UserInfoTabProps {
  editMode: boolean
  register: UseFormRegister<UserEditFormValues>
  values: UserEditFormValues
  onToggleActive: () => void
  onToggleExternalApi: () => void
}

const FRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) => (
  <div className="flex justify-between items-center py-1.5 gap-2">
    <span
      className="text-[14px] flex items-center gap-1.5 flex-shrink-0"
      style={{ color: 'var(--color-text-subtle)' }}
    >
      {icon}
      {label}
    </span>
    {children}
  </div>
)

const ToggleBtn = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex items-center">
    {on ? (
      <ToggleRight size={22} style={{ color: 'var(--color-accent)' }} />
    ) : (
      <ToggleLeft size={22} style={{ color: 'var(--color-text-dim)' }} />
    )}
  </button>
)

export const UserInfoTab = ({
  editMode,
  register,
  values,
  onToggleActive,
  onToggleExternalApi,
}: UserInfoTabProps) => {
  const { t } = useTranslation(['user', 'common'])

  return (
    <div className="flex flex-col gap-1">
      <FRow icon={<Tag size={12} />} label={t('user:field.name')}>
        {editMode ? (
          <Input {...register('name')} className="max-w-[180px]" />
        ) : (
          <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
            {values.name || t('common:empty')}
          </span>
        )}
      </FRow>

      <FRow icon={<Hash size={12} />} label={t('user:field.loginId')}>
        {editMode ? (
          <Input {...register('loginId')} className="max-w-[180px] font-mono" />
        ) : (
          <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
            {values.loginId || t('common:empty')}
          </span>
        )}
      </FRow>

      <FRow icon={<Lock size={12} />} label={t('user:field.active')}>
        {editMode ? (
          <ToggleBtn on={values.active} onClick={onToggleActive} />
        ) : (
          <span
            className="text-[14px]"
            style={{ color: values.active ? '#4caf7d' : 'var(--color-text-dim)' }}
          >
            {values.active ? t('common:active') : t('common:inactive')}
          </span>
        )}
      </FRow>

      <FRow icon={<Globe size={12} />} label={t('user:field.externalApi')}>
        {editMode ? (
          <ToggleBtn on={values.useExternalApi} onClick={onToggleExternalApi} />
        ) : (
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            {values.useExternalApi ? t('user:status.enabled') : t('user:status.disabled')}
          </span>
        )}
      </FRow>

      {editMode && (
        <>
          <FRow icon={<Key size={12} />} label={t('user:field.password')}>
            <Input
              type="password"
              {...register('password')}
              className="max-w-[180px]"
              autoComplete="new-password"
            />
          </FRow>
          <FRow icon={<Key size={12} />} label={t('user:field.confirmPassword')}>
            <Input
              type="password"
              {...register('confirmPassword')}
              className="max-w-[180px]"
              autoComplete="new-password"
            />
          </FRow>
        </>
      )}
    </div>
  )
}
