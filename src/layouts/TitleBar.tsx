import { useThemeStore } from '../stores/themeStore'

const isElectron = navigator.userAgent.includes('Electron')

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
    <line x1="12" y1="2"    x2="12" y2="6" />
    <line x1="12" y1="18"   x2="12" y2="22" />
    <line x1="2"  y1="12"   x2="6"  y2="12" />
    <line x1="18" y1="12"   x2="22" y2="12" />
    <line x1="4.93"  y1="4.93"  x2="7.76"  y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="4.93"  y1="19.07" x2="7.76"  y2="16.24" />
    <line x1="16.24" y1="7.76"  x2="19.07" y2="4.93" />
  </svg>
)

export const TitleBar = () => {
  const { theme, toggleTheme } = useThemeStore()

  const handleMinimize = () => {
    if (isElectron) window.electronAPI.window.minimize()
  }

  const handleMaximize = () => {
    if (isElectron) window.electronAPI.window.maximize()
  }

  const handleClose = () => {
    if (isElectron) window.electronAPI.window.close()
  }

  const hoverIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--color-btn-hover)'
  }

  const hoverOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent'
  }

  const closeHoverIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#e81123'
    e.currentTarget.style.color = '#ffffff'
  }

  const closeHoverOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent'
    e.currentTarget.style.color = 'var(--color-icon)'
  }

  return (
    <div
      className="flex items-center justify-between select-none shrink-0"
      style={{
        backgroundColor: 'var(--color-bg)',
        height: '40px',
        WebkitAppRegion: 'drag',
        borderBottom: theme === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
      } as React.CSSProperties}
    >
      {/* 좌측: 로고 */}
      <div
        className="pl-4 text-base font-bold"
        style={{ color: 'var(--color-accent)' }}
      >
        AxiQuant
      </div>

      {/* 중앙: 앱 이름 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-xs"
        style={{ color: 'var(--color-text-muted)' }}
      >
        출입 관제 시스템
      </div>

      {/* 우측: 버튼 영역 */}
      <div
        className="flex h-full"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* 테마 토글 */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-12 h-full transition-colors duration-100"
          style={{ background: 'transparent', color: 'var(--color-icon)' }}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
          title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* 윈도우 컨트롤: Electron 전용 */}
        {isElectron && (
          <>
            {/* 최소화 */}
            <button
              onClick={handleMinimize}
              className="flex items-center justify-center w-12 h-full transition-colors duration-100"
              style={{ background: 'transparent', color: 'var(--color-icon)' }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              title="최소화"
            >
              <svg width="10" height="1" viewBox="0 0 10 1" fill="none">
                <rect width="10" height="1" fill="currentColor" />
              </svg>
            </button>

            {/* 최대화 */}
            <button
              onClick={handleMaximize}
              className="flex items-center justify-center w-12 h-full transition-colors duration-100"
              style={{ background: 'transparent', color: 'var(--color-icon)' }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              title="최대화"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect
                  x="0.5"
                  y="0.5"
                  width="9"
                  height="9"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </button>

            {/* 닫기 */}
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-12 h-full transition-colors duration-100"
              style={{ background: 'transparent', color: 'var(--color-icon)' }}
              onMouseEnter={closeHoverIn}
              onMouseLeave={closeHoverOut}
              title="닫기"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <line
                  x1="0.5" y1="0.5" x2="9.5" y2="9.5"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                />
                <line
                  x1="9.5" y1="0.5" x2="0.5" y2="9.5"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
