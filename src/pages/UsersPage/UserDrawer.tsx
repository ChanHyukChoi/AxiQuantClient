import { Check, Pencil, Trash2, User, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
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

  const showActions = showUser && (editMode || isCreating)

  return (
    <>
      <Drawer
        fill
        header={
          headerTitle ? (
            <div>
              <p className="text-[14px] font-medium" style={{ color: 'var(--color-text)' }}>
                {headerTitle}
              </p>
              {!isCreating && user ? (
                <p
                  className="text-[13px] font-mono mt-0.5"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  {user.loginId}
                </p>
              ) : null}
            </div>
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
        actions={
          user && !isCreating && !editMode ? (
            <>
              <Button
                size="sm"
                variant="default"
                leftIcon={<Pencil size={13} />}
                onClick={editor.handleEdit}
              >
                수정
              </Button>
              <Button
                size="sm"
                variant="danger"
                leftIcon={<Trash2 size={13} />}
                onClick={() => editor.setDeleteOpen(true)}
              >
                삭제
              </Button>
            </>
          ) : showActions ? (
            <>
              <Button
                size="sm"
                variant="accent"
                leftIcon={<Check size={13} />}
                loading={editor.isSaving}
                onClick={() => void editor.handleSave()}
              >
                저장
              </Button>
              <Button
                size="sm"
                variant="default"
                leftIcon={<X size={13} />}
                onClick={editor.handleCancel}
              >
                취소
              </Button>
            </>
          ) : undefined
        }
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
