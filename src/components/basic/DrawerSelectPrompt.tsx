interface DrawerSelectPromptProps {
  message: string
  hint?: string
  /** drawer 콘텐츠 영역을 채우며 세로·가로 중앙 정렬 (기본) */
  fill?: boolean
  /** 요약 헤더 등 좁은 영역 — 패딩·최소 높이 없이 문구만 */
  compact?: boolean
}

export const DrawerSelectPrompt = ({
  message,
  hint,
  fill = true,
  compact = false,
}: DrawerSelectPromptProps) => {
  const text = (
    <>
      <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
        {message}
      </p>
      {hint ? (
        <p
          className="text-[13px] max-w-sm leading-snug"
          style={{ color: 'var(--color-text-dim)' }}
        >
          {hint}
        </p>
      ) : null}
    </>
  )

  if (compact) {
    return <div className="flex flex-col items-center gap-2 text-center">{text}</div>
  }

  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-2 text-center px-4',
        fill ? 'flex-1 min-h-[160px]' : 'py-8',
      ].join(' ')}
    >
      {text}
    </div>
  )
}
