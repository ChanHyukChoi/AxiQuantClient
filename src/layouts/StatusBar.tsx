import { Activity, FileCheck, HardDrive, Moon, Server, Shield, Sun, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useStatusBar } from '@/hooks/ui/useStatusBar'
import { useThemeStore } from '@/stores/themeStore'

const STATUS_BAR_HEIGHT = 28

interface ConnectionBadgeProps {
  connected: boolean
  label: string
  icon: React.ReactNode
  connectedText: string
  disconnectedText: string
}

const ConnectionBadge = ({
  connected,
  label,
  icon,
  connectedText,
  disconnectedText,
}: ConnectionBadgeProps) => {
  const statusColor = connected ? 'var(--color-status-normal)' : 'var(--color-status-alarm)'

  return (
    <span className="inline-flex items-center gap-1 shrink-0 text-[14px] leading-none">
      <span style={{ color: statusColor }}>{icon}</span>
      <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <span
        className="rounded-full shrink-0"
        style={{ width: 6, height: 6, backgroundColor: statusColor }}
      />
      <span className="font-medium" style={{ color: statusColor }}>
        {connected ? connectedText : disconnectedText}
      </span>
    </span>
  )
}

interface StatusItemProps {
  icon: React.ReactNode
  children: React.ReactNode
  color?: string
}

const StatusItem = ({ icon, children, color = 'var(--color-text)' }: StatusItemProps) => (
  <span className="inline-flex items-center gap-1.5 shrink-0 text-[14px] leading-none" style={{ color }}>
    {icon}
    <span>{children}</span>
  </span>
)

export const StatusBar = () => {
  const { t } = useTranslation(['layout', 'common'])
  const { theme, toggleTheme } = useThemeStore()
  const { apiConnected, sseConnected, memoryLabel, loginId, roleLabel, license, licenseReady } =
    useStatusBar()

  const licenseValid = license?.valid ?? apiConnected
  const licenseLabel =
    licenseReady && license
      ? t('layout:statusBar.licenseVerified')
      : apiConnected
        ? t('layout:statusBar.licenseVerified')
        : t('layout:statusBar.licenseUnverified')

  return (
    <footer
      className="flex items-center gap-4 px-3 shrink-0 select-none overflow-hidden"
      style={{
        height: STATUS_BAR_HEIGHT,
        minHeight: STATUS_BAR_HEIGHT,
        backgroundColor: 'var(--color-sidebar)',
        borderTop: '0.5px solid var(--color-border)',
      }}
    >
      <ConnectionBadge
        connected={apiConnected}
        label="API"
        icon={<Server size={12} strokeWidth={2} />}
        connectedText={t('layout:statusBar.connected')}
        disconnectedText={t('layout:statusBar.disconnected')}
      />
      <ConnectionBadge
        connected={sseConnected}
        label={t('layout:statusBar.events')}
        icon={<Activity size={12} strokeWidth={2} />}
        connectedText={t('layout:statusBar.connected')}
        disconnectedText={t('layout:statusBar.disconnected')}
      />

      <StatusItem icon={<HardDrive size={12} style={{ color: 'var(--color-icon)' }} />}>
        {memoryLabel}
      </StatusItem>

      <StatusItem icon={<User size={12} style={{ color: 'var(--color-icon)' }} />}>{loginId}</StatusItem>

      <StatusItem icon={<Shield size={12} style={{ color: 'var(--color-icon)' }} />}>{roleLabel}</StatusItem>

      <StatusItem
        icon={
          <FileCheck
            size={12}
            style={{ color: licenseValid ? 'var(--color-status-normal)' : 'var(--color-status-alarm)' }}
          />
        }
        color={licenseValid ? 'var(--color-status-normal)' : 'var(--color-status-alarm)'}
      >
        {licenseLabel}
      </StatusItem>

      {license ? (
        <>
          <span className="text-[14px] leading-none shrink-0" style={{ color: 'var(--color-text)' }}>
            {t('layout:statusBar.keyId')} : {license.keyId}
          </span>
          <span className="text-[14px] leading-none shrink-0" style={{ color: 'var(--color-text)' }}>
            {t('layout:statusBar.maxReader')} : {license.maxReader}
          </span>
          <span className="text-[14px] leading-none shrink-0" style={{ color: 'var(--color-text)' }}>
            {t('layout:statusBar.maxClient')} : {license.maxClient}
          </span>
          <span className="text-[14px] leading-none shrink-0" style={{ color: 'var(--color-text)' }}>
            {t('layout:statusBar.maxMap')} : {license.maxMap}
          </span>
        </>
      ) : null}

      <button
        type="button"
        onClick={toggleTheme}
        className="ml-auto inline-flex items-center justify-center shrink-0 rounded transition-colors duration-100"
        style={{
          width: 22,
          height: 22,
          color: 'var(--color-icon)',
          background: 'transparent',
        }}
        title={
          theme === 'dark' ? t('layout:statusBar.themeToLight') : t('layout:statusBar.themeToDark')
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-btn-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {theme === 'dark' ? <Moon size={14} strokeWidth={2} /> : <Sun size={14} strokeWidth={2} />}
      </button>
    </footer>
  )
}
