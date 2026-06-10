import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Check, CreditCard, Fingerprint, Pencil, Trash2, User, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Modal } from '@/components/primitive/Modal'
import { queryKeys } from '@/lib/query/queryKeys'
import {
  BIO_IMAGE_INVALID_EXTENSION_MESSAGE,
  BIO_IMAGE_PROCESS_ERROR_MESSAGE,
  BIO_NO_PROFILE_MESSAGE,
} from '@/lib/image/bioImageConstants'
import { isAllowedBioImageFile } from '@/lib/image/isAllowedBioImageFile'
import { BioImageTooSmallError, processBioPhoto } from '@/lib/image/processBioPhoto'
import {
  EMP_IMAGE_INVALID_EXTENSION_MESSAGE,
  EMP_IMAGE_PROCESS_ERROR_MESSAGE,
} from '@/lib/image/empImageConstants'
import { isAllowedEmpImageFile } from '@/lib/image/isAllowedEmpImageFile'
import { processEmpPhoto } from '@/lib/image/processEmpPhoto'
import { processEmpPhotoFromBytes } from '@/lib/image/processEmpPhotoFromBytes'
import { EmpSummaryHeader } from '@/pages/EmpsPage/components/EmpSummaryHeader'
import { EmpUpsertForm } from '@/pages/EmpsPage/components/EmpUpsertForm'
import { updateEmpSchema, type UpdateEmpFormValues } from '@/pages/EmpsPage/formTypes'
import { EmpBioTab } from '@/pages/EmpsPage/tabs/EmpBioTab'
import { EmpCardTab } from '@/pages/EmpsPage/tabs/EmpCardTab'
import { EmpInfoTab } from '@/pages/EmpsPage/tabs/EmpInfoTab'
import { defaultRepCardKey } from '@/pages/EmpsPage/utils/bioHelpers'
import {
  bioPhotoDraftForSave,
  cloneBioPhotoDraft,
  createBioPhotoDraft,
  createBioPhotoDraftFromBytes,
  resolveBioPhotoDisplayUrl,
  revokeBioPhotoPreview,
  type BioPhotoDraft,
} from '@/pages/EmpsPage/utils/bioPhotoDraft'
import {
  empToFormValues,
  findCreatedEmpId,
  toCreateRequest,
  toUpdateRequest,
} from '@/pages/EmpsPage/utils/empHelpers'
import {
  createEmpPhotoDraft,
  empPhotoDraftForSave,
  resolveEmpPhotoDisplayUrl,
  revokeEmpPhotoPreview,
  type EmpPhotoDraft,
} from '@/pages/EmpsPage/utils/empPhotoDraft'
import { useCreateEmp, useDeleteEmp, useUpdateEmp } from '@/hooks/api/useEmps'
import type { CardInfo, EmpInfo } from '@/types/api'

const FORM_DEFAULTS: UpdateEmpFormValues = {
  name: '',
  name2: '',
  lastName: '',
  empNo: '',
  birth: '',
  dept: 0,
  lv: 0,
  tel: '',
  email: '',
}

interface EmpDrawerProps {
  emp: EmpInfo | null
  createMode: boolean
  selectedCards: CardInfo[]
  onCreateCancel: () => void
  onCreated: (id: number | null) => void | Promise<void>
  onDeleted: () => void
  onEditModeChange?: (editing: boolean) => void
}

const FONT_SIZE = 15

