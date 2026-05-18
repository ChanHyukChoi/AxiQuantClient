import type { CardfmtInfo } from '@/types/api'
import type { CardFmtEditFormValues } from '@/pages/CardFmtPage/formTypes'

export const cardfmtToForm = (fmt: CardfmtInfo): CardFmtEditFormValues => ({
  name: fmt.name,
  facility: fmt.facility,
  idOffset: fmt.idOffset,
  funcId: fmt.funcId,
  flags: fmt.flags,
  totalBits: fmt.totalBits,
  evenBits: fmt.evenBits,
  evenLoc: fmt.evenLoc,
  oddBits: fmt.oddBits,
  oddLoc: fmt.oddLoc,
  fcBits: fmt.fcBits,
  fcLoc: fmt.fcLoc,
  cardBits: fmt.cardBits,
  cardLoc: fmt.cardLoc,
  issueBits: fmt.issueBits,
  issueLoc: fmt.issueLoc,
  minDigits: fmt.minDigits,
  maxDigits: fmt.maxDigits,
  ext: fmt.ext,
})

export const formToCardfmtPayload = (
  values: CardFmtEditFormValues,
): Omit<CardfmtInfo, 'id'> => ({
  name: values.name,
  facility: values.facility,
  idOffset: values.idOffset,
  funcId: values.funcId,
  flags: values.flags,
  totalBits: values.totalBits,
  evenBits: values.evenBits,
  evenLoc: values.evenLoc,
  oddBits: values.oddBits,
  oddLoc: values.oddLoc,
  fcBits: values.fcBits,
  fcLoc: values.fcLoc,
  cardBits: values.cardBits,
  cardLoc: values.cardLoc,
  issueBits: values.issueBits,
  issueLoc: values.issueLoc,
  minDigits: values.minDigits,
  maxDigits: values.maxDigits,
  ext: values.ext ?? '',
})

export const cardfmtToUpdatePayload = (fmt: CardfmtInfo): Omit<CardfmtInfo, 'id'> => {
  const { id, ...rest } = fmt
  void id
  return rest
}

/** BitVisualizer·폼 watch 공용 */
export type BitStructureSource = Pick<
  CardfmtInfo,
  | 'totalBits'
  | 'evenBits'
  | 'evenLoc'
  | 'oddBits'
  | 'oddLoc'
  | 'fcBits'
  | 'fcLoc'
  | 'cardBits'
  | 'cardLoc'
>
