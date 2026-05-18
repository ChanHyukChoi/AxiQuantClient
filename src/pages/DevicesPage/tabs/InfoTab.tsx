import type { UseFormRegister } from 'react-hook-form'
import { Hash, Settings, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import type { ParsedDeviceNode } from '@/pages/DevicesPage/utils/buildTree'
import { isDeviceActive } from '@/pages/DevicesPage/utils/deviceHelpers'
import type { InputInfo, OutputInfo, ReaderInfo, ScpInfo, SioInfo } from '@/types/api'

import type { DeviceFormValues } from '@/pages/DevicesPage/formTypes'

interface InfoTabProps {
  parsed: ParsedDeviceNode | null
  scp: ScpInfo | null
  sio: SioInfo | null
  reader: ReaderInfo | null
  input: InputInfo | null
  output: OutputInfo | null
  editMode: boolean
  register: UseFormRegister<DeviceFormValues>
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[12px] font-medium tracking-wide pb-1.5 mb-2"
    style={{ color: 'var(--color-text-subtle)', borderBottom: '0.5px solid var(--color-border)' }}
  >
    {children}
  </p>
)

const FRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) => (
  <div className="flex justify-between items-center py-1 gap-2">
    <span className="text-[12px] flex items-center gap-1.5 flex-shrink-0" style={{ color: 'var(--color-text-subtle)' }}>
      {icon}
      {label}
    </span>
    {children}
  </div>
)

const FieldValue = ({ children, mono }: { children: React.ReactNode; mono?: boolean }) => (
  <span
    className={['text-right text-[13px]', mono ? 'font-mono' : ''].filter(Boolean).join(' ')}
    style={{ color: 'var(--color-text)' }}
  >
    {children}
  </span>
)

const ActiveBadge = ({ active }: { active: number }) => (
  <Badge variant={isDeviceActive(active) ? 'on' : 'off'}>
    {isDeviceActive(active) ? '활성' : '비활성'}
  </Badge>
)

const NumField = ({
  label,
  name,
  value,
  editMode,
  register,
}: {
  label: string
  name: string
  value: number
  editMode: boolean
  register: UseFormRegister<DeviceFormValues>
}) => (
  <FRow icon={<Hash size={12} />} label={label}>
    {editMode ? (
      <Input
        type="number"
        {...register(name as keyof DeviceFormValues, { valueAsNumber: true })}
        style={{ width: 100 }}
      />
    ) : (
      <FieldValue mono>{value}</FieldValue>
    )}
  </FRow>
)

const StrField = ({
  label,
  name,
  value,
  editMode,
  register,
  mono,
}: {
  label: string
  name: string
  value: string
  editMode: boolean
  register: UseFormRegister<DeviceFormValues>
  mono?: boolean
}) => (
  <FRow icon={<Tag size={12} />} label={label}>
    {editMode ? (
      <Input {...register(name as keyof DeviceFormValues)} style={{ width: 148 }} />
    ) : (
      <FieldValue mono={mono}>{value || '—'}</FieldValue>
    )}
  </FRow>
)

