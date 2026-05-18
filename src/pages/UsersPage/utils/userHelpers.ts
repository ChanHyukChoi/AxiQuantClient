import { createDefaultPermissions, normalizePermissions } from '@/pages/UsersPage/permissions'
import type { UserEditFormValues } from '@/pages/UsersPage/formTypes'
import type { CreateUserRequest, UpdateUserRequest, UserInfo } from '@/types/api/user'

export const userToForm = (user: UserInfo): UserEditFormValues => ({
  name: user.name,
  loginId: user.loginId,
  active: user.active,
  useExternalApi: user.useExternalApi,
  password: '',
  confirmPassword: '',
  permissions: normalizePermissions(user.permissions),
})

export const emptyUserForm = (): UserEditFormValues => ({
  name: '',
  loginId: '',
  active: true,
  useExternalApi: false,
  password: '',
  confirmPassword: '',
  permissions: createDefaultPermissions(),
})

export const formToCreatePayload = (values: UserEditFormValues): CreateUserRequest => ({
  name: values.name.trim(),
  loginId: values.loginId.trim(),
  active: values.active,
  useExternalApi: values.useExternalApi,
  permissions: values.permissions,
  password: values.password?.trim() || undefined,
})

export const formToUpdatePayload = (values: UserEditFormValues): UpdateUserRequest => {
  const pw = values.password?.trim()
  return {
    name: values.name.trim(),
    loginId: values.loginId.trim(),
    active: values.active,
    useExternalApi: values.useExternalApi,
    permissions: values.permissions,
    ...(pw ? { password: pw } : {}),
  }
}
