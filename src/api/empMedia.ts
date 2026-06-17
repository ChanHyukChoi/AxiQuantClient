import { axiosInstance } from '@/lib/infra/axios'
import { extractEmpAxiosErrorMessage, type EmpWriteResult } from '@/api/emps'

const parseEmpId = (id: number): number | null => {
  const nid = Math.trunc(Number(id))
  if (!Number.isFinite(nid) || nid <= 0) return null
  return nid
}

/**
 * WPF CardHolderPage 프로필 사진 — JPEG bytes
 * 백엔드 제안: `PUT /api/emps/{id}/photo` (`Content-Type: image/jpeg`)
 */
export const updateEmpPhoto = async (id: number, jpegBytes: Uint8Array): Promise<EmpWriteResult> => {
  const nid = parseEmpId(id)
  if (nid == null) {
    return { ok: false, message: '직원 ID가 올바르지 않습니다.' }
  }
  try {
    await axiosInstance.put(`/api/emps/${nid}/photo`, jpegBytes, {
      headers: { 'Content-Type': 'image/jpeg' },
    })
    return { ok: true }
  } catch (error) {
    return { ok: false, message: extractEmpAxiosErrorMessage(error) }
  }
}

/** `DELETE /api/emps/{id}/photo` */
export const deleteEmpPhoto = async (id: number): Promise<EmpWriteResult> => {
  const nid = parseEmpId(id)
  if (nid == null) {
    return { ok: false, message: '직원 ID가 올바르지 않습니다.' }
  }
  try {
    await axiosInstance.delete(`/api/emps/${nid}/photo`)
    return { ok: true }
  } catch (error) {
    return { ok: false, message: extractEmpAxiosErrorMessage(error) }
  }
}

/**
 * WPF BioInfoRegistrationWindow — jpg/jpeg/png bytes
 * 백엔드 제안: `PUT /api/emps/{id}/bio` (`Content-Type: image/jpeg` | `image/png`)
 */
export const updateEmpBio = async (
  id: number,
  bytes: Uint8Array,
  contentType: string,
): Promise<EmpWriteResult> => {
  const nid = parseEmpId(id)
  if (nid == null) {
    return { ok: false, message: '직원 ID가 올바르지 않습니다.' }
  }
  try {
    await axiosInstance.put(`/api/emps/${nid}/bio`, bytes, {
      headers: { 'Content-Type': contentType },
    })
    return { ok: true }
  } catch (error) {
    return { ok: false, message: extractEmpAxiosErrorMessage(error) }
  }
}

/** `DELETE /api/emps/{id}/bio` */
export const deleteEmpBio = async (id: number): Promise<EmpWriteResult> => {
  const nid = parseEmpId(id)
  if (nid == null) {
    return { ok: false, message: '직원 ID가 올바르지 않습니다.' }
  }
  try {
    await axiosInstance.delete(`/api/emps/${nid}/bio`)
    return { ok: true }
  } catch (error) {
    return { ok: false, message: extractEmpAxiosErrorMessage(error) }
  }
}
