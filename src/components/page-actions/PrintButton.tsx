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
  title = '인쇄',
  size = 'md',
  showLabel = true,
}: PageActionButtonProps) => (
  <Button
    variant="default"
    size={size}
    leftIcon={<Printer size={pageActionIconSize(size)} />}
    onClick={onClick}
    disabled={disabled}
    className={className}
    title={title}
  >
    {showLabel ? '인쇄' : undefined}
  </Button>
)
