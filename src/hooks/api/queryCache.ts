import type { QueryClient } from '@tanstack/react-query'
import { getAccLvList } from '@/api/acclv'
import { getHolidayList } from '@/api/holiday'
import { getSioList } from '@/api/sio'
import { getScpList } from '@/api/scp'
import { getTimezoneList } from '@/api/timezone'
import { queryKeys } from '@/lib/query/queryKeys'

/** mutation 후 목록 재조회·선택용 — pages에서 api 직접 호출 대신 사용 */
export const fetchScpList = (qc: QueryClient) =>
  qc.fetchQuery({ queryKey: queryKeys.deviceControl.scps(), queryFn: getScpList })

export const fetchSioList = (qc: QueryClient, scpId: number) =>
  qc.fetchQuery({
    queryKey: queryKeys.deviceControl.sios(scpId),
    queryFn: () => getSioList(scpId),
  })

export const fetchTimezoneList = (qc: QueryClient) =>
  qc.fetchQuery({ queryKey: queryKeys.timezone.all, queryFn: getTimezoneList })

export const fetchHolidayList = (qc: QueryClient) =>
  qc.fetchQuery({ queryKey: queryKeys.holiday.all, queryFn: getHolidayList })

export const fetchAccLvList = (qc: QueryClient) =>
  qc.fetchQuery({ queryKey: queryKeys.acclv.all, queryFn: getAccLvList })
