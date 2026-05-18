import { Users } from 'lucide-react'

export const AreaOccupantsTab = () => (
  <div
    className="flex flex-col items-center justify-center py-10 gap-2"
    style={{ color: 'var(--color-text-subtle)' }}
  >
    <Users size={24} strokeWidth={1.5} style={{ opacity: 0.5 }} />
    <p className="text-[12px]">점유 인원 — 준비 중</p>
    <p className="text-[11px] text-center max-w-[200px]" style={{ color: 'var(--color-text-dim)' }}>
      추후 실시간 SSE 연동이 추가될 예정입니다.
    </p>
  </div>
)
