import type { UseFormRegister } from 'react-hook-form'
import { Clock, Hash, Settings, Tag } from 'lucide-react'
import { Badge } from '@/components/primitive/Badge'
import { Input } from '@/components/primitive/Input'
import type { DeviceControlFormValues } from '@/pages/DeviceControlPage/formTypes'
import type { ParsedDeviceNode } from '@/pages/DeviceControlPage/utils/buildTree'
import {
  formatConnectedAt,
  isDeviceActive,
} from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type {
  InputInfo,
  ModuleInfo,
  OutputInfo,
  ReaderInfo,
  ScpInfo,
  SioInfo,
} from '@/types/api'

interface InfoTabProps {
  parsed: ParsedDeviceNode | null
  moduleInfo: ModuleInfo | null
  scp: ScpInfo | null
  sio: SioInfo | null
  reader: ReaderInfo | null
  input: InputInfo | null
  output: OutputInfo | null
  lastConnectedAt: string | null
  editMode: boolean
  register: UseFormRegister<DeviceControlFormValues>
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[12px] font-medium tracking-wide pb-1.5 mb-2"
    style={{
      color: 'var(--color-text-subtle)',
      borderBottom: '0.5px solid var(--color-border)',
    }}
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
    <span
      className="text-[12px] flex items-center gap-1.5 flex-shrink-0"
      style={{ color: 'var(--color-text-subtle)' }}
    >
      {icon}
      {label}
    </span>
    {children}
  </div>
)

const FieldValue = ({
  children,
  mono,
}: {
  children: React.ReactNode
  mono?: boolean
}) => (
  <span
    className={['text-right text-[13px]', mono ? 'font-mono' : '']
      .filter(Boolean)
      .join(' ')}
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
  name: keyof DeviceControlFormValues
  value: number
  editMode: boolean
  register: UseFormRegister<DeviceControlFormValues>
}) => (
  <FRow icon={<Hash size={12} />} label={label}>
    {editMode ? (
      <Input
        type="number"
        {...register(name, { valueAsNumber: true })}
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
  name: keyof DeviceControlFormValues
  value: string
  editMode: boolean
  register: UseFormRegister<DeviceControlFormValues>
  mono?: boolean
}) => (
  <FRow icon={<Tag size={12} />} label={label}>
    {editMode ? (
      <Input {...register(name)} style={{ width: 148 }} />
    ) : (
      <FieldValue mono={mono}>{value || '—'}</FieldValue>
    )}
  </FRow>
)

const ActiveField = ({
  active,
  editMode,
  register,
}: {
  active: number
  editMode: boolean
  register: UseFormRegister<DeviceControlFormValues>
}) => (
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
      <ActiveBadge active={active} />
    )}
  </FRow>
)

export const InfoTab = ({
  parsed,
  moduleInfo,
  scp,
  sio,
  reader,
  input,
  output,
  lastConnectedAt,
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

  if (parsed.kind === 'module') {
    return (
      <div>
        <SectionTitle>진단 모듈</SectionTitle>
        <FRow icon={<Tag size={12} />} label="모듈 유형">
          <FieldValue mono>{parsed.moduleType}</FieldValue>
        </FRow>
        <FRow icon={<Clock size={12} />} label="연결 시각">
          <FieldValue>{formatConnectedAt(moduleInfo?.connectedAt ?? '')}</FieldValue>
        </FRow>
      </div>
    )
  }

  if (parsed.kind === 'scp' && scp) {
    return (
      <div>
        <SectionTitle>주제어기 (SCP)</SectionTitle>
        <StrField
          label="이름"
          name="name"
          value={scp.name}
          editMode={editMode}
          register={register}
        />
        <ActiveField active={scp.active} editMode={editMode} register={register} />
        <StrField
          label="연결문자열"
          name="connstr"
          value={scp.connstr}
          editMode={editMode}
          register={register}
          mono
        />
        <NumField
          label="모델"
          name="model"
          value={scp.model}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="통신유형"
          name="ctype"
          value={scp.ctype}
          editMode={editMode}
          register={register}
        />
        <FRow icon={<Clock size={12} />} label="마지막 통신">
          <FieldValue>{formatConnectedAt(lastConnectedAt ?? '')}</FieldValue>
        </FRow>
        <StrField
          label="확장"
          name="ext"
          value={scp.ext}
          editMode={editMode}
          register={register}
        />
      </div>
    )
  }

  if (parsed.kind === 'sio' && sio) {
    return (
      <div>
        <SectionTitle>부제어기 (SIO)</SectionTitle>
        <StrField
          label="이름"
          name="name"
          value={sio.name}
          editMode={editMode}
          register={register}
        />
        <ActiveField active={sio.active} editMode={editMode} register={register} />
        <NumField
          label="SCP"
          name="scp"
          value={sio.scp}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="포트"
          name="port"
          value={sio.port}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="주소"
          name="addr"
          value={sio.addr}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="모델"
          name="model"
          value={sio.model}
          editMode={editMode}
          register={register}
        />
        <FRow icon={<Clock size={12} />} label="마지막 통신">
          <FieldValue>{formatConnectedAt(lastConnectedAt ?? '')}</FieldValue>
        </FRow>
        <StrField
          label="확장"
          name="ext"
          value={sio.ext}
          editMode={editMode}
          register={register}
        />
      </div>
    )
  }

  if (parsed.kind === 'reader' && reader) {
    return (
      <div>
        <SectionTitle>리더</SectionTitle>
        <StrField
          label="이름"
          name="name"
          value={reader.name}
          editMode={editMode}
          register={register}
        />
        <ActiveField active={reader.active} editMode={editMode} register={register} />
        <NumField
          label="주소"
          name="addr"
          value={reader.addr}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="SCP"
          name="scp"
          value={reader.scp}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="SIO"
          name="sio"
          value={reader.sio}
          editMode={editMode}
          register={register}
        />
      </div>
    )
  }

  if (parsed.kind === 'input' && input) {
    return (
      <div>
        <SectionTitle>입력</SectionTitle>
        <StrField
          label="이름"
          name="name"
          value={input.name}
          editMode={editMode}
          register={register}
        />
        <ActiveField active={input.active} editMode={editMode} register={register} />
        <NumField
          label="주소"
          name="addr"
          value={input.addr}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="SCP"
          name="scp"
          value={input.scp}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="SIO"
          name="sio"
          value={input.sio}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="모드"
          name="mode"
          value={input.mode}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="인터페이스"
          name="ifcode"
          value={input.ifcode}
          editMode={editMode}
          register={register}
        />
      </div>
    )
  }

  if (parsed.kind === 'output' && output) {
    return (
      <div>
        <SectionTitle>출력</SectionTitle>
        <StrField
          label="이름"
          name="name"
          value={output.name}
          editMode={editMode}
          register={register}
        />
        <ActiveField active={output.active} editMode={editMode} register={register} />
        <NumField
          label="주소"
          name="addr"
          value={output.addr}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="SCP"
          name="scp"
          value={output.scp}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="SIO"
          name="sio"
          value={output.sio}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="기본펄스"
          name="defpulse"
          value={output.defpulse}
          editMode={editMode}
          register={register}
        />
        <NumField
          label="모드"
          name="mode"
          value={output.mode}
          editMode={editMode}
          register={register}
        />
      </div>
    )
  }

  return (
    <p className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
      장치 데이터를 찾을 수 없습니다. 트리를 펼쳐 다시 시도하세요.
    </p>
  )
}
