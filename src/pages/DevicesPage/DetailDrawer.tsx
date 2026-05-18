import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Activity, Check, Info, Layers, Pencil, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ChildrenTab } from '@/pages/DevicesPage/tabs/ChildrenTab'
import type { DeviceFormValues } from '@/pages/DevicesPage/formTypes'
import { InfoTab } from '@/pages/DevicesPage/tabs/InfoTab'
import type { ParsedDeviceNode } from '@/pages/DevicesPage/utils/buildTree'
import type { ScpChildData } from '@/pages/DevicesPage/utils/buildTree'
import {
  DEVICE_ICON_COLORS,
  DEVICE_ICONS,
  entityLabel,
  isDeviceActive,
} from '@/pages/DevicesPage/utils/deviceHelpers'
import {
  useDeleteInput,
  useDeleteOutput,
  useDeleteReader,
  useDeleteScp,
  useDeleteSio,
  useUpdateInput,
  useUpdateOutput,
  useUpdateReader,
  useUpdateScp,
  useUpdateSio,
} from '@/hooks/useDevices'
import type { InputInfo, OutputInfo, ReaderInfo, ScpInfo, SioInfo } from '@/types/api'

interface DetailDrawerProps {
  selectedKey: string | null
  parsed: ParsedDeviceNode | null
  scp: ScpInfo | null
  sio: SioInfo | null
  reader: ReaderInfo | null
  input: InputInfo | null
  output: OutputInfo | null
  childData: ScpChildData | undefined
  childLoading: boolean
  scpNameMap: Record<number, string>
}

const emptyForm: DeviceFormValues = { name: '', active: 0 }

const scpToForm = (s: ScpInfo): DeviceFormValues => ({
  name: s.name,
  active: s.active,
  connstr: s.connstr,
  model: s.model,
  ctype: s.ctype,
  ext: s.ext,
})

const sioToForm = (s: SioInfo): DeviceFormValues => ({
  name: s.name,
  active: s.active,
  scp: s.scp,
  port: s.port,
  addr: s.addr,
  model: s.model,
  ext: s.ext,
})

const readerToForm = (r: ReaderInfo): DeviceFormValues => ({
  name: r.name,
  active: r.active,
  scp: r.scp,
  sio: r.sio,
  addr: r.addr,
  cdfmt: r.cdfmt,
  kpadmode: r.kpadmode,
  ledmode: r.ledmode,
  osdpflag: r.osdpflag,
  apbmode: r.apbmode,
  ext: r.ext,
  args: r.args,
})

const inputToForm = (i: InputInfo): DeviceFormValues => ({
  name: i.name,
  active: i.active,
  scp: i.scp,
  sio: i.sio,
  addr: i.addr,
  ifcode: i.ifcode,
  mode: i.mode,
  delayentry: i.delayentry,
  delayexit: i.delayexit,
  ext: i.ext,
})

const outputToForm = (o: OutputInfo): DeviceFormValues => ({
  name: o.name,
  active: o.active,
  scp: o.scp,
  sio: o.sio,
  addr: o.addr,
  defpulse: o.defpulse,
  mode: o.mode,
  ext: o.ext,
})

const omitIdScp = <T extends { id: number; scp: number }>(row: T): Omit<T, 'id' | 'scp'> => {
  const { id, scp, ...rest } = row
  void id
  void scp
  return rest
}

const StatusPlaceholder = () => (
  <div
    className="flex flex-col items-center justify-center py-10 gap-2"
    style={{ color: 'var(--color-text-subtle)' }}
  >
    <Activity size={24} strokeWidth={1.5} style={{ opacity: 0.5 }} />
    <p className="text-[12px]">상태 모니터링 — 준비 중</p>
  </div>
)

