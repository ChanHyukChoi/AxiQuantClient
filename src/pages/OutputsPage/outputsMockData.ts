import type { OutputInfo } from '@/types/api'

export interface OutputDisplayRow extends OutputInfo {
  scpName: string
  sioName: string
}

export const MOCK_OUTPUTS: OutputDisplayRow[] = [
  {
    scp: 2,
    id: 1,
    name: 'LP1502-I-LED3',
    active: 1,
    sio: 0,
    addr: 3,
    defpulse: 3,
    ext: '',
    mode: 0,
    scpName: 'KIT_LP5500',
    sioName: 'Internal',
  },
  {
    scp: 1,
    id: 1,
    name: 'LP4502-MR16OUT-LED1',
    active: 1,
    sio: 2,
    addr: 1,
    defpulse: 3,
    ext: '',
    mode: 0,
    scpName: 'KIT_LP4502',
    sioName: 'IMR16OUT',
  },
  {
    scp: 1,
    id: 2,
    name: 'LP4502-MR16OUT-LED2',
    active: 1,
    sio: 2,
    addr: 2,
    defpulse: 3,
    ext: '',
    mode: 0,
    scpName: 'KIT_LP4502',
    sioName: 'IMR16OUT',
  },
  {
    scp: 1,
    id: 3,
    name: 'LP4502-MR16OUT-LED3',
    active: 1,
    sio: 2,
    addr: 3,
    defpulse: 3,
    ext: '',
    mode: 0,
    scpName: 'KIT_LP4502',
    sioName: 'IMR16OUT',
  },
  {
    scp: 1,
    id: 4,
    name: 'LP4502-MR16OUT-LED4',
    active: 1,
    sio: 2,
    addr: 4,
    defpulse: 3,
    ext: '',
    mode: 0,
    scpName: 'KIT_LP4502',
    sioName: 'IMR16OUT',
  },
]

export const outputRowKey = (row: Pick<OutputInfo, 'scp' | 'id'>): string => `${row.scp}:${row.id}`

export const outputGridId = (row: Pick<OutputInfo, 'scp' | 'id'>): number =>
  row.scp * 100000 + row.id
