import { useTranslation } from 'react-i18next'
import type { Control, UseFormRegister } from 'react-hook-form'
import type { UserEditFormValues } from '@/pages/UsersPage/formTypes'
import { UserInfoTab } from '@/pages/UsersPage/tabs/UserInfoTab'
import { UserPermissionsTab } from '@/pages/UsersPage/tabs/UserPermissionsTab'
import type { UserPermissions } from '@/types/api/user'

interface UserEditorContentProps {
  activeTab: string
  editMode: boolean
  isCreating: boolean
  register: UseFormRegister<UserEditFormValues>
  control: Control<UserEditFormValues>
  values: UserEditFormValues
  onToggleActive: () => void
  onToggleExternalApi: () => void
  onPermissionsChange: (perms: UserPermissions) => void
  layout?: 'drawer' | 'split'
}

export const UserEditorContent = ({
  activeTab,
  editMode,
  isCreating,
  register,
  control,
  values,
  onToggleActive,
  onToggleExternalApi,
  onPermissionsChange,
  layout = 'drawer',
}: UserEditorContentProps) => {
  const { t } = useTranslation('user')
  const canEdit = editMode || isCreating

  if (layout === 'split') {
    return (
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div
          className="flex flex-col flex-shrink-0 overflow-hidden"
          style={{
            width: 280,
            borderRight: '0.5px solid var(--color-border)',
            background: 'var(--color-sidebar)',
          }}
        >
          <div
            className="flex-shrink-0 px-3 py-2 text-[14px] font-medium"
            style={{
              background: 'var(--color-accent-subtle)',
              color: 'var(--color-accent)',
              borderBottom: '0.5px solid var(--color-border)',
            }}
          >
            {t('tab.info')}
          </div>
          <div className="flex-1 p-3 overflow-y-auto app-scrollbar">
            <UserInfoTab
              editMode={canEdit}
              register={register}
              values={values}
              onToggleActive={onToggleActive}
              onToggleExternalApi={onToggleExternalApi}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div
            className="flex-shrink-0 px-3 py-2 text-[14px] font-medium"
            style={{
              background: 'var(--color-sidebar)',
              borderBottom: '0.5px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            {t('tab.permissions')}
          </div>
          <div className="flex-1 p-3 overflow-y-auto app-scrollbar">
            <UserPermissionsTab
              editMode={canEdit}
              control={control}
              permissions={values.permissions}
              onPermissionsChange={onPermissionsChange}
            />
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'info') {
    return (
      <UserInfoTab
        editMode={canEdit}
        register={register}
        values={values}
        onToggleActive={onToggleActive}
        onToggleExternalApi={onToggleExternalApi}
      />
    )
  }

  return (
    <UserPermissionsTab
      editMode={canEdit}
      control={control}
      permissions={values.permissions}
      onPermissionsChange={onPermissionsChange}
    />
  )
}
