import { Bell, DoorOpen, Lock, ToggleLeft, ToggleRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useControlOutput, useControlReader } from '@/hooks/useDeviceControl'
import type { ParsedDeviceNode } from '@/pages/DeviceControlPage/utils/buildTree'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import { useToastStore } from '@/stores/toastStore'
import type { InputInfo, OutputControlAction, ReaderControlAction, ReaderInfo } from '@/types/api'

interface ControlTabProps {
  parsed: ParsedDeviceNode | null
  reader: ReaderInfo | null
  input: InputInfo | null
}

const ControlButton = ({
  label,
  icon,
  color,
  loading,
  disabled,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  color: string
  loading: boolean
  disabled: boolean
  onClick: () => void
}) => (
  <Button
    variant="default"
    size="md"
    className="w-full justify-center py-3"
    leftIcon={icon}
    loading={loading}
    disabled={disabled}
    onClick={onClick}
    style={{
      background: color,
      color: '#fff',
      borderColor: color,
    }}
  >
    {label}
  </Button>
)

export const ControlTab = ({ parsed, reader, input }: ControlTabProps) => {
  const showToast = useToastStore((s) => s.show)

  const scpId =
    parsed?.kind === 'reader'
      ? parsed.standalone
        ? (reader?.scp ?? 0)
        : parsed.scpId
      : parsed && parsed.kind !== 'module'
        ? parsed.scpId
        : 0
  const readerId = parsed?.kind === 'reader' ? parsed.entityId : 0
  const outputId = parsed?.kind === 'output' ? parsed.entityId : 0

  const readerControl = useControlReader(scpId, readerId)
  const outputControl = useControlOutput(scpId, outputId)

  const runReaderAction = async (action: ReaderControlAction, label: string) => {
    if (scpId <= 0 || readerId <= 0) return
    const ok = await readerControl.mutateAsync(action)
    if (ok) showToast(`${label} 명령을 전송했습니다.`, 'success')
    else showToast(`${label} 명령 전송에 실패했습니다.`, 'error')
  }

  const runOutputAction = async (action: OutputControlAction, label: string) => {
    if (scpId <= 0 || outputId <= 0) return
    const ok = await outputControl.mutateAsync(action)
    if (ok) showToast(`${label} 명령을 전송했습니다.`, 'success')
    else showToast(`${label} 명령 전송에 실패했습니다.`, 'error')
  }

  if (!parsed) {
    return (
      <p className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        제어할 장치를 선택하세요.
      </p>
    )
  }

  if (parsed.kind === 'reader') {
    const busy = readerControl.isPending
    return (
      <div className="flex flex-col gap-3 max-w-md">
        <ControlButton
          label="Open"
          icon={<DoorOpen size={16} />}
          color="#4caf7d"
          loading={busy}
          disabled={busy || scpId <= 0}
          onClick={() => void runReaderAction('open', 'Open')}
        />
        <ControlButton
          label="Lock"
          icon={<Lock size={16} />}
          color="#4f9cf9"
          loading={busy}
          disabled={busy || scpId <= 0}
          onClick={() => void runReaderAction('lock', 'Lock')}
        />
        <ControlButton
          label="Alarm"
          icon={<Bell size={16} />}
          color="#e06060"
          loading={busy}
          disabled={busy || scpId <= 0}
          onClick={() => void runReaderAction('alarm', 'Alarm')}
        />
      </div>
    )
  }

  if (parsed.kind === 'input') {
    return (
      <div className="flex flex-col gap-4 max-w-md">
        <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
          입력 장치는 직접 제어를 지원하지 않습니다.
        </p>
        {input ? (
          <div
            className="rounded-md px-3 py-2.5"
            style={{ border: '0.5px solid var(--color-border)', background: 'var(--color-btn-hover)' }}
          >
            <p className="text-[12px] mb-1" style={{ color: 'var(--color-text-subtle)' }}>
              현재 상태
            </p>
            <p className="text-[13px]" style={{ color: 'var(--color-text)' }}>
              {isDeviceActive(input.active) ? '활성' : '비활성'} · 모드 {input.mode}
            </p>
          </div>
        ) : null}
      </div>
    )
  }

  if (parsed.kind === 'output') {
    const busy = outputControl.isPending
    return (
      <div className="flex flex-col gap-3 max-w-md">
        <ControlButton
          label="Pulse"
          icon={<Zap size={16} />}
          color="#4f9cf9"
          loading={busy}
          disabled={busy || scpId <= 0}
          onClick={() => void runOutputAction('pulse', 'Pulse')}
        />
        <ControlButton
          label="On"
          icon={<ToggleRight size={16} />}
          color="#4caf7d"
          loading={busy}
          disabled={busy || scpId <= 0}
          onClick={() => void runOutputAction('on', 'On')}
        />
        <ControlButton
          label="Off"
          icon={<ToggleLeft size={16} />}
          color="#6b7280"
          loading={busy}
          disabled={busy || scpId <= 0}
          onClick={() => void runOutputAction('off', 'Off')}
        />
      </div>
    )
  }

  return (
    <p className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
      이 장치 유형은 수동 제어를 지원하지 않습니다.
    </p>
  )
}
