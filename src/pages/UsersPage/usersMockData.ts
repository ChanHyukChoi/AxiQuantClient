import { createDefaultPermissions } from '@/pages/UsersPage/permissions'
import type { UserInfo } from '@/types/api/user'

export const MOCK_USERS: UserInfo[] = [
  {
    id: 1,
    name: '관리자',
    loginId: 'admin',
    active: true,
    useExternalApi: false,
    permissions: createDefaultPermissions(),
  },
  {
    id: 2,
    name: 'catis',
    loginId: 'catis',
    active: true,
    useExternalApi: false,
    permissions: createDefaultPermissions(),
  },
  {
    id: 3,
    name: 'chchoi',
    loginId: 'chchoi',
    active: true,
    useExternalApi: true,
    permissions: createDefaultPermissions(),
  },
  {
    id: 4,
    name: 'gltest',
    loginId: 'gltest',
    active: false,
    useExternalApi: false,
    permissions: createDefaultPermissions(),
  },
  {
    id: 5,
    name: 'operator',
    loginId: 'operator',
    active: true,
    useExternalApi: false,
    permissions: createDefaultPermissions(),
  },
]
