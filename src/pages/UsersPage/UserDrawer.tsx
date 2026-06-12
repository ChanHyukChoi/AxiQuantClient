import { User, UserCog } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { CrudDetailActions } from '@/components/page-actions'
import { Modal } from '@/components/primitive/Modal'
import {
  USER_EDITOR_TABS,
  UserEditorContent,
} from '@/pages/UsersPage/components/UserEditorContent'
import type { useUserEditor } from '@/pages/UsersPage/useUserEditor'
import type { UserInfo } from '@/types/api/user'

type UserEditor = ReturnType<typeof useUserEditor>

interface UserDrawerProps {
  user: UserInfo | null
  editor: UserEditor
}

export const UserDrawer = ({ user, editor }: UserDrawerProps) => {
  const { isCreating, editMode, activeTab, values } = editor
  const showUser = user || isCreating

  const headerTitle = isCreating
    ? '사용자 추가'
    : user
      ? user.name?.trim() || '(이름 없음)'
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
                사용자를 선택하세요
              </p>
            </div>
          )
        }
        tabs={showUser ? USER_EDITOR_TABS : undefined}
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
        title="사용자 삭제"
        description={user ? `"${user.name}" 사용자를 삭제하시겠습니까?` : ''}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        loading={editor.isDeleting}
        onConfirm={() => void editor.handleDeleteConfirm()}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </>
  )
}
