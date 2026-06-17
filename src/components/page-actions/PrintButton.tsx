import { useTranslation } from 'react-i18next'
import { Printer } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import {
  pageActionIconSize,
  type PageActionButtonProps,
} from '@/components/page-actions/types'

export const PrintButton = ({
  onClick,
  disabled,
  className,
  size = 'md',
  showLabel = true,
  fontSize = 15,
}: PageActionButtonProps) => {
  const { t } = useTranslation('common')
  const label = t('print')

  return (
    <Button
      variant="default"
      size={size}
      leftIcon={<Printer size={pageActionIconSize(size)} />}
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
