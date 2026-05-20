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
      className="text-[12px] flex items-center gap-1.5 flex-shrink-0"
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
}: UserInfoTabProps) => (
  <div className="flex flex-col gap-1">
    <FRow icon={<Tag size={12} />} label="명칭">
      {editMode ? (
        <Input {...register('name')} className="max-w-[180px]" />
      ) : (
        <span className="text-[13px]" style={{ color: 'var(--color-text)' }}>
          {values.name || '—'}
        </span>
      )}
    </FRow>

    <FRow icon={<Hash size={12} />} label="로그인 ID">
      {editMode ? (
        <Input {...register('loginId')} className="max-w-[180px] font-mono" />
      ) : (
        <span className="text-[13px] font-mono" style={{ color: 'var(--color-text)' }}>
          {values.loginId || '—'}
        </span>
      )}
    </FRow>

    <FRow icon={<Lock size={12} />} label="활성">
      {editMode ? (
        <ToggleBtn on={values.active} onClick={onToggleActive} />
      ) : (
        <span
          className="text-[12px]"
          style={{ color: values.active ? '#4caf7d' : 'var(--color-text-dim)' }}
        >
          {values.active ? '활성' : '비활성'}
        </span>
      )}
    </FRow>

    <FRow icon={<Globe size={12} />} label="외부 API">
      {editMode ? (
        <ToggleBtn on={values.useExternalApi} onClick={onToggleExternalApi} />
      ) : (
        <span className="text-[12px]" style={{ color: 'var(--color-text)' }}>
          {values.useExternalApi ? '사용' : '미사용'}
        </span>
      )}
    </FRow>

    {editMode && (
      <>
        <FRow icon={<Key size={12} />} label="비밀번호">
          <Input
            type="password"
            {...register('password')}
            className="max-w-[180px]"
            autoComplete="new-password"
          />
        </FRow>
        <FRow icon={<Key size={12} />} label="비밀번호 확인">
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
