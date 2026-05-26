import { Button } from '@/components/primitive/Button'
import { SlidersHorizontal } from 'lucide-react'
import { type PageActionButtonProps } from '@/components/page-actions/types'

interface FilterButtonProps extends PageActionButtonProps {
  iconSize?: number
}

export const FilterButton = ({
  size = 'sm',
  showLabel = true,
  iconSize = 15,
  fontSize = 15,
}: FilterButtonProps) => (
  <Button
    variant="default"
    size={size}
    leftIcon={<SlidersHorizontal size={iconSize} />}
    style={{ fontSize }}
  >
    {showLabel ? '필터' : undefined}
  </Button>
)
