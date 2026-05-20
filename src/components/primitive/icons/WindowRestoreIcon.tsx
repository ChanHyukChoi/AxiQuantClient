interface WindowRestoreIconProps {
  size?: number
  stroke?: string
  strokeWidth?: number
}

export const WindowRestoreIcon = ({
  size = 12,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: WindowRestoreIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M4 1 H12 V8"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="1"
      y="4"
      width="8"
      height="8"
      rx="0.5"
      fill="var(--color-bg, #111316)"
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  </svg>
)