export const DetailDrawer = ({
  selectedKey,
  parsed,
  scp,
  sio,
  reader,
  input,
  output,
  childData,
  childLoading,
  scpNameMap,
}: DetailDrawerProps) => {
  const [activeTab, setActiveTab] = useState('info')
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const updateScpMut = useUpdateScp()
  const updateSioMut = useUpdateSio()
  const updateReaderMut = useUpdateReader()
  const updateInputMut = useUpdateInput()
  const updateOutputMut = useUpdateOutput()
  const deleteScpMut = useDeleteScp()
  const deleteSioMut = useDeleteSio()
  const deleteReaderMut = useDeleteReader()
  const deleteInputMut = useDeleteInput()
  const deleteOutputMut = useDeleteOutput()

  const { register, handleSubmit, reset } = useForm<DeviceFormValues>({
    defaultValues: emptyForm,
  })

  const selectedLabel = useMemo(() => {
    if (!parsed) return ''
    if (parsed.kind === 'scp' && scp) return entityLabel('scp', scp)
    if (parsed.kind === 'sio' && sio) return entityLabel('sio', sio)
    if (parsed.kind === 'reader' && reader) return entityLabel('reader', reader)
    if (parsed.kind === 'input' && input) return entityLabel('input', input)
    if (parsed.kind === 'output' && output) return entityLabel('output', output)
    return ''
  }, [parsed, scp, sio, reader, input, output])

  const selectedActive = useMemo(() => {
    if (scp && parsed?.kind === 'scp') return scp.active
    if (sio && parsed?.kind === 'sio') return sio.active
    if (reader && parsed?.kind === 'reader') return reader.active
    if (input && parsed?.kind === 'input') return input.active
    if (output && parsed?.kind === 'output') return output.active
    return 0
  }, [parsed, scp, sio, reader, input, output])

  const canMutate = parsed != null && !(parsed.kind === 'reader' && parsed.standalone && parsed.scpId <= 0)

  useEffect(() => {
    setEditMode(false)
    setSaveError(null)
    setActiveTab('info')
  }, [selectedKey])

  useEffect(() => {
    if (!parsed) return
    if (scp && parsed.kind === 'scp') reset(scpToForm(scp))
    else if (sio && parsed.kind === 'sio') reset(sioToForm(sio))
    else if (reader && parsed.kind === 'reader') reset(readerToForm(reader))
    else if (input && parsed.kind === 'input') reset(inputToForm(input))
    else if (output && parsed.kind === 'output') reset(outputToForm(output))
  }, [parsed, scp, sio, reader, input, output, reset])

  const drawerTabs = useMemo(() => {
    if (!parsed) return undefined
    if (parsed.kind === 'scp' || parsed.kind === 'sio') {
      return [
        { key: 'info', label: '정보', icon: <Info size={12} /> },
        { key: 'children', label: '하위장치', icon: <Layers size={12} /> },
        { key: 'status', label: '상태', icon: <Activity size={12} /> },
      ]
    }
    return [
      { key: 'info', label: '정보', icon: <Info size={12} /> },
      { key: 'status', label: '상태', icon: <Activity size={12} /> },
    ]
  }, [parsed])

  const handleEdit = () => {
    setSaveError(null)
    setEditMode(true)
  }

  const handleCancel = () => {
    setEditMode(false)
    setSaveError(null)
    if (scp && parsed?.kind === 'scp') reset(scpToForm(scp))
    else if (sio && parsed?.kind === 'sio') reset(sioToForm(sio))
    else if (reader && parsed?.kind === 'reader') reset(readerToForm(reader))
    else if (input && parsed?.kind === 'input') reset(inputToForm(input))
    else if (output && parsed?.kind === 'output') reset(outputToForm(output))
  }

  const handleSave = handleSubmit(async (values) => {
    if (!parsed || !canMutate) return
    if (!values.name?.trim()) {
      setSaveError('이름을 입력하세요.')
      return
    }
    setSaveError(null)
    let ok = false

    if (parsed.kind === 'scp' && scp) {
      const data = {
        name: String(values.name),
        active: Number(values.active) || 0,
        connstr: String(values.connstr ?? ''),
        model: Number(values.model) || 0,
        ctype: Number(values.ctype) || 0,
        ext: String(values.ext ?? ''),
      }
      ok = await updateScpMut.mutateAsync({ id: scp.id, data })
    } else if (parsed.kind === 'sio' && sio) {
      ok = await updateSioMut.mutateAsync({
        scpId: parsed.scpId,
        id: sio.id,
        data: {
          name: String(values.name),
          active: Number(values.active) || 0,
          port: Number(values.port) || 0,
          addr: Number(values.addr) || 0,
          model: Number(values.model) || 0,
          ext: String(values.ext ?? ''),
        },
      })
    } else if (parsed.kind === 'reader' && reader) {
      const base = omitIdScp(reader)
      ok = await updateReaderMut.mutateAsync({
        scpId: parsed.scpId,
        id: reader.id,
        data: { ...base, ...values, name: String(values.name), active: Number(values.active) || 0 },
      })
    } else if (parsed.kind === 'input' && input) {
      const base = omitIdScp(input)
      ok = await updateInputMut.mutateAsync({
        scpId: parsed.scpId,
        id: input.id,
        data: { ...base, ...values, name: String(values.name), active: Number(values.active) || 0 },
      })
    } else if (parsed.kind === 'output' && output) {
      const base = omitIdScp(output)
      ok = await updateOutputMut.mutateAsync({
        scpId: parsed.scpId,
        id: output.id,
        data: { ...base, ...values, name: String(values.name), active: Number(values.active) || 0 },
      })
    }

    if (ok) {
      setEditMode(false)
    } else {
      setSaveError('저장하지 못했습니다. 서버 응답을 확인하세요.')
    }
  })

  const handleDeleteConfirm = async () => {
    if (!parsed || !canMutate) return
    let ok = false

    if (parsed.kind === 'scp') ok = await deleteScpMut.mutateAsync(parsed.entityId)
    else if (parsed.kind === 'sio') ok = await deleteSioMut.mutateAsync({ scpId: parsed.scpId, id: parsed.entityId })
    else if (parsed.kind === 'reader') ok = await deleteReaderMut.mutateAsync({ scpId: parsed.scpId, id: parsed.entityId })
    else if (parsed.kind === 'input') ok = await deleteInputMut.mutateAsync({ scpId: parsed.scpId, id: parsed.entityId })
    else if (parsed.kind === 'output') ok = await deleteOutputMut.mutateAsync({ scpId: parsed.scpId, id: parsed.entityId })

    if (ok) setDeleteOpen(false)
  }

  const isSaving =
    updateScpMut.isPending ||
    updateSioMut.isPending ||
    updateReaderMut.isPending ||
    updateInputMut.isPending ||
    updateOutputMut.isPending

  const isDeleting =
    deleteScpMut.isPending ||
    deleteSioMut.isPending ||
    deleteReaderMut.isPending ||
    deleteInputMut.isPending ||
    deleteOutputMut.isPending

  const headerKind = parsed?.kind ?? 'scp'
  const HeaderIcon = parsed ? DEVICE_ICONS[parsed.kind] : Info

  const drawerHeader = parsed ? (
    <div
      className="flex items-start gap-3 pb-3"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <div
        className="flex items-center justify-center rounded-md flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          background: 'var(--color-btn-hover)',
          color: DEVICE_ICON_COLORS[headerKind],
        }}
      >
        <HeaderIcon size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[15px] font-medium leading-tight truncate" style={{ color: 'var(--color-text)' }}>
          {selectedLabel}
        </span>
        <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
          {parsed.kind === 'reader' && parsed.standalone
            ? '단독 리더'
            : parsed.scpId > 0
              ? scpNameMap[parsed.scpId] ?? `SCP #${parsed.scpId}`
              : '—'}
        </span>
        <span
          className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-mono w-fit"
          style={{
            background: 'var(--color-btn-hover)',
            color: 'var(--color-text-subtle)',
            border: '0.5px solid var(--color-border)',
          }}
        >
          {isDeviceActive(selectedActive) ? '활성' : '비활성'} · #{parsed.entityId}
        </span>
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions =
    parsed ? (
      editMode ? (
        <div className="flex flex-col items-stretch gap-2 w-full max-w-[260px] ml-auto">
          {saveError ? (
            <p className="text-[11px] leading-snug text-right" style={{ color: '#c75c5c' }}>
              {saveError}
            </p>
          ) : null}
          <div className="flex justify-end gap-1.5">
            <Button variant="default" size="sm" leftIcon={<X size={12} />} onClick={handleCancel}>
              취소
            </Button>
            <Button
              variant="accent"
              size="sm"
              leftIcon={<Check size={12} />}
              loading={isSaving}
              onClick={handleSave}
              disabled={!canMutate}
            >
              저장
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 size={12} />}
            onClick={() => setDeleteOpen(true)}
            disabled={!canMutate}
          >
            삭제
          </Button>
          <Button variant="accent" size="sm" leftIcon={<Pencil size={12} />} onClick={handleEdit} disabled={!canMutate}>
            수정
          </Button>
        </>
      )
    ) : null

  const drawerChildren = !parsed ? (
    <div className="flex items-center justify-center h-full min-h-[120px]">
      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        트리에서 장치를 선택하세요
      </span>
    </div>
  ) : (
    <>
      {activeTab === 'info' && (
        <InfoTab
          parsed={parsed}
          scp={scp}
          sio={sio}
          reader={reader}
          input={input}
          output={output}
          editMode={editMode}
          register={register}
        />
      )}
      {activeTab === 'children' && (parsed.kind === 'scp' || parsed.kind === 'sio') && (
        <ChildrenTab
          scp={scp}
          sio={parsed.kind === 'sio' ? sio : null}
          childData={childData}
          loading={childLoading}
        />
      )}
      {activeTab === 'status' && <StatusPlaceholder />}
    </>
  )

  return (
    <>
      <Drawer
        fill
        header={drawerHeader}
        actions={drawerActions ?? undefined}
        tabs={drawerTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {drawerChildren}
      </Drawer>

      <Modal
        open={deleteOpen}
        title="장치 삭제"
        description={`"${selectedLabel}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
