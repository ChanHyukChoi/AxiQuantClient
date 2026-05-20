import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import {
  pageActionIconSize,
  type PageActionButtonProps,
} from '@/components/page-actions/types'

interface AddButtonProps extends PageActionButtonProps {
  children?: ReactNode
}

export const AddButton = ({
  onClick,
  disabled,
  className,
  title = '추가',
  size = 'md',
  showLabel = true,
  children = '추가',
}: AddButtonProps) => (
  <Button
    variant="accent"
    size={size}
    leftIcon={<Plus size={pageActionIconSize(size)} />}
    onClick={onClick}
    disabled={disabled}
    className={className}
    title={title}
  >
    {showLabel ? children : undefined}
  </Button>
)
