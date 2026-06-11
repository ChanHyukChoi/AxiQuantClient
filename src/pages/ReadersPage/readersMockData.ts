import type { ReaderInfo } from '@/types/api'
import type { ReaderKind } from '@/pages/ReadersPage/utils/readerDisplay'

export interface ReaderDisplayRow extends ReaderInfo {
  scpName: string
  sioName: string
  modelName: string
  pairReaderName: string
  kind: ReaderKind
  connectionHost?: string
  deviceManager?: string
}

const baseReader = (
  partial: Partial<ReaderDisplayRow> & Pick<ReaderDisplayRow, 'scp' | 'id' | 'name'>,
): ReaderDisplayRow => ({
  active: 1,
  sio: 0,
  addr: 1,
  dtfmt: 0,
  kpadmode: 0,
  ledmode: 0,
  osdpflag: 0,
  accfg: 0,
  pairacr: 0,
  cdfmt: 0,
  apbmode: 0,
  apbin: 0,
  apbto: 0,
  spare: 0,
  actlflag: 0,
  offmode: 0,
  defmode: 1,
  defledmode: 0,
  prealarm: 0,
  apbdelay: 0,
  mask: 0,
  ext: '',
  args: '',
  scpName: '',
  sioName: 'Internal',
  modelName: '',
  pairReaderName: '',
  kind: 'general',
  ...partial,
})

export const MOCK_READERS: ReaderDisplayRow[] = [
  baseReader({
    scp: 1,
    id: 1,
    name: 'LP4502-CR1-IN',
    sio: 0,
    addr: 1,
    defmode: 1,
    offmode: 0,
    kpadmode: 0,
    scpName: 'KIT_LP4502',
    sioName: 'Internal',
    modelName: 'HID AMICO VL35LF',
    pairReaderName: 'LP4502-CR1-OUT',
    kind: 'general',
  }),
  baseReader({
    scp: 1,
    id: 2,
    name: 'LP4502-CR1-OUT',
    sio: 0,
    addr: 2,
    defmode: 2,
    offmode: 0,
    kpadmode: 1,
    scpName: 'KIT_LP4502',
    modelName: 'HID AMICO VL35LF',
    pairReaderName: 'LP4502-CR1-IN',
    kind: 'general',
  }),
  baseReader({
    scp: 1,
    id: 3,
    name: 'LP4502-MR16OUT-R1',
    sio: 2,
    addr: 1,
    defmode: 1,
    offmode: 0,
    kpadmode: 0,
    scpName: 'KIT_LP4502',
    sioName: 'IMR16OUT',
    modelName: 'MR16OUT',
    kind: 'general',
  }),
  baseReader({
    scp: 0,
    id: 10,
    name: 'HID AMICO VL35LF',
    active: 1,
    addr: 0,
    defmode: 1,
    scpName: '—',
    sioName: '—',
    modelName: 'HID AMICO VL35LF',
    kind: 'standalone',
    connectionHost: '192.168.250.249',
    deviceManager: 'admin',
    args: 'standalone',
  }),
  baseReader({
    scp: 1,
    id: 4,
    name: 'BIO-READER-01',
    sio: 1,
    addr: 3,
    osdpflag: 1,
    defmode: 1,
    scpName: 'KIT_LP4502',
    sioName: 'IMR16IN',
    modelName: 'OSDP Bio',
    kind: 'bio',
    deviceManager: 'admin',
  }),
]

export const MOCK_CARD_FORMATS = [
  'CATIS',
  'Rack Lock',
  '13.56MHz',
  'HID 35bit',
  'WIEGAND',
  'MIFARE',
]
