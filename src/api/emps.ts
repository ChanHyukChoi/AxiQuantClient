import axios from 'axios'
import { axiosInstance } from '@/lib/infra/axios'
import { buildEmpWirePayload, parseEmpList } from '@/lib/mappers/empsMappers'
import type { CreateEmpRequest, EmpInfo, UpdateEmpRequest } from '@/types/api'

export type EmpWriteResult = { ok: true } | { ok: false; message: string }

const formatEmpAxiosErrorForLog = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : String(error)
  }

  const res = error.response
  if (res == null) {
    const code = error.code
    const hint =
      code === 'ERR_NETWORK'
        ? '브라우저가 서버에 도달하지 못했습니다. PC 네트워크, VPN, 방화벽, 서버 IP/포트, 또는 CORS(웹일 때)를 의심하세요.'
        : code === 'ECONNABORTED'
          ? '요청 시간이 초과되었습니다.'
          : '연결이 끊겼거나 응답 전에 오류가 났습니다.'
    return `서버로부터 HTTP 응답을 받지 못했습니다. ${hint} (코드: ${code ?? '없음'}, 메시지: ${error.message})`
  }

  const status = res.status
  const raw = res.data

  if (raw === undefined || raw === null || (typeof raw === 'string' && raw.trim() === '')) {
    return `HTTP ${status} (본문 없음)`
  }

  if (typeof raw === 'string') return raw
  if (typeof raw === 'object') {
    try {
      return JSON.stringify(raw)
    } catch {
      return '서버 오류 응답을 파싱하지 못했습니다.'
    }
  }

  return error.message
}

/** UI에 표시할 짧은 오류 메시지 */
export const extractEmpAxiosErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) return '처리하지 못했습니다.'

  const res = error.response
  if (res == null) {
    if (error.code === 'ECONNABORTED') return '요청 시간이 초과되었습니다.'
    return '서버에 연결하지 못했습니다.'
  }

  const raw = res.data
  if (typeof raw === 'object' && raw !== null) {
    const o = raw as Record<string, unknown>
    if (typeof o.detail === 'string' && o.detail.trim() !== '') return o.detail
    if (typeof o.title === 'string' && o.title.trim() !== '') return o.title
    if (typeof o.message === 'string' && o.message.trim() !== '') return o.message
    if (typeof o.error === 'string' && o.error.trim() !== '') return o.error
  }

  if (typeof raw === 'string' && raw.trim() !== '') {
    const text = raw.trim()
    return text.length > 200 ? `${text.slice(0, 200)}…` : text
  }

  if (res.status >= 500) return '서버 오류가 발생했습니다.'
  if (res.status === 404) return '요청한 항목을 찾을 수 없습니다.'
  return '처리하지 못했습니다.'
}

const logEmpAxiosError = (op: string, error: unknown) => {
  if (!import.meta.env.DEV) return
  if (axios.isAxiosError(error)) {
    const cfg = error.config
    const url = cfg ? `${cfg.baseURL ?? ''}${cfg.url ?? ''}` : '(url 없음)'
    console.error(`[api/emps] ${op}`, {
      message: formatEmpAxiosErrorForLog(error),
      code: error.code,
      status: error.response?.status,
      responseData: error.response?.data,
      requestMethod: cfg?.method,
      requestUrl: url,
    })
  } else {
    console.error(`[api/emps] ${op}`, error)
  }
}

export const getEmpList = async (): Promise<EmpInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/emps')
    return parseEmpList(data)
  } catch (error) {
    logEmpAxiosError('GET /api/emps', error)
    return null
  }
}

export const createEmp = async (emp: CreateEmpRequest): Promise<EmpWriteResult> => {
  try {
    await axiosInstance.post('/api/emps', buildEmpWirePayload(emp, 0))
    return { ok: true }
  } catch (error) {
    logEmpAxiosError('POST /api/emps', error)
    return { ok: false, message: extractEmpAxiosErrorMessage(error) }
  }
}

export const updateEmp = async (id: number, emp: UpdateEmpRequest): Promise<EmpWriteResult> => {
  const nid = Math.trunc(Number(id))
  if (!Number.isFinite(nid) || nid < 0) {
    return { ok: false, message: '직원 ID가 올바르지 않습니다.' }
  }
  try {
    await axiosInstance.put(`/api/emps/${nid}`, buildEmpWirePayload(emp, nid))
    return { ok: true }
  } catch (error) {
    logEmpAxiosError(`PUT /api/emps/${nid}`, error)
    return { ok: false, message: extractEmpAxiosErrorMessage(error) }
  }
}

export const deleteEmp = async (id: number): Promise<EmpWriteResult> => {
  const nid = Math.trunc(Number(id))
  if (!Number.isFinite(nid) || nid < 0) {
    return { ok: false, message: '직원 ID가 올바르지 않습니다.' }
  }
  try {
    await axiosInstance.delete(`/api/emps/${nid}`)
    return { ok: true }
  } catch (error) {
    logEmpAxiosError(`DELETE /api/emps/${nid}`, error)
    return { ok: false, message: extractEmpAxiosErrorMessage(error) }
  }
}
