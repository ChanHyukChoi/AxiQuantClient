import { Minus, Moon, PanelLeft, Square, Sun, X } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'
import { useState, useEffect } from 'react'

const isElectron = navigator.userAgent.includes('Electron')

/** Windows 복원(겹친 네모) 아이콘 */
const RestoreIcon = ({ size = 12 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
  >
    <rect x="3.5" y="0.5" width="8" height="8" rx="0.5" />
    <rect x="0.5" y="3.5" width="8" height="8" rx="0.5" />
  </svg>
)

interface TitleBarProps {
  onMenuClick?: () => void
}

export const TitleBar = ({ onMenuClick }: TitleBarProps = {}) => {
  const { theme, toggleTheme } = useThemeStore()
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    if (!isElectron) return

    void window.electronAPI.window.isMaximized().then(setIsMaximized)
    return window.electronAPI.window.onMaximizedChange(setIsMaximized)
  }, [])

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
      style={
        {
          backgroundColor: 'var(--color-bg)',
          height: '24px',
          WebkitAppRegion: 'drag',
          borderBottom:
            theme === 'light'
              ? '1px solid rgba(0,0,0,0.08)'
              : '1px solid rgba(255,255,255,0.06)',
        } as React.CSSProperties
      }
    >
      {/* 좌측: 패널 토글 버튼 */}
      <div
        className="flex items-center h-full"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            title="사이드바 토글"
            className="flex items-center justify-center h-full transition-colors duration-100"
            style={{
              background: 'transparent',
              color: 'var(--color-text)',
              width: '40px',
            }}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            <PanelLeft size={12} />
          </button>
        )}
      </div>

      {/* 중앙: 프로그램명 */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col">
        <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>
          AxiQuant
        </span>
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
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
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
              <Minus size={12} strokeWidth={1.5} />
            </button>

            {/* 최대화 / 이전 크기로 복원 */}
            <button
              onClick={handleMaximize}
              className="flex items-center justify-center w-12 h-full transition-colors duration-100"
              style={{ background: 'transparent', color: 'var(--color-icon)' }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              title={isMaximized ? '이전 크기로 복원' : '최대화'}
            >
              {isMaximized ? (
                <RestoreIcon size={12} />
              ) : (
                <Square size={12} strokeWidth={1.5} />
              )}
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
              <X size={12} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
