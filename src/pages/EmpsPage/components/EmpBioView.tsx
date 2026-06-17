import { useTranslation } from 'react-i18next'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { Select } from '@/components/primitive/Select'
import { EmpBioImagePanel } from '@/pages/EmpsPage/components/EmpBioImagePanel'
import { BIO_NO_REP_CARD_MESSAGE } from '@/lib/image/bioImageConstants'
import {
  defaultRepCardKey,
  repCardOptionLabel,
  repCardOptionValue,
} from '@/pages/EmpsPage/utils/bioHelpers'
import type { CardInfo } from '@/types/api'

const FONT_SIZE = 15

interface EmpBioViewProps {
  imageUrl?: string
  cards: CardInfo[]
  representativeCardKey: string
  canEdit: boolean
  onStartEdit: () => void
}

export const EmpBioView = ({
  imageUrl,
  cards,
  representativeCardKey,
  canEdit,
  onStartEdit,
}: EmpBioViewProps) => {
  const { t } = useTranslation('emp')
  const hasCards = cards.length > 0
  const repKey = representativeCardKey || defaultRepCardKey(cards)

  const repCardOptions = cards.map((card) => ({
    value: repCardOptionValue(card),
    label: repCardOptionLabel(card),
  }))

  return (
    <div className="flex flex-col gap-4">
      <EmpBioImagePanel imageUrl={imageUrl} />

      <div className="flex flex-col gap-2 flex-shrink-0">
        <label
          className="block"
          style={{ fontSize: FONT_SIZE, color: 'var(--color-text-muted)' }}
        >
          {t('bio.repCard')}
        </label>
        <Select
          value={repKey}
          options={repCardOptions}
          disabled
          fontSize={FONT_SIZE}
        />
      </div>

      {!hasCards ? (
        <p className="app-field-error" style={{ fontSize: 15 }}>
          {BIO_NO_REP_CARD_MESSAGE}
        </p>
      ) : null}

      <div className="flex justify-end flex-shrink-0">
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Pencil size={15} />}
          disabled={!canEdit || !hasCards}
          onClick={onStartEdit}
        >
          {t('bio.edit')}
        </Button>
      </div>
    </div>
  )
}
