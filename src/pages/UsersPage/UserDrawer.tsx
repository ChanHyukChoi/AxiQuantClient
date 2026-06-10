import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Info, Pencil, Shield, Trash2, User, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Modal } from '@/components/primitive/Modal'
import { userEditSchema, type UserEditFormValues } from '@/pages/UsersPage/formTypes'
import { UserInfoTab } from '@/pages/UsersPage/tabs/UserInfoTab'
import { UserPermissionsTab } from '@/pages/UsersPage/tabs/UserPermissionsTab'
import {
  emptyUserForm,
  formToCreatePayload,
  formToUpdatePayload,
  userToForm,
} from '@/pages/UsersPage/utils/userHelpers'
import { useCreateUser, useDeleteUser, useUpdateUser } from '@/hooks/api/useUsers'
import type { UserInfo } from '@/types/api/user'

interface UserDrawerProps {
  user: UserInfo | null
  isCreating: boolean
  onCreated: (id: number) => void
  onCancelCreate: () => void
}

export const UserDrawer = ({
  user,
  isCreating,
  onCreated,
  onCancelCreate,
}: UserDrawerProps) => {
  const [activeTab, setActiveTab] = useState('info')
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const createMut = useCreateUser()
  const updateMut = useUpdateUser()
  const deleteMut = useDeleteUser()

  const { register, handleSubmit, reset, control, watch, setValue } =
    useForm<UserEditFormValues>({
      resolver: zodResolver(userEditSchema),
      defaultValues: emptyUserForm(),
    })

  const values = watch()

  useEffect(() => {
    setSaveError(null)
    setActiveTab('info')
    if (isCreating) {
      setEditMode(true)
      reset(emptyUserForm())
      return
    }
    setEditMode(false)
    if (user) reset(userToForm(user))
  }, [user?.id, user, isCreating, reset])

  const drawerTabs =
    user || isCreating
      ? [
          { key: 'info', label: '기본 정보', icon: <Info size={12} /> },
          { key: 'permissions', label: '권한', icon: <Shield size={12} /> },
        ]
      : undefined

  const handleEdit = () => {
    if (!user) return
    setSaveError(null)
    reset(userToForm(user))
    setEditMode(true)
  }

  const handleCancel = () => {
    if (isCreating) {
      onCancelCreate()
      return
    }
    if (!user) return
    setEditMode(false)
    setSaveError(null)
    reset(userToForm(user))
  }

  const handleSave = handleSubmit(async (formValues) => {
    setSaveError(null)
    if (isCreating) {
      const pw = formValues.password?.trim() ?? ''
      if (pw.length < 4) {
        setSaveError('신규 사용자는 비밀번호(4자 이상)가 필요합니다.')
        return
      }
      const result = await createMut.mutateAsync(formToCreatePayload(formValues))
      if (result.ok) {
        setEditMode(false)
        onCreated(0)
      } else {
        setSaveError(result.message)
      }
      return
    }
    if (!user) return
    const result = await updateMut.mutateAsync({
      id: user.id,
      data: formToUpdatePayload(formValues),
    })
    if (result.ok) {
      setEditMode(false)
    } else {
      setSaveError(result.message)
    }
  })

  const handleDeleteConfirm = async () => {
    if (!user) return
    const result = await deleteMut.mutateAsync(user.id)
    if (result.ok) setDeleteOpen(false)
  }

  const headerTitle = isCreating
    ? '사용자 추가'
    : user
      ? (user.name?.trim() || '(이름 없음)')
      : null

  const showActions = (user || isCreating) && (editMode || isCreating)

  return (
    <>
      <Drawer
        fill
        header={
          headerTitle ? (
            <div>
              <p
                className="text-[14px] font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                {headerTitle}
              </p>
              {!isCreating && user && (
                <p
                  className="text-[11px] font-mono mt-0.5"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  {user.loginId}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 py-4">
              <User size={20} style={{ color: 'var(--color-text-dim)' }} />
              <p className="text-[12px]" style={{ color: 'var(--color-text-dim)' }}>
                사용자를 선택하세요
              </p>
            </div>
          )
        }
        tabs={drawerTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          user && !isCreating && !editMode ? (
            <>
              <Button
                size="sm"
                variant="default"
                leftIcon={<Pencil size={13} />}
                onClick={handleEdit}
              >
                수정
              </Button>
              <Button
                size="sm"
                variant="danger"
                leftIcon={<Trash2 size={13} />}
                onClick={() => setDeleteOpen(true)}
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
                onClick={() => void handleSave()}
              >
                저장
              </Button>
              <Button
                size="sm"
                variant="default"
                leftIcon={<X size={13} />}
                onClick={handleCancel}
              >
                취소
              </Button>
            </>
          ) : undefined
        }
        footer={
          saveError ? (
            <p className="text-[11px] px-1" style={{ color: '#e06060' }}>
              {saveError}
            </p>
          ) : undefined
        }
      >
        {(user || isCreating) && activeTab === 'info' && (
          <UserInfoTab
            editMode={editMode || isCreating}
            register={register}
            values={values}
            onToggleActive={() => setValue('active', !values.active)}
            onToggleExternalApi={() => setValue('useExternalApi', !values.useExternalApi)}
          />
        )}
        {(user || isCreating) && activeTab === 'permissions' && (
          <UserPermissionsTab
            editMode={editMode || isCreating}
            control={control}
            permissions={values.permissions}
            onPermissionsChange={(perms) => setValue('permissions', perms)}
          />
        )}
      </Drawer>

      <Modal
        open={deleteOpen}
        title="사용자 삭제"
        description={user ? `"${user.name}" 사용자를 삭제하시겠습니까?` : ''}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
