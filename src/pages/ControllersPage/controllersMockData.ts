import type { ScpInfo, SioInfo } from '@/types/api'

/** 시연용 — API 미연결·빈 응답 시 ControllersPage에서 사용 */
export const MOCK_SCPS: ScpInfo[] = [
  {
    id: 1,
    name: 'KIT_LP4502',
    active: 1,
    connstr: '192.168.0.101:8001',
    model: 4502,
    ctype: 1,
    ext: '',
  },
  {
    id: 2,
    name: 'KIT_LP5500',
    active: 1,
    connstr: '192.168.0.102:8001',
    model: 5500,
    ctype: 1,
    ext: '',
  },
  {
    id: 3,
    name: 'RT_LP1600',
    active: 0,
    connstr: '192.168.0.201:8001',
    model: 1600,
    ctype: 2,
    ext: 'TLS Required',
  },
  {
    id: 4,
    name: '테스트기기1',
    active: 1,
    connstr: '10.0.0.50:8001',
    model: 1500,
    ctype: 1,
    ext: '',
  },
]

export const MOCK_SIOS_BY_SCP: Record<number, SioInfo[]> = {
  1: [
    {
      scp: 1,
      id: 1,
      name: 'IMR16IN',
      active: 1,
      port: 1,
      addr: 1,
      model: 101,
      ext: '16채널 입력',
    },
    {
      scp: 1,
      id: 2,
      name: 'IMR16OUT',
      active: 1,
      port: 2,
      addr: 2,
      model: 102,
      ext: '16채널 출력',
    },
    {
      scp: 1,
      id: 3,
      name: 'MR50',
      active: 1,
      port: 3,
      addr: 0,
      model: 50,
      ext: '',
    },
  ],
  2: [
    {
      scp: 2,
      id: 1,
      name: 'MR52',
      active: 1,
      port: 1,
      addr: 4,
      model: 52,
      ext: '',
    },
    {
      scp: 2,
      id: 2,
      name: 'QQ',
      active: 0,
      port: 2,
      addr: 0,
      model: 0,
      ext: '테스트 보드',
    },
  ],
  3: [],
  4: [
    {
      scp: 4,
      id: 1,
      name: 'MR50',
      active: 1,
      port: 1,
      addr: 2,
      model: 50,
      ext: '',
    },
  ],
}

export const mockSiosForScp = (scpId: number): SioInfo[] => MOCK_SIOS_BY_SCP[scpId] ?? []

export const mockSioCountByScpId = (): Record<number, number> => {
  const counts: Record<number, number> = {}
  for (const scp of MOCK_SCPS) {
    counts[scp.id] = (MOCK_SIOS_BY_SCP[scp.id] ?? []).length
  }
  return counts
}
