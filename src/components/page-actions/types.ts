import type { ButtonHTMLAttributes } from 'react'

export interface PageActionButtonProps extends Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'disabled' | 'className' | 'title'
> {
  size?: 'sm' | 'md'
  /** false면 라벨 없이 title만 (툴바 아이콘 버튼) */
  showLabel?: boolean
}

export const pageActionIconSize = (size: NonNullable<PageActionButtonProps['size']>) =>
  size === 'sm' ? 14 : 12
