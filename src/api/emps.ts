import axios from 'axios'
import { axiosInstance } from '@/lib/infra/axios'
import { buildEmpWirePayload } from '@/lib/mappers/empsMappers'
import { MOCK_EMP_LIST } from '@/mocks/empMockData'
import type { CreateEmpRequest, EmpInfo, UpdateEmpRequest } from '@/types/api'

export type EmpWriteResult = { ok: true } | { ok: false; message: string }

/** ASP.NET ProblemDetails·빈 응답·네트워크 실패 등 — 백엔드 없이 브라우저만으로 확인 가능한 수준의 안내 */
export const extractEmpAxiosErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) return '알 수 없는 오류가 발생했습니다.'

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
    if (status >= 500) {
      return `HTTP ${status} — 응답 본문이 비어 있습니다. 서버 내부 오류일 가능성이 큽니다. 백엔드에 접근할 수 없다면, 담당자에게 "직원 저장 시 ${status}, 본문 없음"과 요청 시각·URL만 전달해 주세요.`
    }
    return `HTTP ${status} (본문 없음)`
  }

  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t === '') return `HTTP ${status} (본문 없음)`
    return t.length > 400 ? `${t.slice(0, 400)}…` : t
  }

  if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    if (typeof o.detail === 'string' && o.detail.trim() !== '') return o.detail
    if (typeof o.title === 'string' && o.title.trim() !== '') return o.title
    if (typeof o.message === 'string') return o.message
    if (typeof o.error === 'string') return o.error
    try {
      const s = JSON.stringify(raw)
      return s.length > 400 ? `${s.slice(0, 400)}…` : s
    } catch {
      return '서버 오류 응답을 파싱하지 못했습니다.'
    }
  }

  return error.message
}

const logEmpAxiosError = (op: string, error: unknown) => {
  if (!import.meta.env.DEV) return
  if (axios.isAxiosError(error)) {
    const cfg = error.config
    const url = cfg ? `${cfg.baseURL ?? ''}${cfg.url ?? ''}` : '(url 없음)'
    const detail = extractEmpAxiosErrorMessage(error)
    console.error(`[api/emps] ${op}`, {
      message: detail,
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
  // TODO: API 스펙 확정 후 실 API 복구
  return MOCK_EMP_LIST
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
