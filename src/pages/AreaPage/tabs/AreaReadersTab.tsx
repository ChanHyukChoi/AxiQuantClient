import { useTranslation } from 'react-i18next'
import { ScanLine } from 'lucide-react'

export const AreaReadersTab = () => {
  const { t } = useTranslation('area')

  return (
    <div
      className="flex flex-col items-center justify-center py-10 gap-2"
      style={{ color: 'var(--color-text-subtle)' }}
    >
      <ScanLine size={24} strokeWidth={1.5} style={{ opacity: 0.5 }} />
      <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
        {t('readers.empty')}
      </p>
    </div>
  )
}
