import { ScanLine } from 'lucide-react'

export const AreaReadersTab = () => (
  <div
    className="flex flex-col items-center justify-center py-10 gap-2"
    style={{ color: 'var(--color-text-subtle)' }}
  >
    <ScanLine size={24} strokeWidth={1.5} style={{ opacity: 0.5 }} />
    <p className="text-[12px]">연결 리더 — 준비 중</p>
    <p className="text-[11px] text-center max-w-[200px]" style={{ color: 'var(--color-text-dim)' }}>
      추후 리더 연결/해제 기능이 추가될 예정입니다.
    </p>
  </div>
)
