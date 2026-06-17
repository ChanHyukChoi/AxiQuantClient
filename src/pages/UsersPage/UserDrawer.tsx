import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { User, UserCog } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { CrudDetailActions } from '@/components/page-actions'
import { Modal } from '@/components/primitive/Modal'
import { UserEditorContent } from '@/pages/UsersPage/components/UserEditorContent'
import type { useUserEditor } from '@/pages/UsersPage/useUserEditor'
import type { UserInfo } from '@/types/api/user'

type UserEditor = ReturnType<typeof useUserEditor>

interface UserDrawerProps {
  user: UserInfo | null
  editor: UserEditor
}

export const UserDrawer = ({ user, editor }: UserDrawerProps) => {
  const { t } = useTranslation(['user', 'common'])
  const { isCreating, editMode, activeTab, values } = editor
  const showUser = user || isCreating

  const editorTabs = useMemo(
    () => [
      { key: 'info', label: t('user:tab.info') },
      { key: 'permissions', label: t('user:tab.permissions') },
    ],
    [t],
  )

  const headerTitle = isCreating
    ? t('user:addUser')
    : user
      ? user.name?.trim() || t('user:noName')
      : null

  return (
    <>
      <Drawer
        fill
        borderLeft={false}
        header={
          headerTitle ? (
            <DetailTitleBar
              icon={<UserCog size={14} style={{ color: 'var(--color-accent)' }} />}
              title={
                <span>
                  {headerTitle}
                  {!isCreating && user ? (
                    <span
                      className="block text-[13px] font-mono font-normal mt-0.5"
                      style={{ color: 'var(--color-text-subtle)' }}
                    >
                      {user.loginId}
                    </span>
                  ) : null}
                </span>
              }
              actions={
                showUser ? (
                  <CrudDetailActions
                    editMode={editMode || isCreating}
                    isSaving={editor.isSaving}
                    isDeleting={editor.isDeleting}
                    disabled={!user && !isCreating}
                    onEdit={editor.handleEdit}
                    onDelete={() => editor.setDeleteOpen(true)}
                    onSave={() => void editor.handleSave()}
                    onCancel={editor.handleCancel}
                  />
                ) : undefined
              }
            />
          ) : (
            <div className="flex items-center gap-2 py-4">
              <User size={20} style={{ color: 'var(--color-text-dim)' }} />
              <p className="text-[14px]" style={{ color: 'var(--color-text-dim)' }}>
                {t('user:selectUser')}
              </p>
            </div>
          )
        }
        tabs={showUser ? editorTabs : undefined}
        activeTab={activeTab}
        onTabChange={editor.setActiveTab}
        footer={
          editor.saveError ? (
            <p className="text-[13px] px-1" style={{ color: '#e06060' }}>
              {editor.saveError}
            </p>
          ) : undefined
        }
      >
        {showUser ? (
          <UserEditorContent
            activeTab={activeTab}
            editMode={editMode}
            isCreating={isCreating}
            register={editor.register}
            control={editor.control}
            values={values}
            onToggleActive={() => editor.setValue('active', !values.active)}
            onToggleExternalApi={() =>
              editor.setValue('useExternalApi', !values.useExternalApi)
            }
            onPermissionsChange={(perms) => editor.setValue('permissions', perms)}
            layout="drawer"
          />
        ) : null}
      </Drawer>

      <Modal
        open={editor.deleteOpen}
        title={t('user:modal.deleteTitle')}
        description={user ? t('user:modal.deleteDescription', { name: user.name }) : ''}
        confirmLabel={t('common:delete')}
        cancelLabel={t('common:cancel')}
        variant="danger"
        loading={editor.isDeleting}
        onConfirm={() => void editor.handleDeleteConfirm()}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </>
  )
}
