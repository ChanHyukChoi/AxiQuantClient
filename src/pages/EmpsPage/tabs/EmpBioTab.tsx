import { EmpBioEditPanel } from '@/pages/EmpsPage/components/EmpBioEditPanel'
import { EmpBioView } from '@/pages/EmpsPage/components/EmpBioView'
import type { CardInfo } from '@/types/api'

interface EmpBioTabProps {
  bioEditActive: boolean
  imageUrl?: string
  cards: CardInfo[]
  representativeCardKey: string
  useAsProfile: boolean
  bioLoading?: boolean
  formActive: boolean
  onStartEdit: () => void
  onRepresentativeCardChange: (key: string) => void
  onUseAsProfileChange: (checked: boolean) => void
  onFileSelect: (file: File) => void
  onClear: () => void
  onImportProfile: () => void
}

export const EmpBioTab = ({
  bioEditActive,
  imageUrl,
  cards,
  representativeCardKey,
  useAsProfile,
  bioLoading = false,
  formActive,
  onStartEdit,
  onRepresentativeCardChange,
  onUseAsProfileChange,
  onFileSelect,
  onClear,
  onImportProfile,
}: EmpBioTabProps) => {
  const shellClass = 'flex flex-col flex-1 min-h-0 h-full w-full'

  if (bioEditActive) {
    return (
      <div className={shellClass}>
        <EmpBioEditPanel
          imageUrl={imageUrl}
          cards={cards}
          representativeCardKey={representativeCardKey}
          useAsProfile={useAsProfile}
          loading={bioLoading}
          onRepresentativeCardChange={onRepresentativeCardChange}
          onUseAsProfileChange={onUseAsProfileChange}
          onFileSelect={onFileSelect}
          onClear={onClear}
          onImportProfile={onImportProfile}
        />
      </div>
    )
  }

  return (
    <div className={shellClass}>
      <EmpBioView
        imageUrl={imageUrl}
        cards={cards}
        representativeCardKey={representativeCardKey}
        canEdit={!formActive}
        onStartEdit={onStartEdit}
      />
    </div>
  )
}
