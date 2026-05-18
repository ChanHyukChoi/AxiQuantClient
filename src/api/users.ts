import { axiosInstance } from '@/lib/axios'
import { isApiNotReady } from '@/lib/apiErrors'
import { parseUserList, userInfoToWire } from '@/lib/userMappers'
import type { CreateUserRequest, UpdateUserRequest, UserInfo } from '@/types/api/user'

export type UserWriteResult = { ok: true } | { ok: false; message: string }
export type UserListResult = { users: UserInfo[]; apiNotReady?: boolean }

const NOT_READY_MSG = '사용자 관리 API가 아직 서버에 구현되지 않았습니다.'

export const getUserList = async (): Promise<UserListResult> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/users')
    return { users: parseUserList(data) }
  } catch (error) {
    if (isApiNotReady(error)) return { users: [], apiNotReady: true }
    throw new Error('사용자 목록을 불러오지 못했습니다.')
  }
}

export const createUser = async (user: CreateUserRequest): Promise<UserWriteResult> => {
  try {
    await axiosInstance.post('/api/users', userInfoToWire({ ...user, id: 0 }))
    return { ok: true }
  } catch (error) {
    if (isApiNotReady(error)) return { ok: false, message: NOT_READY_MSG }
    return { ok: false, message: '사용자를 생성하지 못했습니다.' }
  }
}

export const updateUser = async (id: number, user: UpdateUserRequest): Promise<UserWriteResult> => {
  const nid = Math.trunc(id)
  if (!Number.isFinite(nid) || nid <= 0) {
    return { ok: false, message: '사용자 ID가 올바르지 않습니다.' }
  }
  try {
    await axiosInstance.put(`/api/users/${nid}`, userInfoToWire({ ...user, id: nid }))
    return { ok: true }
  } catch (error) {
    if (isApiNotReady(error)) return { ok: false, message: NOT_READY_MSG }
    return { ok: false, message: '사용자를 수정하지 못했습니다.' }
  }
}

export const deleteUser = async (id: number): Promise<UserWriteResult> => {
  const nid = Math.trunc(id)
  if (!Number.isFinite(nid) || nid <= 0) {
    return { ok: false, message: '사용자 ID가 올바르지 않습니다.' }
  }
  try {
    await axiosInstance.delete(`/api/users/${nid}`)
    return { ok: true }
  } catch (error) {
    if (isApiNotReady(error)) return { ok: false, message: NOT_READY_MSG }
    return { ok: false, message: '사용자를 삭제하지 못했습니다.' }
  }
}
