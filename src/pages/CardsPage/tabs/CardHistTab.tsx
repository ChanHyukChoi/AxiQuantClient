import { Clock, Cpu, ScanLine } from 'lucide-react'
import { SectionTitle } from '@/pages/CardsPage/components/CardFieldUi'
import type { CardRow } from '@/pages/CardsPage/utils/cardPageHelpers'

interface CardHistTabProps {
  card: CardRow
}

const HistRow = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
  <div className="flex items-start gap-2 py-1.5 border-b border-[#21252b]">
    <span className="text-[#3a3f4a] mt-0.5 flex-shrink-0">{icon}</span>
    <div className="min-w-0 flex-1">
      <p className="text-[12px]" style={{ color: 'var(--color-text)' }}>
        {title || '—'}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: '#555a63' }}>
        {sub}
      </p>
    </div>
  </div>
)

export const CardHistTab = ({ card }: CardHistTabProps) => (
  <div>
    <SectionTitle>마지막 접근</SectionTitle>
    <HistRow icon={<Cpu size={14} />} title={card.lastCtrl?.trim() ?? '—'} sub="주 제어기" />
    <HistRow icon={<ScanLine size={14} />} title={card.lastReader?.trim() ?? '—'} sub="리더" />
    <HistRow icon={<Clock size={14} />} title={card.lastAccess?.trim() ?? '—'} sub="접근 일시" />
  </div>
)
