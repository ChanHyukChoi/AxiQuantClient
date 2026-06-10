import { useEffect, useRef } from 'react'
import {
  Controller,
  useWatch,
  type Control,
  type UseFormClearErrors,
  type UseFormSetValue,
} from 'react-hook-form'
import { KeyRound } from 'lucide-react'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { FRow } from '@/pages/CardsPage/components/CardFieldUi'
import type { UpdateCardFormValues } from '@/pages/CardsPage/formTypes'

const FONT_SIZE = 15
const PIN_LENGTH = 4
const fieldFontStyle = { fontSize: FONT_SIZE } as const

interface CardPinChangeSectionProps {
  control: Control<UpdateCardFormValues>
  setValue: UseFormSetValue<UpdateCardFormValues>
  clearErrors: UseFormClearErrors<UpdateCardFormValues>
}

const sanitizePinInput = (raw: string): string =>
  raw.replace(/\D/g, '').slice(0, PIN_LENGTH)

interface PinInputRowProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
}

const PinInputRow = ({ label, value, onChange, onBlur, error }: PinInputRowProps) => (
  <FRow icon={<KeyRound size={15} />} label={label} fontSize={FONT_SIZE}>
    <div className="app-pin-input-wrap">
      <Input
        type="password"
        inputMode="numeric"
        autoComplete="off"
        maxLength={PIN_LENGTH}
        value={value}
        onChange={(e) => onChange(sanitizePinInput(e.target.value))}
        onBlur={onBlur}
        error={error}
        style={fieldFontStyle}
      />
      <span className="app-pin-input-wrap__counter" aria-hidden>
        {value.length}/{PIN_LENGTH}
      </span>
    </div>
  </FRow>
)

export const CardPinChangeSection = ({
  control,
  setValue,
  clearErrors,
}: CardPinChangeSectionProps) => {
  const changePin = useWatch({ control, name: 'changePin' })
  const pinFieldsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!changePin) return
    const id = requestAnimationFrame(() => {
      pinFieldsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    })
    return () => cancelAnimationFrame(id)
  }, [changePin])

  const handleChangePinToggle = (checked: boolean) => {
    setValue('changePin', checked, { shouldValidate: false, shouldDirty: true })
    clearErrors(['pin', 'pinConfirm'])
    if (!checked) {
      setValue('pin', '', { shouldValidate: false })
      setValue('pinConfirm', '', { shouldValidate: false })
    }
  }

  return (
    <>
      <FRow icon={<span />} label="PIN 변경" fontSize={FONT_SIZE}>
        <span className="flex justify-end">
          <Controller
            name="changePin"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={handleChangePinToggle} />
            )}
          />
        </span>
      </FRow>

      {changePin ? (
        <>
          <Controller
            name="pin"
            control={control}
            render={({ field, fieldState }) => (
              <PinInputRow
                label="PIN"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="pinConfirm"
            control={control}
            render={({ field, fieldState }) => (
              <PinInputRow
                label="PIN 확인"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <div ref={pinFieldsEndRef} className="h-0" aria-hidden />
        </>
      ) : null}
    </>
  )
}
