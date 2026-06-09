import { Activity, FileCheck, HardDrive, Server, Shield, User } from 'lucide-react'
import { useStatusBar } from '@/hooks/ui/useStatusBar'

const STATUS_BAR_HEIGHT = 24

interface ConnectionBadgeProps {
  connected: boolean
  label: string
  icon: React.ReactNode
}

const ConnectionBadge = ({ connected, label, icon }: ConnectionBadgeProps) => {
  const statusColor = connected ? 'var(--color-status-normal)' : 'var(--color-status-alarm)'

  return (
    <span className="inline-flex items-center gap-1 shrink-0 text-[12px] leading-none">
      <span style={{ color: statusColor }}>{icon}</span>
      <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <span
        className="rounded-full shrink-0"
        style={{ width: 6, height: 6, backgroundColor: statusColor }}
      />
      <span className="font-medium" style={{ color: statusColor }}>
        {connected ? 'CONNECTED' : 'DISCONNECTED'}
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
  <span className="inline-flex items-center gap-1.5 shrink-0 text-[12px] leading-none" style={{ color }}>
    {icon}
    <span>{children}</span>
  </span>
)

export const StatusBar = () => {
  const { apiConnected, sseConnected, memoryLabel, loginId, roleLabel, license, licenseReady } =
    useStatusBar()

  const licenseValid = license?.valid ?? apiConnected
  const licenseLabel = licenseReady && license ? '라이선스 확인' : apiConnected ? '라이선스 확인' : '라이선스 미확인'

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
      />
      <ConnectionBadge
        connected={sseConnected}
        label="이벤트"
        icon={<Activity size={12} strokeWidth={2} />}
      />

      <StatusItem icon={<HardDrive size={12} style={{ color: 'var(--color-icon)' }} />}>
        {memoryLabel}
      </StatusItem>

      <StatusItem icon={<User size={12} style={{ color: 'var(--color-icon)' }} />}>{loginId}</StatusItem>

      <StatusItem icon={<Shield size={12} style={{ color: 'var(--color-icon)' }} />}>{roleLabel}</StatusItem>

      <StatusItem
        icon={<FileCheck size={12} style={{ color: licenseValid ? 'var(--color-status-normal)' : 'var(--color-status-alarm)' }} />}
        color={licenseValid ? 'var(--color-status-normal)' : 'var(--color-status-alarm)'}
      >
        {licenseLabel}
      </StatusItem>

      {license ? (
        <>
          <span className="text-[12px] leading-none shrink-0" style={{ color: 'var(--color-text)' }}>
            Key ID : {license.keyId}
          </span>
          <span className="text-[12px] leading-none shrink-0" style={{ color: 'var(--color-text)' }}>
            Max Reader : {license.maxReader}
          </span>
          <span className="text-[12px] leading-none shrink-0" style={{ color: 'var(--color-text)' }}>
            Max Client : {license.maxClient}
          </span>
          <span className="text-[12px] leading-none shrink-0" style={{ color: 'var(--color-text)' }}>
            Max Map : {license.maxMap}
          </span>
        </>
      ) : null}
    </footer>
  )
}
