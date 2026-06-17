import { useTranslation } from 'react-i18next'
import { ImageUp, Scan, UserRound } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Select } from '@/components/primitive/Select'
import { EmpBioImagePanel } from '@/pages/EmpsPage/components/EmpBioImagePanel'
import {
  repCardOptionLabel,
  repCardOptionValue,
} from '@/pages/EmpsPage/utils/bioHelpers'
import type { CardInfo } from '@/types/api'

const FONT_SIZE = 15

interface EmpBioEditPanelProps {
  imageUrl?: string
  cards: CardInfo[]
  representativeCardKey: string
  useAsProfile: boolean
  loading?: boolean
  onRepresentativeCardChange: (key: string) => void
  onUseAsProfileChange: (checked: boolean) => void
  onFileSelect: (file: File) => void
  onClear: () => void
  onImportProfile: () => void
}

export const EmpBioEditPanel = ({
  imageUrl,
  cards,
  representativeCardKey,
  useAsProfile,
  loading = false,
  onRepresentativeCardChange,
  onUseAsProfileChange,
  onFileSelect,
  onClear,
  onImportProfile,
}: EmpBioEditPanelProps) => {
  const { t } = useTranslation('emp')

  const repCardOptions = cards.map((card) => ({
    value: repCardOptionValue(card),
    label: repCardOptionLabel(card),
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-start">
        <EmpBioImagePanel
          imageUrl={imageUrl}
          editable
          loading={loading}
          onFileSelect={onFileSelect}
          onClear={onClear}
        />

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <span style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>
            {t('bio.reader')}
          </span>
          <Select
            value=""
            options={[{ value: '', label: t('bio.select') }]}
            disabled
            fontSize={FONT_SIZE}
          />
          <Button
            variant="default"
            size="sm"
            leftIcon={<Scan size={14} />}
            disabled
            className="w-full"
          >
            {t('bio.scan')}
          </Button>
          <Button
            variant="default"
            size="sm"
            leftIcon={<ImageUp size={14} />}
            loading={loading}
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = '.jpg,.jpeg,.png'
              input.onchange = () => {
                const file = input.files?.[0]
                if (file) onFileSelect(file)
              }
              input.click()
            }}
            className="w-full"
          >
            {t('bio.loadImage')}
          </Button>
          <Button
            variant="default"
            size="sm"
            leftIcon={<UserRound size={14} />}
            disabled={loading}
            onClick={onImportProfile}
            className="w-full"
          >
            {t('bio.importProfile')}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-shrink-0">
        <label
          className="block"
          style={{ fontSize: FONT_SIZE, color: 'var(--color-text-muted)' }}
        >
          {t('bio.repCard')}
        </label>
        <Select
          value={representativeCardKey}
          onChange={onRepresentativeCardChange}
          options={repCardOptions}
          fontSize={FONT_SIZE}
        />
      </div>

      <label
        className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
        style={{ fontSize: FONT_SIZE, color: 'var(--color-text)' }}
      >
        <Checkbox checked={useAsProfile} onChange={onUseAsProfileChange} size={16} />
        <span>{t('bio.useAsProfile')}</span>
      </label>
    </div>
  )
}
