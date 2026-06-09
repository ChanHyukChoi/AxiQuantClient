import { WindowRestoreIcon } from '@/components/primitive/icons/WindowRestoreIcon'
import { Minus, PanelLeft, Square, X } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'
import { useState, useEffect } from 'react'

const isElectron = navigator.userAgent.includes('Electron')

interface TitleBarProps {
  onMenuClick?: () => void
}

export const TitleBar = ({ onMenuClick }: TitleBarProps = {}) => {
  const { theme } = useThemeStore()
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
          height: '30px',
          WebkitAppRegion: 'drag',
          borderBottom:
            theme === 'light'
              ? '1px solid rgba(0,0,0,0.08)'
              : '1px solid rgba(255,255,255,0.06)',
        } as React.CSSProperties
      }
    >
      {/* ???: ?????? ????? ????? */}
      <div
        className="flex items-center h-full"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            title="????????? ?????"
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

      {/* ?????: ??????????? */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col">
        <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>
          AxiQuant
        </span>
      </div>

      {/* ????: ????? ?????? */}
      <div
        className="flex h-full"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* ???????? ?????: Electron ????? */}
        {isElectron && (
          <>
            {/* ???????? */}
            <button
              onClick={handleMinimize}
              className="flex items-center justify-center w-12 h-full transition-colors duration-100"
              style={{ background: 'transparent', color: 'var(--color-icon)' }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              title="????????"
            >
              <Minus size={12} strokeWidth={1.5} />
            </button>

            {/* ???????? / ??? ???? ???? */}
            <button
              onClick={handleMaximize}
              className="flex items-center justify-center w-12 h-full transition-colors duration-100"
              style={{ background: 'transparent', color: 'var(--color-icon)' }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              title={isMaximized ? '??? ???? ????' : '????????'}
            >
              {isMaximized ? (
                <WindowRestoreIcon size={12} />
              ) : (
                <Square size={12} strokeWidth={1.5} />
              )}
            </button>

            {/* ???? */}
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-12 h-full transition-colors duration-100"
              style={{ background: 'transparent', color: 'var(--color-icon)' }}
              onMouseEnter={closeHoverIn}
              onMouseLeave={closeHoverOut}
              title="????"
            >
              <X size={12} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