export const EmpDrawer = ({
  emp,
  createMode,
  selectedCards,
  onCreateCancel,
  onCreated,
  onDeleted,
  onEditModeChange,
}: EmpDrawerProps) => {
  const selectedId = emp?.id ?? null
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [photoDraft, setPhotoDraft] = useState<EmpPhotoDraft>(createEmpPhotoDraft)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [bioEditActive, setBioEditActive] = useState(false)
  const [committedBio, setCommittedBio] = useState<BioPhotoDraft>(createBioPhotoDraft)
  const [bioDraft, setBioDraft] = useState<BioPhotoDraft>(createBioPhotoDraft)
  const [useAsProfile, setUseAsProfile] = useState(false)
  const [representativeCardKey, setRepresentativeCardKey] = useState('')
  const [bioLoading, setBioLoading] = useState(false)
  const [bioSaveError, setBioSaveError] = useState<string | null>(null)
  const [bioDeleteModalOpen, setBioDeleteModalOpen] = useState(false)
  const [profileOverrideUrl, setProfileOverrideUrl] = useState<string | undefined>()
  const photoDraftRef = useRef(photoDraft)
  const bioDraftRef = useRef(bioDraft)
  const committedBioRef = useRef(committedBio)
  const profileOverrideRef = useRef(profileOverrideUrl)
  photoDraftRef.current = photoDraft
  bioDraftRef.current = bioDraft
  committedBioRef.current = committedBio
  profileOverrideRef.current = profileOverrideUrl

  const formActive = createMode || editMode
  const qc = useQueryClient()

  const { mutateAsync: createEmpAsync } = useCreateEmp()
  const { mutateAsync: updateEmpAsync } = useUpdateEmp()
  const deleteEmpMut = useDeleteEmp()

  const form = useForm<UpdateEmpFormValues>({
    resolver: zodResolver(updateEmpSchema) as Resolver<UpdateEmpFormValues>,
    defaultValues: FORM_DEFAULTS,
  })

  const watchedName = useWatch({ control: form.control, name: 'name' })
  const watchedDept = useWatch({ control: form.control, name: 'dept' })
  const watchedEmpNo = useWatch({ control: form.control, name: 'empNo' })

  const resetPhotoDraft = () => {
    setPhotoDraft((prev) => {
      revokeEmpPhotoPreview(prev)
      return createEmpPhotoDraft()
    })
  }

  const resetBioState = useCallback(() => {
    setBioEditActive(false)
    setUseAsProfile(false)
    setBioSaveError(null)
    setBioDraft((prev) => {
      revokeBioPhotoPreview(prev)
      return createBioPhotoDraft()
    })
    setCommittedBio((prev) => {
      revokeBioPhotoPreview(prev)
      return createBioPhotoDraft()
    })
    setRepresentativeCardKey('')
    setProfileOverrideUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return undefined
    })
  }, [])

  const cancelBioEdit = useCallback(() => {
    setBioEditActive(false)
    setUseAsProfile(false)
    setBioSaveError(null)
    setBioDraft((prev) => {
      revokeBioPhotoPreview(prev)
      return createBioPhotoDraft()
    })
  }, [])

  const resetFormState = () => {
    form.reset(FORM_DEFAULTS)
    setSaveError(null)
    resetPhotoDraft()
  }

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

  useEffect(() => {
    if (!createMode) return
    setActiveTab('info')
    setEditMode(false)
    resetFormState()
    resetBioState()
  }, [createMode, resetBioState])

  useEffect(() => {
    if (createMode) return
    setEditMode(false)
    resetPhotoDraft()
    resetBioState()
  }, [selectedId, createMode, resetBioState])

  useEffect(() => {
    if (bioEditActive && selectedCards.length === 0) {
      cancelBioEdit()
    }
  }, [bioEditActive, selectedCards.length, cancelBioEdit])

  useEffect(
    () => () => {
      revokeEmpPhotoPreview(photoDraftRef.current)
      revokeBioPhotoPreview(bioDraftRef.current)
      revokeBioPhotoPreview(committedBioRef.current)
      if (profileOverrideRef.current) URL.revokeObjectURL(profileOverrideRef.current)
    },
    [],
  )

  const onEditClick = () => {
    if (!emp || bioEditActive) return
    setSaveError(null)
    form.reset(empToFormValues(emp))
    resetPhotoDraft()
    setEditing(true)
  }

  const handlePhotoFileSelect = async (file: File) => {
    if (!isAllowedEmpImageFile(file)) {
      window.alert(EMP_IMAGE_INVALID_EXTENSION_MESSAGE)
      return
    }

    setPhotoLoading(true)
    try {
      const bytes = await processEmpPhoto(file)
      const previewUrl = URL.createObjectURL(
        new Blob([Uint8Array.from(bytes)], { type: 'image/jpeg' }),
      )
      setPhotoDraft((prev) => {
        revokeEmpPhotoPreview(prev)
        return { status: 'loaded', bytes, previewUrl }
      })
    } catch {
      window.alert(EMP_IMAGE_PROCESS_ERROR_MESSAGE)
    } finally {
      setPhotoLoading(false)
    }
  }

  const handlePhotoClear = () => {
    setPhotoDraft((prev) => {
      revokeEmpPhotoPreview(prev)
      return { status: 'cleared' }
    })
  }

  const baseProfileUrl = profileOverrideUrl ?? emp?.photoUrl

  const displayPhotoUrl = useMemo(
    () => resolveEmpPhotoDisplayUrl(formActive, photoDraft, baseProfileUrl),
    [formActive, photoDraft, baseProfileUrl],
  )

  const displayBioUrl = useMemo(
    () => resolveBioPhotoDisplayUrl(bioEditActive, bioDraft, committedBio),
    [bioEditActive, bioDraft, committedBio],
  )

  const handleStartBioEdit = () => {
    if (formActive || selectedCards.length === 0) return
    setBioSaveError(null)
    setUseAsProfile(false)
    setRepresentativeCardKey(defaultRepCardKey(selectedCards))
    setBioDraft((prev) => {
      revokeBioPhotoPreview(prev)
      return cloneBioPhotoDraft(committedBio)
    })
    setBioEditActive(true)
  }

  const handleBioFileSelect = async (file: File) => {
    if (!isAllowedBioImageFile(file)) {
      window.alert(BIO_IMAGE_INVALID_EXTENSION_MESSAGE)
      return
    }

    setBioLoading(true)
    try {
      const bytes = await processBioPhoto(file)
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      setBioDraft((prev) => {
        revokeBioPhotoPreview(prev)
        return createBioPhotoDraftFromBytes(bytes, mime)
      })
    } catch (error) {
      if (error instanceof BioImageTooSmallError) {
        window.alert(error.message)
      } else {
        window.alert(BIO_IMAGE_PROCESS_ERROR_MESSAGE)
      }
    } finally {
      setBioLoading(false)
    }
  }

  const handleBioClear = () => {
    setBioDraft((prev) => {
      revokeBioPhotoPreview(prev)
      return { status: 'cleared' }
    })
  }

  const handleImportProfile = async () => {
    const url = baseProfileUrl?.trim()
    if (!url) {
      window.alert(BIO_NO_PROFILE_MESSAGE)
      return
    }

    setBioLoading(true)
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const bytes = new Uint8Array(await blob.arrayBuffer())
      const mime = blob.type || 'image/jpeg'
      setBioDraft((prev) => {
        revokeBioPhotoPreview(prev)
        return createBioPhotoDraftFromBytes(bytes, mime)
      })
    } catch {
      window.alert(BIO_NO_PROFILE_MESSAGE)
    } finally {
      setBioLoading(false)
    }
  }

  const handleBioCancel = () => {
    cancelBioEdit()
  }

  const handleBioConfirm = async () => {
    setBioSaveError(null)
    setIsSaving(true)
    try {
      // TODO: API bio 저장 — bioPhotoDraftForSave(bioDraft), representativeCardKey
      void bioPhotoDraftForSave(bioDraft)

      if (bioDraft.status !== 'unchanged') {
        setCommittedBio((prev) => {
          revokeBioPhotoPreview(prev)
          if (bioDraft.status === 'loaded') return cloneBioPhotoDraft(bioDraft)
          return { status: 'cleared' }
        })
      }

      if (useAsProfile && bioDraft.status === 'loaded') {
        try {
          const profileBytes = await processEmpPhotoFromBytes(bioDraft.bytes)
          // TODO: API 프로필 이미지만 업데이트 — profileBytes 전송
          void profileBytes
          const previewUrl = URL.createObjectURL(
            new Blob([Uint8Array.from(profileBytes)], { type: 'image/jpeg' }),
          )
          setProfileOverrideUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return previewUrl
          })
        } catch {
          setBioSaveError('프로필 이미지 가공에 실패했습니다.')
          return
        }
      }

      cancelBioEdit()
    } finally {
      setIsSaving(false)
    }
  }

  const handleBioDeleteConfirm = () => {
    // TODO: API bio 삭제
    setCommittedBio((prev) => {
      revokeBioPhotoPreview(prev)
      return { status: 'cleared' }
    })
    setBioDraft((prev) => {
      revokeBioPhotoPreview(prev)
      return { status: 'cleared' }
    })
    setBioDeleteModalOpen(false)
    cancelBioEdit()
  }

  const handleCancelForm = () => {
    if (createMode) {
      onCreateCancel()
    } else {
      setEditing(false)
    }
    resetFormState()
  }

  const onFormSubmit = async (values: UpdateEmpFormValues) => {
    setIsSaving(true)
    setSaveError(null)
    try {
      if (createMode) {
        const beforeIds = new Set(
          (qc.getQueryData<EmpInfo[]>(queryKeys.emps.all) ?? []).map((e) => e.id),
        )
        const payload = toCreateRequest(values)
        // TODO: API image 필드 확정 후 empPhotoDraftForSave(photoDraft)를 wire payload에 포함
        void empPhotoDraftForSave(photoDraft)
        const result = await createEmpAsync(payload)
        if (!result.ok) {
          setSaveError(
            result.message ||
              '서버에 저장하지 못했습니다. F12 네트워크에서 응답 상태(4xx/5xx)와 본문을 확인하세요.',
          )
          return
        }

        resetFormState()
        await qc.refetchQueries({ queryKey: queryKeys.emps.all })
        const fresh = qc.getQueryData<EmpInfo[]>(queryKeys.emps.all) ?? []
        const newId = findCreatedEmpId(fresh, values, beforeIds)
        await onCreated(newId)
        return
      }

      if (!selectedId || !emp) return
      const data = toUpdateRequest(values, emp)
      // TODO: API image 필드 확정 후 empPhotoDraftForSave(photoDraft)를 wire payload에 포함
      void empPhotoDraftForSave(photoDraft)
      const result = await updateEmpAsync({ id: selectedId, data })
      if (!result.ok) {
        setSaveError(result.message)
        return
      }
      setEditing(false)
      resetPhotoDraft()
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = form.handleSubmit(onFormSubmit)

  const handleDeleteConfirm = async () => {
    if (!selectedId) return
    setDeleteError(null)
    const result = await deleteEmpMut.mutateAsync(selectedId)
    if (result.ok) {
      setDeleteModalOpen(false)
      setDeleteError(null)
      onDeleted()
    } else {
      setDeleteError(
        result.message ||
          '삭제하지 못했습니다. 카드·권한 등 다른 데이터가 참조 중이거나 서버가 거부했을 수 있습니다. F12 네트워크 응답을 확인하세요.',
      )
    }
  }

  const handleTabChange = (key: string) => {
    if (bioEditActive) cancelBioEdit()
    setActiveTab(key)
  }

  const headerMode = createMode
    ? 'create'
    : editMode
      ? 'edit'
      : emp
        ? 'view'
        : 'empty'

  const drawerTabs =
    emp && !formActive
      ? [
          {
            key: 'info',
            label: '인적사항',
            icon: <User size={12} />,
            fontSize: FONT_SIZE,
          },
          {
            key: 'card',
            label: '카드',
            icon: <CreditCard size={12} />,
            fontSize: FONT_SIZE,
          },
          {
            key: 'bio',
            label: '바이오',
            icon: <Fingerprint size={12} />,
            fontSize: FONT_SIZE,
          },
        ]
      : undefined

  const drawerHeader = (
    <EmpSummaryHeader
      mode={headerMode}
      name={formActive ? watchedName : emp?.name}
      dept={formActive ? watchedDept : emp?.dept}
      empNo={
        formActive
          ? createMode
            ? watchedEmpNo
            : emp?.udef
          : emp?.udef
      }
      photoUrl={displayPhotoUrl}
      photoEditable={formActive}
      photoLoading={photoLoading}
      onPhotoFileSelect={handlePhotoFileSelect}
      onPhotoClear={handlePhotoClear}
    />
  )

  const drawerActions = formActive ? (
    <div className="flex flex-col items-stretch gap-2 w-full max-w-[260px] ml-auto">
      {saveError ? <p className="app-field-error">{saveError}</p> : null}
      <div className="flex justify-end gap-1.5">
        <Button
          variant="default"
          size="sm"
          leftIcon={<X size={15} />}
          onClick={handleCancelForm}
        >
          취소
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Check size={15} />}
          loading={isSaving}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  ) : bioEditActive ? (
    <div className="flex flex-col items-stretch gap-2 w-full max-w-[320px] ml-auto">
      {bioSaveError ? <p className="app-field-error">{bioSaveError}</p> : null}
      <div className="flex justify-end gap-1.5">
        <Button
          variant="default"
          size="sm"
          leftIcon={<X size={15} />}
          onClick={handleBioCancel}
        >
          취소
        </Button>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<Trash2 size={15} />}
          onClick={() => setBioDeleteModalOpen(true)}
        >
          삭제
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Check size={15} />}
          loading={isSaving}
          onClick={handleBioConfirm}
        >
          확인
        </Button>
      </div>
    </div>
  ) : emp ? (
    <>
      <Button
        variant="danger"
        size="sm"
        leftIcon={<Trash2 size={15} />}
        onClick={() => {
          setDeleteError(null)
          setDeleteModalOpen(true)
        }}
      >
        삭제
      </Button>
      <Button
        variant="accent"
        size="sm"
        leftIcon={<Pencil size={15} />}
        disabled={bioEditActive}
        onClick={onEditClick}
      >
        수정
      </Button>
    </>
  ) : null

  const drawerChildren = formActive ? (
    <EmpUpsertForm
      mode={createMode ? 'create' : 'edit'}
      register={form.register}
      control={form.control}
      errors={form.formState.errors}
    />
  ) : !emp ? (
    <div className="flex-1 min-h-[120px]" aria-hidden />
  ) : (
    <>
      {activeTab === 'info' && <EmpInfoTab emp={emp} />}
      {activeTab === 'card' && <EmpCardTab cards={selectedCards} />}
      {activeTab === 'bio' && (
        <EmpBioTab
          bioEditActive={bioEditActive}
          imageUrl={displayBioUrl}
          cards={selectedCards}
          representativeCardKey={representativeCardKey || defaultRepCardKey(selectedCards)}
          useAsProfile={useAsProfile}
          bioLoading={bioLoading}
          formActive={formActive}
          onStartEdit={handleStartBioEdit}
          onRepresentativeCardChange={setRepresentativeCardKey}
          onUseAsProfileChange={setUseAsProfile}
          onFileSelect={handleBioFileSelect}
          onClear={handleBioClear}
          onImportProfile={handleImportProfile}
        />
      )}
    </>
  )

  return (
    <>
      <Drawer
        fill
        borderLeft={false}
        fontSize={FONT_SIZE}
        contentFill={
          !formActive && !!emp && (activeTab === 'card' || activeTab === 'bio')
        }
        header={drawerHeader}
        actions={drawerActions ?? undefined}
        tabs={drawerTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        {drawerChildren}
      </Drawer>

      <Modal
        open={deleteModalOpen}
        title="사용자 삭제"
        description={
          deleteError
            ? `"${emp?.name}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.\n\n${deleteError}`
            : `"${emp?.name}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
        }
        confirmLabel="삭제"
        variant="danger"
        loading={deleteEmpMut.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteError(null)
          setDeleteModalOpen(false)
        }}
      />

      <Modal
        open={bioDeleteModalOpen}
        title="바이오 정보 삭제"
        description={`"${emp?.name}" 사용자의 바이오 정보를 삭제하시겠습니까?`}
        confirmLabel="삭제"
        variant="danger"
        onConfirm={handleBioDeleteConfirm}
        onCancel={() => setBioDeleteModalOpen(false)}
      />
    </>
  )
}
