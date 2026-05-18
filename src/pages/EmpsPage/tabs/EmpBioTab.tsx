import { Fingerprint } from 'lucide-react'

export const EmpBioTab = () => (
  <div className="flex flex-col items-center justify-center py-8 gap-2">
    <Fingerprint size={32} style={{ color: 'var(--color-border)' }} />
    <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
      바이오 기능 준비 중
    </span>
  </div>
)
