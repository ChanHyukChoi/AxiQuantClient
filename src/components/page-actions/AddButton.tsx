import type { ReactNode } from 'react'
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
  title = '추가',
  size = 'md',
  showLabel = true,
  fontSize = 15,
  children = '추가',
}: AddButtonProps) => (
  <Button
    variant="accent"
    size={size}
    leftIcon={<Plus size={pageActionIconSize(size)} />}
    onClick={onClick}
    disabled={disabled}
    loading={loading}
    className={className}
    title={title}
    style={{ fontSize }}
  >
    {showLabel ? children : undefined}
  </Button>
)
