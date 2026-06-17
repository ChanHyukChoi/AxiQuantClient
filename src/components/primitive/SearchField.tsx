import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'

interface SearchFieldProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  className?: string
  /** 부모 너비에 맞춤 — 기본은 고정 너비(--size-search-toolbar-width) */
  fill?: boolean
}

export const SearchField = ({
  placeholder,
  value,
  onChange,
  className = '',
  fill = false,
}: SearchFieldProps) => {
  const { t } = useTranslation('common')

  return (
    <div
      className={['app-search-field', fill ? 'app-search-field--fill' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Search aria-hidden size={14} />
      <input
        type="text"
        placeholder={placeholder ?? t('search')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
