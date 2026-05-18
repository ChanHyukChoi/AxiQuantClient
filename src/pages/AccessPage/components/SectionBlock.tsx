interface SectionBlockProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

export const SectionBlock = ({ icon, title, children }: SectionBlockProps) => (
  <div className="mb-5">
    <div className="flex items-center gap-1.5 mb-2">
      <span style={{ color: 'var(--color-text-subtle)' }}>{icon}</span>
      <span className="text-[12px] font-medium" style={{ color: 'var(--color-text)' }}>
        {title}
      </span>
    </div>
    {children}
  </div>
)
