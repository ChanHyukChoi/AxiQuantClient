import { axiosInstance } from '@/lib/infra/axios'
import { parseUserList, userInfoToWire } from '@/lib/mappers/userMappers'
import type { CreateUserRequest, UpdateUserRequest, UserInfo } from '@/types/api/user'

export type UserWriteResult = { ok: true } | { ok: false; message: string }

const NOT_READY_MSG = '요청을 처리하지 못했습니다.'

export const getUserList = async (): Promise<UserInfo[]> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/users')
    return parseUserList(data)
  } catch {
    return []
  }
}

export const createUser = async (user: CreateUserRequest): Promise<UserWriteResult> => {
  try {
    await axiosInstance.post('/api/users', userInfoToWire({ ...user, id: 0 }))
    return { ok: true }
  } catch {
    return { ok: false, message: NOT_READY_MSG }
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
  } catch {
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
  } catch {
    return { ok: false, message: '사용자를 삭제하지 못했습니다.' }
  }
}
