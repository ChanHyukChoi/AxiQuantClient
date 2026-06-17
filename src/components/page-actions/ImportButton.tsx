import { useTranslation } from 'react-i18next'
import { Import } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import {
  pageActionIconSize,
  type PageActionButtonProps,
} from '@/components/page-actions/types'

export const ImportButton = ({
  onClick,
  disabled,
  className,
  size = 'md',
  showLabel = true,
  fontSize = 15,
}: PageActionButtonProps) => {
  const { t } = useTranslation('common')
  const label = t('import')

  return (
    <Button
      variant="default"
      size={size}
      leftIcon={<Import size={pageActionIconSize(size)} />}
      onClick={onClick}
      disabled={disabled}
      className={className}
      title={label}
      style={{ fontSize }}
    >
      {showLabel ? label : undefined}
    </Button>
  )
}
