import { Button } from '@/components/primitive/Button'
import { SlidersHorizontal } from 'lucide-react'
import { type PageActionButtonProps } from '@/components/page-actions/types'

interface FilterButtonProps extends PageActionButtonProps {
  iconSize?: number
}

/** 목록 옵션 모달 탭(데이터 필터)과 동일한 활성 스타일 */
const filterActiveStyle: React.CSSProperties = {
  background: 'var(--color-btn-hover)',
  color: 'var(--color-text)',
  borderColor: 'var(--color-border)',
}

export const FilterButton = ({
  size = 'sm',
  showLabel = true,
  iconSize = 15,
  fontSize = 15,
  active = false,
  style,
  ...props
}: FilterButtonProps & { active?: boolean }) => (
  <Button
    variant="default"
    size={size}
    leftIcon={<SlidersHorizontal size={iconSize} />}
    style={{ fontSize, ...(active ? filterActiveStyle : {}), ...style }}
    {...props}
  >
    {showLabel ? '필터' : undefined}
  </Button>
)
