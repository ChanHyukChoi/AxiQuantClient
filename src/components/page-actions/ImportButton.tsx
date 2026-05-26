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
}: PageActionButtonProps) => (
  <Button
    variant="default"
    size={size}
    leftIcon={<Import size={pageActionIconSize(size)} />}
    onClick={onClick}
    disabled={disabled}
    className={className}
    title="가져오기"
    style={{ fontSize }}
  >
    {showLabel ? '가져오기' : undefined}
  </Button>
)
