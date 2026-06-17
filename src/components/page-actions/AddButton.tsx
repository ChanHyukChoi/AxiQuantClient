import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import {
  pageActionIconSize,
  type PageActionButtonProps,
} from '@/components/page-actions/types'

interface AddButtonProps extends PageActionButtonProps {
  children?: ReactNode
  loading?: boolean
}

export const AddButton = ({
  onClick,
  disabled,
  loading = false,
  className,
  title,
  size = 'md',
  showLabel = true,
  fontSize = 15,
  children,
}: AddButtonProps) => {
  const { t } = useTranslation('common')
  const label = children ?? t('add')
  const resolvedTitle = title ?? t('add')

  return (
    <Button
      variant="accent"
      size={size}
      leftIcon={<Plus size={pageActionIconSize(size)} />}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={className}
      title={resolvedTitle}
      style={{ fontSize }}
    >
      {showLabel ? label : undefined}
    </Button>
  )
}
