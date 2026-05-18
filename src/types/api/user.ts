export interface MenuPermission {
  read: boolean
  write: boolean
}

export type UserPermissions = Record<string, MenuPermission>

export interface UserInfo {
  id: number
  name: string
  loginId: string
  active: boolean
  useExternalApi: boolean
  permissions: UserPermissions
}

export type CreateUserRequest = Omit<UserInfo, 'id'> & {
  password?: string
}

export type UpdateUserRequest = Omit<UserInfo, 'id'> & {
  password?: string
}