export const InfoTab = ({
  parsed,
  scp,
  sio,
  reader,
  input,
  output,
  editMode,
  register,
}: InfoTabProps) => {
  if (!parsed) {
    return (
      <p className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        트리에서 장치를 선택하세요.
      </p>
    )
  }

  if (parsed.kind === 'scp' && scp) {
    return (
      <div>
        <SectionTitle>주제어기 (SCP)</SectionTitle>
        <StrField label="이름" name="name" value={scp.name} editMode={editMode} register={register} />
        <FRow icon={<Settings size={12} />} label="활성">
          {editMode ? (
            <select
              {...register('active', { valueAsNumber: true })}
              className="text-[12px] px-2 py-1 rounded border outline-none"
              style={{
                width: 100,
                background: 'var(--color-btn-hover)',
                borderColor: 'var(--color-btn-default-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value={1}>활성</option>
              <option value={0}>비활성</option>
            </select>
          ) : (
            <ActiveBadge active={scp.active} />
          )}
        </FRow>
        <StrField label="연결문자열" name="connstr" value={scp.connstr} editMode={editMode} register={register} mono />
        <NumField label="모델" name="model" value={scp.model} editMode={editMode} register={register} />
        <NumField label="통신유형" name="ctype" value={scp.ctype} editMode={editMode} register={register} />
        <StrField label="확장" name="ext" value={scp.ext} editMode={editMode} register={register} />
      </div>
    )
  }

  if (parsed.kind === 'sio' && sio) {
    return (
      <div>
        <SectionTitle>부제어기 (SIO)</SectionTitle>
        <StrField label="이름" name="name" value={sio.name} editMode={editMode} register={register} />
        <FRow icon={<Settings size={12} />} label="활성">
          {editMode ? (
            <select
              {...register('active', { valueAsNumber: true })}
              className="text-[12px] px-2 py-1 rounded border outline-none"
              style={{
                width: 100,
                background: 'var(--color-btn-hover)',
                borderColor: 'var(--color-btn-default-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value={1}>활성</option>
              <option value={0}>비활성</option>
            </select>
          ) : (
            <ActiveBadge active={sio.active} />
          )}
        </FRow>
        <NumField label="SCP" name="scp" value={sio.scp} editMode={editMode} register={register} />
        <NumField label="포트" name="port" value={sio.port} editMode={editMode} register={register} />
        <NumField label="주소" name="addr" value={sio.addr} editMode={editMode} register={register} />
        <NumField label="모델" name="model" value={sio.model} editMode={editMode} register={register} />
        <StrField label="확장" name="ext" value={sio.ext} editMode={editMode} register={register} />
      </div>
    )
  }

  if (parsed.kind === 'reader' && reader) {
    return (
      <div>
        <SectionTitle>리더</SectionTitle>
        <StrField label="이름" name="name" value={reader.name} editMode={editMode} register={register} />
        <FRow icon={<Settings size={12} />} label="활성">
          {editMode ? (
            <select
              {...register('active', { valueAsNumber: true })}
              className="text-[12px] px-2 py-1 rounded border outline-none"
              style={{
                width: 100,
                background: 'var(--color-btn-hover)',
                borderColor: 'var(--color-btn-default-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value={1}>활성</option>
              <option value={0}>비활성</option>
            </select>
          ) : (
            <ActiveBadge active={reader.active} />
          )}
        </FRow>
        <NumField label="SCP" name="scp" value={reader.scp} editMode={editMode} register={register} />
        <NumField label="SIO" name="sio" value={reader.sio} editMode={editMode} register={register} />
        <NumField label="주소" name="addr" value={reader.addr} editMode={editMode} register={register} />
        <NumField label="카드포맷" name="cdfmt" value={reader.cdfmt} editMode={editMode} register={register} />
        <NumField label="키패드모드" name="kpadmode" value={reader.kpadmode} editMode={editMode} register={register} />
        <NumField label="LED모드" name="ledmode" value={reader.ledmode} editMode={editMode} register={register} />
        <NumField label="OSDP플래그" name="osdpflag" value={reader.osdpflag} editMode={editMode} register={register} />
        <NumField label="APB모드" name="apbmode" value={reader.apbmode} editMode={editMode} register={register} />
        <StrField label="확장" name="ext" value={reader.ext} editMode={editMode} register={register} />
        <StrField label="인자" name="args" value={reader.args} editMode={editMode} register={register} />
      </div>
    )
  }

  if (parsed.kind === 'input' && input) {
    return (
      <div>
        <SectionTitle>입력</SectionTitle>
        <StrField label="이름" name="name" value={input.name} editMode={editMode} register={register} />
        <FRow icon={<Settings size={12} />} label="활성">
          {editMode ? (
            <select
              {...register('active', { valueAsNumber: true })}
              className="text-[12px] px-2 py-1 rounded border outline-none"
              style={{
                width: 100,
                background: 'var(--color-btn-hover)',
                borderColor: 'var(--color-btn-default-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value={1}>활성</option>
              <option value={0}>비활성</option>
            </select>
          ) : (
            <ActiveBadge active={input.active} />
          )}
        </FRow>
        <NumField label="SCP" name="scp" value={input.scp} editMode={editMode} register={register} />
        <NumField label="SIO" name="sio" value={input.sio} editMode={editMode} register={register} />
        <NumField label="주소" name="addr" value={input.addr} editMode={editMode} register={register} />
        <NumField label="인터페이스" name="ifcode" value={input.ifcode} editMode={editMode} register={register} />
        <NumField label="모드" name="mode" value={input.mode} editMode={editMode} register={register} />
        <NumField label="진입지연" name="delayentry" value={input.delayentry} editMode={editMode} register={register} />
        <NumField label="퇴출지연" name="delayexit" value={input.delayexit} editMode={editMode} register={register} />
        <StrField label="확장" name="ext" value={input.ext} editMode={editMode} register={register} />
      </div>
    )
  }

  if (parsed.kind === 'output' && output) {
    return (
      <div>
        <SectionTitle>출력</SectionTitle>
        <StrField label="이름" name="name" value={output.name} editMode={editMode} register={register} />
        <FRow icon={<Settings size={12} />} label="활성">
          {editMode ? (
            <select
              {...register('active', { valueAsNumber: true })}
              className="text-[12px] px-2 py-1 rounded border outline-none"
              style={{
                width: 100,
                background: 'var(--color-btn-hover)',
                borderColor: 'var(--color-btn-default-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value={1}>활성</option>
              <option value={0}>비활성</option>
            </select>
          ) : (
            <ActiveBadge active={output.active} />
          )}
        </FRow>
        <NumField label="SCP" name="scp" value={output.scp} editMode={editMode} register={register} />
        <NumField label="SIO" name="sio" value={output.sio} editMode={editMode} register={register} />
        <NumField label="주소" name="addr" value={output.addr} editMode={editMode} register={register} />
        <NumField label="기본펄스" name="defpulse" value={output.defpulse} editMode={editMode} register={register} />
        <NumField label="모드" name="mode" value={output.mode} editMode={editMode} register={register} />
        <StrField label="확장" name="ext" value={output.ext} editMode={editMode} register={register} />
      </div>
    )
  }

  return (
    <p className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
      장치 데이터를 찾을 수 없습니다. 트리를 펼쳐 다시 시도하세요.
    </p>
  )
}
