import type { MenuPermission, UserPermissions } from '@/types/api/user'

export interface PermissionMenuDef {
  key: string
  label: string
  readOnly: boolean
}

export interface PermissionCategoryDef {
  category: string
  items: PermissionMenuDef[]
}

export const PERMISSION_CATEGORIES: PermissionCategoryDef[] = [
  {
    category: '접근 관리',
    items: [
      { key: 'cardUser', label: '카드 사용자', readOnly: false },
      { key: 'card', label: '카드', readOnly: false },
      { key: 'accessLevel', label: '접근권한', readOnly: false },
      { key: 'area', label: '영역', readOnly: false },
      { key: 'cardFormat', label: '카드 형식', readOnly: false },
    ],
  },
  {
    category: '장치',
    items: [{ key: 'device', label: '장치', readOnly: false }],
  },
  {
    category: '이력/감시',
    items: [{ key: 'eventMonitor', label: '이벤트 모니터', readOnly: true }],
  },
  {
    category: '시스템',
    items: [
      { key: 'user', label: '사용자', readOnly: false },
      { key: 'systemSetting', label: '시스템 설정', readOnly: false },
    ],
  },
]

export const ALL_MENU_KEYS = PERMISSION_CATEGORIES.flatMap((c) => c.items.map((i) => i.key))

export const createDefaultPermissions = (): UserPermissions => {
  const perms: UserPermissions = {}
  for (const key of ALL_MENU_KEYS) {
    perms[key] = { read: false, write: false }
  }
  return perms
}

export const createFullPermissions = (): UserPermissions => {
  const perms: UserPermissions = {}
  for (const cat of PERMISSION_CATEGORIES) {
    for (const item of cat.items) {
      perms[item.key] = item.readOnly ? { read: true, write: false } : { read: true, write: true }
    }
  }
  return perms
}

export const normalizePermissions = (raw: UserPermissions | undefined): UserPermissions => {
  const base = createDefaultPermissions()
  if (!raw) return base
  for (const key of ALL_MENU_KEYS) {
    const p = raw[key]
    if (p) {
      base[key] = {
        read: Boolean(p.read),
        write: Boolean(p.write),
      }
    }
  }
  return base
}

export const isFullPermissions = (perms: UserPermissions): boolean =>
  PERMISSION_CATEGORIES.every((cat) =>
    cat.items.every((item) => {
      const p = perms[item.key]
      if (!p) return false
      if (item.readOnly) return p.read === true && p.write === false
      return p.read === true && p.write === true
    }),
  )

export const setAllPermissions = (allow: boolean): UserPermissions =>
  allow ? createFullPermissions() : createDefaultPermissions()

export const mergePermission = (
  perms: UserPermissions,
  key: string,
  field: keyof MenuPermission,
  value: boolean,
  readOnly: boolean,
): UserPermissions => {
  const current = perms[key] ?? { read: false, write: false }
  const next = { ...current, [field]: value }
  if (field === 'read' && !value) next.write = false
  if (field === 'write' && value) next.read = true
  if (readOnly) next.write = false
  return { ...perms, [key]: next }
}
