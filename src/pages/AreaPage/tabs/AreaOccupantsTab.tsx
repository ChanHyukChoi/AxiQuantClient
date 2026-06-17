import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'

export const AreaOccupantsTab = () => {
  const { t } = useTranslation('area')

  return (
    <div
      className="flex flex-col items-center justify-center py-10 gap-2"
      style={{ color: 'var(--color-text-subtle)' }}
    >
      <Users size={24} strokeWidth={1.5} style={{ opacity: 0.5 }} />
      <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
        {t('occupants.empty')}
      </p>
    </div>
  )
}
