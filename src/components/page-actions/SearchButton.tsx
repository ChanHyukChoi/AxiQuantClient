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
  title = '검색',
}: PageActionButtonProps) => (
  <Button
    variant="accent"
    size={size}
    leftIcon={<Search size={pageActionIconSize(size)} />}
    onClick={onClick}
    disabled={disabled}
    className={className}
    title={title}
    style={{ fontSize }}
  >
    {showLabel ? '검색' : undefined}
  </Button>
)
