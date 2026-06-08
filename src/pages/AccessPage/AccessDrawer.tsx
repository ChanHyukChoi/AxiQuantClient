import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Clock, Cpu, Pencil, ScanLine, Shield, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { IdNameTable } from '@/pages/AccessPage/components/IdNameTable'
import { SectionBlock } from '@/pages/AccessPage/components/SectionBlock'
import { accLvSchema, type AccLvFormValues } from '@/pages/AccessPage/formTypes'
import { useAccLvReaderList, useDeleteAccLv, useUpdateAccLv } from '@/hooks/api/useAccLv'
import { useScps } from '@/hooks/api/useDevices'
import { useTimezoneList } from '@/hooks/api/useTimezone'
import type { AccLvInfo, AccLvRdrInfo, UpdateAccLvRequest } from '@/types/api'

interface AccessDrawerProps {
  selectedAccLv: AccLvInfo | null
  onDeleted: () => void
  onEditModeChange?: (editing: boolean) => void
}

export const AccessDrawer = ({
  selectedAccLv,
  onDeleted,
  onEditModeChange,
}: AccessDrawerProps) => {
  const selectedId = selectedAccLv?.id ?? null
  const [editMode, setEditMode] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { data: readerList, isLoading: readerLoading } = useAccLvReaderList(
    selectedId ?? 0,
  )
  const { data: scpList } = useScps()
  const { data: timezoneList, isLoading: timezoneLoading } = useTimezoneList()

  const { mutate: updateAccLv, isPending: isUpdating } = useUpdateAccLv()
  const { mutate: deleteAccLv, isPending: isDeleting } = useDeleteAccLv()

  const updateForm = useForm<AccLvFormValues>({
    resolver: zodResolver(accLvSchema),
  })

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

  const scpNameMap = useMemo(() => {
    if (!scpList) return {} as Record<number, string>
    return scpList.reduce<Record<number, string>>((acc, s) => {
      acc[s.id] = s.name
      return acc
    }, {})
  }, [scpList])

  const uniqueScpRows = useMemo(() => {
    if (!readerList?.length) return [] as { id: number; name: string }[]
    const seen = new Set<number>()
    const out: { id: number; name: string }[] = []
    for (const r of readerList) {
      if (seen.has(r.scp)) continue
      seen.add(r.scp)
      const name = scpNameMap[r.scp] ?? r.scpName ?? `SCP ${r.scp}`
      out.push({ id: r.scp, name })
    }
    return out
  }, [readerList, scpNameMap])

  const readerRows = useMemo(() => {
    if (!readerList?.length) return []
    return readerList.map((r: AccLvRdrInfo) => ({
      id: r.rdr,
      name: r.readerName ?? `?? ${r.rdr}`,
    }))
  }, [readerList])

  const timezoneRows = useMemo(() => {
    if (!timezoneList) return []
    return timezoneList.map((t) => ({ id: t.id, name: t.name }))
  }, [timezoneList])

  const onEditClick = () => {
    if (!selectedAccLv) return
    updateForm.reset({ name: selectedAccLv.name })
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
    updateForm.reset()
  }

  const onUpdateSubmit = (values: AccLvFormValues) => {
    if (!selectedId || !selectedAccLv) return
    const data: UpdateAccLvRequest = {
      name: values.name.trim(),
      description: selectedAccLv.description,
    }
    updateAccLv(
      { id: selectedId, data },
      {
        onSuccess: (ok) => {
          if (!ok) return
          setEditing(false)
        },
      },
    )
  }

  const handleSave = updateForm.handleSubmit(onUpdateSubmit)

  const handleDeleteConfirm = () => {
    if (selectedId == null) return
    deleteAccLv(selectedId, {
      onSuccess: (ok) => {
        if (!ok) return
        setDeleteModalOpen(false)
        onDeleted()
      },
    })
  }

  const drawerHeader = selectedAccLv ? (
    <div
      className="flex items-start gap-3 pb-3"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <div
        className="w-[38px] h-[38px] rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: '#1a3a5c' }}
      >
        <Shield size={20} style={{ color: 'var(--color-accent)' }} />
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {editMode ? (
          <Input
            {...updateForm.register('name')}
            error={updateForm.formState.errors.name?.message}
          />
        ) : (
          <span
            className="text-[14px] font-medium leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {selectedAccLv.name}
          </span>
        )}
        <span
          className="inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-full font-mono"
          style={{
            background: 'var(--color-btn-hover)',
            color: 'var(--color-text-subtle)',
            border: '0.5px solid var(--color-border)',
            width: 'fit-content',
          }}
        >
          #{selectedAccLv.id}
        </span>
      </div>
    </div>
  ) : (
    <div />
  )

  const drawerActions = selectedAccLv ? (
    editMode ? (
      <>
        <Button
          variant="default"
          size="sm"
          leftIcon={<X size={12} />}
          onClick={handleCancelEdit}
        >
          ??
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Check size={12} />}
          loading={isUpdating}
          onClick={handleSave}
        >
          ??
        </Button>
      </>
    ) : (
      <>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<Trash2 size={12} />}
          onClick={() => setDeleteModalOpen(true)}
        >
          ??
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Pencil size={12} />}
          onClick={onEditClick}
        >
          ??
        </Button>
      </>
    )
  ) : null

  const drawerBody = !selectedAccLv ? (
    <div className="flex items-center justify-center min-h-[160px]">
      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        ???? ??? ?????
      </span>
    </div>
  ) : (
    <div>
      <SectionBlock icon={<Cpu size={12} />} title="? ???">
        {readerLoading ? (
          <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
            ???? ?...
          </span>
        ) : (
          <IdNameTable rows={uniqueScpRows} />
        )}
      </SectionBlock>
      <SectionBlock icon={<ScanLine size={12} />} title="??">
        {readerLoading ? (
          <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
            ???? ?...
          </span>
        ) : (
          <IdNameTable rows={readerRows} />
        )}
      </SectionBlock>
      <SectionBlock icon={<Clock size={12} />} title="???">
        {timezoneLoading ? (
          <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
            ???? ?...
          </span>
        ) : (
          <IdNameTable rows={timezoneRows} />
        )}
      </SectionBlock>
    </div>
  )

  return (
    <>
      <Drawer
        fill
        borderLeft={false}
        header={drawerHeader}
        actions={drawerActions ?? undefined}
      >
        {drawerBody}
      </Drawer>

      <Modal
        open={deleteModalOpen}
        title="?? ?? ??"
        description={`"${selectedAccLv?.name ?? ''}" ??? ????????? ? ??? ??? ? ????.`}
        confirmLabel="??"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </>
  )
}
