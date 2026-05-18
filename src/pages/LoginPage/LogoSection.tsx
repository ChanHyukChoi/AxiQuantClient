import { useState } from 'react'

export const LogoSection = () => {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex flex-col items-center gap-1 mb-2">
      {!imgError ? (
        <img
          src="/src/assets/logo.png"
          alt="AxiQuant"
          className="h-12 object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
          AxiQuant
        </span>
      )}
      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        출입 관제 시스템
      </span>
    </div>
  )
}
