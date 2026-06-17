import { useTranslation } from 'react-i18next'
import { Clock, Cpu, ScanLine } from 'lucide-react'
import { SectionTitle } from '@/pages/CardsPage/components/CardFieldUi'
import type { CardRow } from '@/pages/CardsPage/utils/cardPageHelpers'

interface CardHistTabProps {
  card: CardRow
  fontSize: number
}

const HistRow = ({
  icon,
  title,
  sub,
  fontSize,
  empty,
}: {
  icon: React.ReactNode
  title: string
  sub: string
  fontSize: number
  empty: string
}) => (
  <div className="flex items-start gap-2 py-1.5 border-b border-[#21252b]">
    <span className="text-[#3a3f4a] mt-0.5 flex-shrink-0">{icon}</span>
    <div className="min-w-0 flex-1">
      <p style={{ color: 'var(--color-text)', fontSize }}>{title || empty}</p>
      <p style={{ color: '#555a63', fontSize }}>{sub}</p>
    </div>
  </div>
)

export const CardHistTab = ({ card, fontSize = 15 }: CardHistTabProps) => {
  const { t } = useTranslation(['card', 'common'])

  return (
    <div>
      <SectionTitle fontSize={fontSize}>{t('card:section.lastAccess')}</SectionTitle>
      <HistRow
        icon={<Cpu size={15} />}
        title={card.lastCtrl?.trim() ?? ''}
        sub={t('card:hist.controller')}
        fontSize={fontSize}
        empty={t('common:empty')}
      />
      <HistRow
        icon={<ScanLine size={15} />}
        title={card.lastReader?.trim() ?? ''}
        sub={t('card:hist.reader')}
        fontSize={fontSize}
        empty={t('common:empty')}
      />
      <HistRow
        icon={<Clock size={15} />}
        title={card.lastAccess?.trim() ?? ''}
        sub={t('card:hist.accessTime')}
        fontSize={fontSize}
        empty={t('common:empty')}
      />
    </div>
  )
}
