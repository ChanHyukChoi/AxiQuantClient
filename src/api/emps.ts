import axios from 'axios'
import { axiosInstance } from '@/lib/infra/axios'
import { buildEmpWirePayload, parseEmpListWithStats } from '@/lib/mappers/empsMappers'
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

const describeEmpListRaw = (data: unknown): Record<string, unknown> => {
  if (data == null) return { kind: 'null' }
  if (Array.isArray(data)) {
    return {
      kind: 'array',
      length: data.length,
      sampleKeys:
        data[0] != null && typeof data[0] === 'object'
          ? Object.keys(data[0] as Record<string, unknown>).slice(0, 12)
          : [],
    }
  }
  if (typeof data === 'object') {
    const o = data as Record<string, unknown>
    return {
      kind: 'object',
      keys: Object.keys(o),
      nestedLengths: {
        items: Array.isArray(o.items) ? o.items.length : null,
        data: Array.isArray(o.data) ? o.data.length : null,
        emps: Array.isArray(o.emps) ? o.emps.length : null,
        employees: Array.isArray(o.employees) ? o.employees.length : null,
      },
    }
  }
  return { kind: typeof data }
}

const logEmpListFetch = (
  data: unknown,
  parsed: EmpInfo[] | null,
  stats?: ReturnType<typeof parseEmpListWithStats>['stats'],
  error?: unknown,
) => {
  if (!import.meta.env.DEV) return
  if (error != null) {
    logEmpAxiosError('GET /api/emps', error)
    return
  }
  console.info('[api/emps] GET /api/emps — 카드 사용자(직원) 목록', {
    raw: describeEmpListRaw(data),
    parseStats: stats,
    parsedCount: parsed?.length ?? 0,
    parsedSample: (parsed ?? []).slice(0, 3).map((e) => ({
      id: e.id,
      name: e.name,
      lastName: e.lastName,
      name2: e.name2,
    })),
  })
  if (stats && stats.rawRowCount > 0 && (parsed?.length ?? 0) === 0) {
    console.warn(
      '[api/emps] 직원 raw는 있으나 파싱 결과 0건 — id/name 필드·deleted 필터를 확인하세요.',
      { rawSample: describeEmpListRaw(data) },
    )
  }
}

export const getEmpList = async (): Promise<EmpInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/emps')
    const { items, stats } = parseEmpListWithStats(data)
    logEmpListFetch(data, items, stats)
    return items
  } catch (error) {
    logEmpListFetch(null, null, undefined, error)
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
