import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import {
  pageActionIconSize,
  type PageActionButtonProps,
} from '@/components/page-actions/types'

export const SearchButton = ({
  onClick,
  disabled,
  className,
  size = 'md',
  showLabel = true,
  fontSize = 15,
  title,
}: PageActionButtonProps) => {
  const { t } = useTranslation('common')
  const label = t('search')

  return (
    <Button
      variant="accent"
      size={size}
      leftIcon={<Search size={pageActionIconSize(size)} />}
      onClick={onClick}
      disabled={disabled}
      className={className}
      title={title ?? label}
      style={{ fontSize }}
    >
      {showLabel ? label : undefined}
    </Button>
  )
}
