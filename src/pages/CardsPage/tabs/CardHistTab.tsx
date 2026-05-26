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
}: {
  icon: React.ReactNode
  title: string
  sub: string
  fontSize: number
}) => (
  <div className="flex items-start gap-2 py-1.5 border-b border-[#21252b]">
    <span className="text-[#3a3f4a] mt-0.5 flex-shrink-0">{icon}</span>
    <div className="min-w-0 flex-1">
      <p style={{ color: 'var(--color-text)', fontSize }}>{title || '—'}</p>
      <p style={{ color: '#555a63', fontSize }}>{sub}</p>
    </div>
  </div>
)

export const CardHistTab = ({ card, fontSize = 15 }: CardHistTabProps) => (
  <div>
    <SectionTitle fontSize={fontSize}>마지막 접근</SectionTitle>
    <HistRow
      icon={<Cpu size={15} />}
      title={card.lastCtrl?.trim() ?? '—'}
      sub="주 제어기"
      fontSize={fontSize}
    />
    <HistRow
      icon={<ScanLine size={15} />}
      title={card.lastReader?.trim() ?? '—'}
      sub="리더"
      fontSize={fontSize}
    />
    <HistRow
      icon={<Clock size={15} />}
      title={card.lastAccess?.trim() ?? '—'}
      sub="접근 일시"
      fontSize={fontSize}
    />
  </div>
)
