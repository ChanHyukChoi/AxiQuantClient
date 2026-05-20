import { Download } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import {
  pageActionIconSize,
  type PageActionButtonProps,
} from '@/components/page-actions/types'

export const ExportButton = ({
  onClick,
  disabled,
  className,
  title = '보내기',
  size = 'md',
  showLabel = true,
}: PageActionButtonProps) => (
  <Button
    variant="default"
    size={size}
    leftIcon={<Download size={pageActionIconSize(size)} />}
    onClick={onClick}
    disabled={disabled}
    className={className}
    title={title}
  >
    {showLabel ? '보내기' : undefined}
  </Button>
)
