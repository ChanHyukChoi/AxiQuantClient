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
  active = false,
  ...props
}: FilterButtonProps & { active?: boolean }) => (
  <Button
    variant={active ? 'accent' : 'default'}
    size={size}
    leftIcon={<SlidersHorizontal size={iconSize} />}
    style={{ fontSize }}
    {...props}
  >
    {showLabel ? '필터' : undefined}
  </Button>
)
