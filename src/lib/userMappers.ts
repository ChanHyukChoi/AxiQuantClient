import { normalizePermissions } from '@/pages/UsersPage/permissions'
import { asRecordArray, firstNumber } from '@/lib/wireJson'
import type { UserInfo, UserPermissions } from '@/types/api/user'

const str = (row: Record<string, unknown>, keys: string[]): string => {
  for (const k of keys) {
    const v = row[k]
    if (v != null && String(v).trim() !== '') return String(v)
  }
  return ''
}

const bool = (row: Record<string, unknown>, keys: string[]): boolean => {
  for (const k of keys) {
    const v = row[k]
    if (typeof v === 'boolean') return v
    if (typeof v === 'number') return v !== 0
    if (typeof v === 'string') return v === '1' || v.toLowerCase() === 'true'
  }
  return false
}

const parsePermissions = (raw: unknown): UserPermissions => {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return normalizePermissions(undefined)
  }
  const o = raw as Record<string, unknown>
  const perms: UserPermissions = {}
  for (const [key, val] of Object.entries(o)) {
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const p = val as Record<string, unknown>
      perms[key] = {
        read: Boolean(p.read),
        write: Boolean(p.write),
      }
    }
  }
  return normalizePermissions(perms)
}

export const wireToUserInfo = (row: Record<string, unknown>, index: number): UserInfo => ({
  id: firstNumber(row, ['id', 'userId']) || index + 1,
  name: str(row, ['name', 'userName']),
  loginId: str(row, ['loginId', 'login', 'userId']),
  active: bool(row, ['active', 'isActive']),
  useExternalApi: bool(row, ['useExternalApi', 'externalApi']),
  permissions: parsePermissions(row.permissions ?? row.perms),
})

export const userInfoToWire = (user: Omit<UserInfo, 'id'> & { id?: number; password?: string }) => ({
  id: user.id ?? 0,
  name: user.name,
  loginId: user.loginId,
  active: user.active,
  useExternalApi: user.useExternalApi,
  permissions: user.permissions,
  ...(user.password?.trim() ? { password: user.password.trim() } : {}),
})

export const parseUserList = (data: unknown): UserInfo[] => {
  if (data == null) return []
  if (Array.isArray(data)) return asRecordArray(data).map(wireToUserInfo)
  if (typeof data === 'object') {
    const o = data as Record<string, unknown>
    return asRecordArray(o.items ?? o.data ?? o.users).map(wireToUserInfo)
  }
  return []
}
