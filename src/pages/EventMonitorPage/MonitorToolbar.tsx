import { Activity, Pause, Play, Trash2 } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { ExportButton, PrintButton } from '@/components/page-actions'
import { Input } from '@/components/primitive/Input'
import type { ScpInfo } from '@/types/api'
import type { DatePreset } from '@/pages/EventMonitorPage/utils/dateRange'

export type MonitorMode = 'live' | 'history'
export type TypeFilter = 'all' | 'access' | 'alarm'

interface MonitorToolbarProps {
  mode: MonitorMode
  onModeChange: (mode: MonitorMode) => void
  typeFilter: TypeFilter
  onTypeFilterChange: (f: TypeFilter) => void
  paused: boolean
  onTogglePause: () => void
  onClear: () => void
  isConnected: boolean
  searchQuery: string
  onSearchChange: (q: string) => void
  scpId: number | ''
  onScpChange: (id: number | '') => void
  scps: ScpInfo[]
  datePreset: DatePreset
  onDatePresetChange: (p: DatePreset) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
  onExport: () => void
  onPrint: () => void
}

const modeBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? 'var(--color-btn-accent-bg)' : 'transparent',
  color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
  borderColor: active
    ? 'var(--color-btn-accent-border)'
    : 'var(--color-btn-default-border)',
})

const pillStyle = (active: boolean, variant: TypeFilter): React.CSSProperties => {
  if (!active) {
    return {
      background: 'transparent',
      color: 'var(--color-text-muted)',
      border: '0.5px solid var(--color-btn-default-border)',
    }
  }
  if (variant === 'access')
    return { background: '#0d2b1a', color: '#4caf7d', border: '0.5px solid #1a3d28' }
  if (variant === 'alarm')
    return { background: '#2b1616', color: '#e06060', border: '0.5px solid #3a2020' }
  return {
    background: 'var(--color-btn-accent-bg)',
    color: 'var(--color-accent)',
    border: '0.5px solid var(--color-btn-accent-border)',
  }
}

const presetBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? 'var(--color-btn-hover)' : 'transparent',
  color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
  border: '0.5px solid var(--color-btn-default-border)',
  fontSize: 11,
  padding: '3px 8px',
  borderRadius: 4,
  cursor: 'pointer',
})

export const MonitorToolbar = ({
  mode,
  onModeChange,
  typeFilter,
  onTypeFilterChange,
  paused,
  onTogglePause,
  onClear,
  isConnected,
  searchQuery,
  onSearchChange,
  scpId,
  onScpChange,
  scps,
  datePreset,
  onDatePresetChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onExport,
  onPrint,
}: MonitorToolbarProps) => {
  const receiving = mode === 'live' && isConnected && !paused

  return (
    <div
      className="flex flex-col flex-shrink-0"
      style={{
        background: 'var(--color-sidebar)',
        borderBottom: '0.5px solid var(--color-border)',
      }}
    >
      <div className="flex items-center gap-3 px-3" style={{ height: 42, minHeight: 42 }}>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Activity style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span
            className="text-[13px] font-medium"
            style={{ color: 'var(--color-text)' }}
          >
            이벤트 모니터
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            style={modeBtnStyle(mode === 'live')}
            onClick={() => onModeChange('live')}
          >
            실시간
          </Button>
          <Button
            size="sm"
            style={modeBtnStyle(mode === 'history')}
            onClick={() => onModeChange('history')}
          >
            이력 조회
          </Button>
        </div>

        {mode === 'live' && (
          <div
            className="flex items-center gap-1.5 text-[11px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block rounded-full"
              style={{
                width: 8,
                height: 8,
                background: receiving ? '#4caf7d' : 'var(--color-text-dim)',
                animation: receiving ? 'evt-pulse 1.2s ease-in-out infinite' : undefined,
              }}
            />
            {receiving ? '수신 중' : paused ? '일시정지' : '대기'}
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          {mode === 'live' ? (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={onTogglePause}
                leftIcon={paused ? <Play size={14} /> : <Pause size={14} />}
                title={paused ? '재개' : '일시정지'}
              />
              <Button
                size="sm"
                variant="default"
                onClick={onClear}
                leftIcon={<Trash2 size={14} />}
                title="초기화"
              />
            </>
          ) : (
            <>
              <ExportButton size="sm" showLabel={false} onClick={onExport} />
              <PrintButton size="sm" showLabel={false} onClick={onPrint} />
            </>
          )}
        </div>
      </div>

      <div
        className="flex items-center gap-2 px-3 flex-wrap"
        style={{ minHeight: 38, paddingBottom: 8, paddingTop: 4 }}
      >
        {(['all', 'access', 'alarm'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onTypeFilterChange(f)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={pillStyle(typeFilter === f, f)}
          >
            {f === 'all' ? '전체' : f === 'access' ? '출입' : '경보'}
          </button>
        ))}

        {mode === 'history' && (
          <>
            {(
              [
                ['today', '오늘'],
                ['7d', '최근 7일'],
                ['30d', '최근 30일'],
                ['180d', '최근 180일'],
              ] as const
            ).map(([p, label]) => (
              <button
                key={p}
                type="button"
                style={presetBtnStyle(datePreset === p)}
                onClick={() => onDatePresetChange(p)}
              >
                {label}
              </button>
            ))}
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                onDatePresetChange('custom')
                onDateFromChange(e.target.value)
              }}
              className="text-[11px] px-1.5 py-1 rounded"
              style={{
                background: 'var(--color-btn-hover)',
                border: '0.5px solid var(--color-btn-default-border)',
                color: 'var(--color-text)',
              }}
            />
            <span className="text-[11px]" style={{ color: 'var(--color-text-dim)' }}>
              ~
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                onDatePresetChange('custom')
                onDateToChange(e.target.value)
              }}
              className="text-[11px] px-1.5 py-1 rounded"
              style={{
                background: 'var(--color-btn-hover)',
                border: '0.5px solid var(--color-btn-default-border)',
                color: 'var(--color-text)',
              }}
            />
          </>
        )}

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <Input
            placeholder="이벤트, 카드번호, 장치 검색"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-[220px] text-[12px]"
          />
          <select
            value={scpId === '' ? '' : String(scpId)}
            onChange={(e) => {
              const v = e.target.value
              onScpChange(v === '' ? '' : Number(v))
            }}
            className="text-[12px] px-2 py-1.5 rounded min-w-[120px]"
            style={{
              background: 'var(--color-btn-hover)',
              border: '0.5px solid var(--color-btn-default-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="">제어기 전체</option>
            {scps.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <style>{`@keyframes evt-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
    </div>
  )
}
