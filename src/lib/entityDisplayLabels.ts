/** UI에 DB id를 노출하지 않는 표시용 fallback */

export const fallbackAccLvName = (name?: string | null): string =>
  name?.trim() || '접근 권한'

export const fallbackAreaName = (name?: string | null): string => name?.trim() || '영역'

export const fallbackEmpName = (name?: string | null): string =>
  name?.trim() || '(이름 없음)'

export const fallbackCardFmtName = (name?: string | null): string =>
  name?.trim() || '카드 형식'

export const fallbackAlarmName = (name?: string | null): string => name?.trim() || '경보'

export const fallbackMailAlarmName = (name?: string | null): string =>
  name?.trim() || '이메일 경보'

export const fallbackUserName = (name?: string | null): string =>
  name?.trim() || '(이름 없음)'

export const fallbackScpName = (name?: string | null): string =>
  name?.trim() || '주 제어기'

export const fallbackReaderName = (name?: string | null): string =>
  name?.trim() || '리더'

export const fallbackTimezoneName = (name?: string | null): string =>
  name?.trim() || '시간표'

export const fallbackDeviceKindLabel = (kind: string): string => {
  const labels: Record<string, string> = {
    scp: '주 제어기',
    sio: 'SIO',
    reader: '리더',
    input: '입력',
    output: '출력',
  }
  return labels[kind.toLowerCase()] ?? kind
}
