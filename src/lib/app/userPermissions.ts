import type { MenuPermission, UserPermissions } from '@/types/api/user'

export interface PermissionMenuDef {
  key: string
  readOnly: boolean
}

export interface PermissionCategoryDef {
  categoryKey: string
  items: PermissionMenuDef[]
}

/** 사이드바 메뉴 그룹과 동기화 — 라벨은 `nav` locale */
export const PERMISSION_CATEGORIES: PermissionCategoryDef[] = [
  {
    categoryKey: 'accessMgmt',
    items: [
      { key: 'cardUser', readOnly: false },
      { key: 'card', readOnly: false },
      { key: 'accessLevel', readOnly: false },
      { key: 'area', readOnly: false },
      { key: 'cardFormat', readOnly: false },
    ],
  },
  {
    categoryKey: 'eventMonitor',
    items: [{ key: 'eventMonitor', readOnly: true }],
  },
  {
    categoryKey: 'alarmSetting',
    items: [{ key: 'alarmSetting', readOnly: false }],
  },
  {
    categoryKey: 'securityEquipment',
    items: [
      { key: 'controller', readOnly: false },
      { key: 'reader', readOnly: false },
      { key: 'input', readOnly: false },
      { key: 'output', readOnly: false },
    ],
  },
  {
    categoryKey: 'schedule',
    items: [{ key: 'schedule', readOnly: false }],
  },
  {
    categoryKey: 'linkage',
    items: [{ key: 'linkage', readOnly: false }],
  },
  {
    categoryKey: 'systemMgmt',
    items: [
      { key: 'audit', readOnly: true },
      { key: 'user', readOnly: false },
    ],
  },
]

export const ALL_MENU_KEYS = PERMISSION_CATEGORIES.flatMap((c) => c.items.map((i) => i.key))

export type CategoryPermissionMode = 'read' | 'write' | 'all'

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
  const migrated = { ...raw }
  if (migrated.timezoneHoliday && !migrated.schedule) {
    migrated.schedule = migrated.timezoneHoliday
  }
  for (const key of ALL_MENU_KEYS) {
    const p = migrated[key]
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

const permissionForMode = (item: PermissionMenuDef, mode: CategoryPermissionMode): MenuPermission => {
  if (mode === 'read') return { read: true, write: false }
  if (item.readOnly) return { read: true, write: false }
  return { read: true, write: true }
}

export const setCategoryPermissions = (
  perms: UserPermissions,
  category: PermissionCategoryDef,
  mode: CategoryPermissionMode,
): UserPermissions => {
  const next = { ...perms }
  for (const item of category.items) {
    next[item.key] = permissionForMode(item, mode)
  }
  return next
}

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
