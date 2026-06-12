import { WindowRestoreIcon } from '@/components/primitive/icons/WindowRestoreIcon'
import { Minus, Square, X } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'
import { useState, useEffect } from 'react'
import { isElectronRuntime } from '@/lib/isElectronRuntime'

export const TitleBar = () => {
  if (!isElectronRuntime()) return null
  return <ElectronTitleBar />
}

const ElectronTitleBar = () => {
  const { theme } = useThemeStore()
  const [isMaximized, setIsMaximized] = useState(false)
  const electronWindow = window.electronAPI!.window

  useEffect(() => {
    void electronWindow.isMaximized().then(setIsMaximized)
    return electronWindow.onMaximizedChange(setIsMaximized)
  }, [electronWindow])

  const handleMinimize = () => {
    electronWindow.minimize()
  }

  const handleMaximize = () => {
    electronWindow.maximize()
  }

  const handleClose = () => {
    electronWindow.close()
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
      <span
        className="text-sm font-bold pl-3"
        style={{ color: 'var(--color-accent)' }}
      >
        AxiQuant
      </span>

      <div
        className="flex h-full"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
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

        <button
          onClick={handleMaximize}
          className="flex items-center justify-center w-12 h-full transition-colors duration-100"
          style={{ background: 'transparent', color: 'var(--color-icon)' }}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
          title={isMaximized ? '이전 크기로' : '최대화'}
        >
          {isMaximized ? (
            <WindowRestoreIcon size={12} />
          ) : (
            <Square size={12} strokeWidth={1.5} />
          )}
        </button>

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
      </div>
    </div>
  )
}
