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

/** 사이드바 메뉴 그룹과 동기화 */
export const PERMISSION_CATEGORIES: PermissionCategoryDef[] = [
  {
    category: '접근 관리',
    items: [
      { key: 'cardUser', label: '카드 사용자', readOnly: false },
      { key: 'card', label: '카드', readOnly: false },
      { key: 'accessLevel', label: '접근 권한', readOnly: false },
      { key: 'area', label: '영역', readOnly: false },
      { key: 'cardFormat', label: '카드 형식', readOnly: false },
    ],
  },
  {
    category: '이벤트 모니터',
    items: [{ key: 'eventMonitor', label: '이벤트 모니터', readOnly: true }],
  },
  {
    category: '경보 설정',
    items: [{ key: 'alarmSetting', label: '경보 설정', readOnly: false }],
  },
  {
    category: '보안 장비',
    items: [
      { key: 'controller', label: '제어기', readOnly: false },
      { key: 'reader', label: '리더', readOnly: false },
      { key: 'input', label: '입력', readOnly: false },
      { key: 'output', label: '출력', readOnly: false },
    ],
  },
  {
    category: '스케쥴',
    items: [{ key: 'schedule', label: '스케쥴', readOnly: false }],
  },
  {
    category: '연동',
    items: [{ key: 'linkage', label: '연동', readOnly: false }],
  },
  {
    category: '시스템 관리',
    items: [
      { key: 'audit', label: '운영 기록', readOnly: true },
      { key: 'user', label: '사용자', readOnly: false },
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
