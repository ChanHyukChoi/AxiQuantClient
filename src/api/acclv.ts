import { axiosInstance } from '@/lib/infra/axios'
import { accLvToWire, parseAccLvList } from '@/lib/mappers/acclvMappers'
import { asRecordArray, firstNumber, optionalString } from '@/lib/wire/wireJson'
import type {
  AccLvInfo,
  AccLvRdrInfo,
  AddAccLvReaderRequest,
  CreateAccLvRequest,
  UpdateAccLvRequest,
} from '@/types/api'

const normalizeAccLvRdrRow = (row: Record<string, unknown>): AccLvRdrInfo => ({
  alv: firstNumber(row, ['alv', 'accLvId']),
  scp: firstNumber(row, ['scp', 'scpId']),
  rdr: firstNumber(row, ['rdr', 'readerId']),
  tz: 'tz' in row ? firstNumber(row, ['tz']) : undefined,
  readerName: optionalString(row, 'readerName'),
  scpName: optionalString(row, 'scpName'),
})

export const getAccLvList = async (): Promise<AccLvInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/acclv')
    return parseAccLvList(data)
  } catch {
    return null
  }
}

export const createAccLv = async (acclv: CreateAccLvRequest): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/acclv', { acclv: accLvToWire(acclv, 0) })
    return true
  } catch {
    return false
  }
}

export const updateAccLv = async (id: number, acclv: UpdateAccLvRequest): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/acclv/${id}`, { acclv: accLvToWire(acclv, id) })
    return true
  } catch {
    return false
  }
}

export const deleteAccLv = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/acclv/${id}`)
    return true
  } catch {
    return false
  }
}

export const getAccLvReaderList = async (alvId: number): Promise<AccLvRdrInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>(`/api/acclv/${alvId}/reader`)
    return asRecordArray(data).map(normalizeAccLvRdrRow)
  } catch {
    return null
  }
}

export const addAccLvReader = async (alvId: number, rdr: AddAccLvReaderRequest): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/acclv/${alvId}/reader`, {
      rdr: {
        alv: alvId,
        scp: rdr.scpId,
        rdr: rdr.readerId,
        tz: rdr.tz ?? 0,
      },
    })
    return true
  } catch {
    return false
  }
}

export const deleteAccLvReader = async (
  alvId: number,
  scpId: number,
  rdrId: number,
): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/acclv/${alvId}/reader/${scpId}/${rdrId}`)
    return true
  } catch {
    return false
  }
}
