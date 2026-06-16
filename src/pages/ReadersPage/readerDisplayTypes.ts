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
