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
}: PageActionButtonProps) => (
  <Button
    variant="default"
    size={size}
    leftIcon={<Printer size={pageActionIconSize(size)} />}
    onClick={onClick}
    disabled={disabled}
    className={className}
    title="인쇄"
    style={{ fontSize }}
  >
    {showLabel ? '인쇄' : undefined}
  </Button>
)
