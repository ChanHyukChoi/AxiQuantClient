import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Info, MapPin, Pencil, ScanLine, Trash2, Users, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { areaEditSchema, type AreaEditFormValues } from '@/pages/AreaPage/formTypes'
import { AreaInfoTab } from '@/pages/AreaPage/tabs/AreaInfoTab'
import { AreaOccupantsTab } from '@/pages/AreaPage/tabs/AreaOccupantsTab'
import { AreaReadersTab } from '@/pages/AreaPage/tabs/AreaReadersTab'
import { areaToUpdatePayload, isAreaActive } from '@/pages/AreaPage/utils/areaHelpers'
import { useDeleteArea, useUpdateArea } from '@/hooks/useArea'
import type { AreaInfo } from '@/types/api'

interface AreaDrawerProps {
  area: AreaInfo | null
}

const areaToForm = (area: AreaInfo): AreaEditFormValues => ({
  name: area.name,
  active: area.active,
  occmax: area.occmax,
  multiocc: area.multiocc,
})

export const AreaDrawer = ({ area }: AreaDrawerProps) => {
  const [activeTab, setActiveTab] = useState('info')
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [setOccOpen, setSetOccOpen] = useState(false)
  const [occsetInput, setOccsetInput] = useState('0')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const updateAreaMut = useUpdateArea()
  const deleteAreaMut = useDeleteArea()

  const { register, handleSubmit, reset, control } = useForm<AreaEditFormValues>({
    resolver: zodResolver(areaEditSchema),
    defaultValues: { name: '', active: 1, occmax: 0, multiocc: 0 },
  })

  useEffect(() => {
    setEditMode(false)
    setSaveError(null)
    setActionError(null)
    setActiveTab('info')
    if (area) {
      reset(areaToForm(area))
      setOccsetInput(String(area.occset))
    }
  }, [area?.id, area, reset])

  const drawerTabs = area
    ? [
        { key: 'info', label: '기본정보', icon: <Info size={12} /> },
        { key: 'readers', label: '연결 리더', icon: <ScanLine size={12} /> },
        { key: 'occupants', label: '점유 인원', icon: <Users size={12} /> },
      ]
    : undefined

  const handleEdit = () => {
    if (!area) return
    setSaveError(null)
    reset(areaToForm(area))
    setEditMode(true)
  }

  const handleCancel = () => {
    if (!area) return
    setEditMode(false)
    setSaveError(null)
    reset(areaToForm(area))
  }

  const handleSave = handleSubmit(async (values) => {
    if (!area) return
    setSaveError(null)
    const payload = {
      ...areaToUpdatePayload(area),
      name: values.name,
      active: values.active,
      occmax: values.occmax,
      multiocc: values.multiocc,
    }
    const ok = await updateAreaMut.mutateAsync({ id: area.id, data: payload })
    if (ok) {
      setEditMode(false)
    } else {
      setSaveError('저장하지 못했습니다. 서버 응답을 확인하세요.')
    }
  })

  const handleDeleteConfirm = async () => {
    if (!area) return
    const ok = await deleteAreaMut.mutateAsync(area.id)
    if (ok) setDeleteOpen(false)
  }

  const handleResetOccupancyConfirm = async () => {
    if (!area) return
    setActionError(null)
    const ok = await updateAreaMut.mutateAsync({
      id: area.id,
      data: { ...areaToUpdatePayload(area), occup: 0, occdown: 0 },
    })
    if (ok) {
      setResetOpen(false)
    } else {
      setActionError('점유 초기화에 실패했습니다.')
    }
  }

  const handleSetOccupancyConfirm = async () => {
    if (!area) return
    setActionError(null)
    const occset = Math.trunc(Number(occsetInput))
    if (!Number.isFinite(occset) || occset < 0) {
      setActionError('0 이상의 숫자를 입력하세요.')
      return
    }
    const ok = await updateAreaMut.mutateAsync({
      id: area.id,
      data: { ...areaToUpdatePayload(area), occset },
    })
    if (ok) {
      setSetOccOpen(false)
      setActionError(null)
    } else {
      setActionError('점유 설정에 실패했습니다.')
    }
  }

  const drawerHeader = area ? (
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
          color: 'var(--color-accent)',
        }}
      >
        <MapPin size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className="text-[15px] font-medium leading-tight truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {area.name?.trim() || `영역 #${area.id}`}
        </span>
        <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
          {isAreaActive(area.active) ? '활성' : '비활성'} · 점유 {area.occup}/
          {area.occmax}
        </span>
        <span
          className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-mono w-fit"
          style={{
            background: 'var(--color-btn-hover)',
            color: 'var(--color-text-subtle)',
            border: '0.5px solid var(--color-border)',
          }}
        >
          #{area.id}
        </span>
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions = area ? (
    editMode ? (
      <div className="flex flex-col items-stretch gap-2 w-full max-w-[260px] ml-auto">
        {saveError ? (
          <p className="text-[11px] leading-snug text-right" style={{ color: '#c75c5c' }}>
            {saveError}
          </p>
        ) : null}
        <div className="flex justify-end gap-1.5">
          <Button
            variant="default"
            size="sm"
            leftIcon={<X size={12} />}
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Check size={12} />}
            loading={updateAreaMut.isPending}
            onClick={handleSave}
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
        >
          삭제
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Pencil size={12} />}
          onClick={handleEdit}
        >
          수정
        </Button>
      </>
    )
  ) : null

  const drawerChildren = !area ? (
    <div className="flex items-center justify-center h-full min-h-[120px]">
      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        목록에서 영역을 선택하세요
      </span>
    </div>
  ) : (
    <>
      {activeTab === 'info' && (
        <AreaInfoTab
          area={area}
          editMode={editMode}
          register={register}
          control={control}
          onResetOccupancy={() => {
            setActionError(null)
            setResetOpen(true)
          }}
          onSetOccupancy={() => {
            setActionError(null)
            setOccsetInput(String(area.occset))
            setSetOccOpen(true)
          }}
        />
      )}
      {activeTab === 'readers' && <AreaReadersTab />}
      {activeTab === 'occupants' && <AreaOccupantsTab />}
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
        title="영역 삭제"
        description={`"${area?.name ?? ''}" 영역을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        variant="danger"
        loading={deleteAreaMut.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />

      <Modal
        open={resetOpen}
        title="점유 초기화"
        description={
          actionError && resetOpen
            ? `현재 점유(${area?.occup ?? 0})와 퇴장 카운트를 0으로 초기화합니다.\n\n${actionError}`
            : `현재 점유(${area?.occup ?? 0})와 퇴장 카운트를 0으로 초기화합니다.`
        }
        confirmLabel="초기화"
        variant="danger"
        loading={updateAreaMut.isPending}
        onConfirm={handleResetOccupancyConfirm}
        onCancel={() => {
          setResetOpen(false)
          setActionError(null)
        }}
      />

      {setOccOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="rounded-md p-5 w-[300px]"
            style={{
              background: 'var(--color-sidebar)',
              border: '0.5px solid var(--color-border)',
            }}
          >
            <p
              className="text-[13px] font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              점유 설정 (occset)
            </p>
            <p className="text-[11px] mb-3" style={{ color: 'var(--color-text-muted)' }}>
              영역 점유 설정값을 입력하세요.
            </p>
            <Input
              type="number"
              value={occsetInput}
              onChange={(e) => setOccsetInput(e.target.value)}
              min={0}
            />
            {actionError ? (
              <p className="text-[11px] mt-2" style={{ color: '#c75c5c' }}>
                {actionError}
              </p>
            ) : null}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="default"
                onClick={() => {
                  setSetOccOpen(false)
                  setActionError(null)
                }}
              >
                취소
              </Button>
              <Button
                variant="accent"
                loading={updateAreaMut.isPending}
                onClick={handleSetOccupancyConfirm}
              >
                적용
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
