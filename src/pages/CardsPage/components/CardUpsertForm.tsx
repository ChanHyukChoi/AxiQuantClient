import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Controller,
  useFormState,
  type Control,
  type UseFormClearErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form'
import {
  CalendarCheck,
  CalendarX,
  CircleCheck,
  CreditCard,
  Layers,
  Shield,
  Tag,
  User,
} from 'lucide-react'
import { AccLvSelectModal } from '@/components/basic/AccLvSelectModal'
import { EmpSelectModal } from '@/components/basic/EmpSelectModal'
import { Badge } from '@/components/primitive/Badge'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { Select } from '@/components/primitive/Select'
import { FRow, FieldValue, SectionTitle } from '@/pages/CardsPage/components/CardFieldUi'
import { CardPinChangeSection } from '@/pages/CardsPage/components/CardPinChangeSection'
import type { UpdateCardFormValues } from '@/pages/CardsPage/formTypes'
import type { CardRow } from '@/pages/CardsPage/utils/cardPageHelpers'
import {
  getCardStatusOptions,
  getCardTypeOptions,
} from '@/pages/CardsPage/utils/cardPageHelpers'
import { empDisplayName } from '@/lib/mappers/empsMappers'
import type { AccLvInfo, EmpInfo } from '@/types/api'

const FONT_SIZE = 15
const fieldFontStyle = { fontSize: FONT_SIZE } as const

interface CardUpsertFormProps {
  mode: 'create' | 'edit'
  baseCard?: CardRow
  register: UseFormRegister<UpdateCardFormValues>
  control: Control<UpdateCardFormValues>
  setValue: UseFormSetValue<UpdateCardFormValues>
  clearErrors: UseFormClearErrors<UpdateCardFormValues>
  empList: EmpInfo[] | undefined
  empNameMap: Record<number, string>
  accLvList: AccLvInfo[] | undefined
  accLvNameMap: Record<number, string>
  selectedAccLvIds: number[]
  onAccLvIdsChange: (ids: number[]) => void
  exemptApb: boolean
  exemptPin: boolean
  onExemptApbChange: (v: boolean) => void
  onExemptPinChange: (v: boolean) => void
}

export const CardUpsertForm = ({
  mode,
  baseCard,
  register,
  control,
  setValue,
  clearErrors,
  empList,
  empNameMap,
  accLvList,
  accLvNameMap,
  selectedAccLvIds,
  onAccLvIdsChange,
  exemptApb,
  exemptPin,
  onExemptApbChange,
  onExemptPinChange,
}: CardUpsertFormProps) => {
  const { t } = useTranslation(['card', 'common'])
  const [empModalOpen, setEmpModalOpen] = useState(false)
  const [accLvModalOpen, setAccLvModalOpen] = useState(false)
  const { errors } = useFormState({ control })

  const typeOptions = useMemo(() => getCardTypeOptions(t), [t])
  const statusOptions = useMemo(() => getCardStatusOptions(t), [t])

  const empItems = useMemo(
    () =>
      (Array.isArray(empList) ? empList : [])
        .filter((e) => e.id > 0 && empDisplayName(e))
        .map((e) => ({
          id: e.id,
          name: empDisplayName(e),
          udef: e.udef,
          dept: e.dept,
          lv: e.lv,
        })),
    [empList],
  )

  const accLvItems = useMemo(
    () =>
      (accLvList ?? []).map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description?.trim() || undefined,
        active: a.active,
      })),
    [accLvList],
  )

  const selectedAccLvLabels = selectedAccLvIds.map(
    (id) =>
      accLvNameMap[id] ?? accLvList?.find((a) => a.id === id)?.name ?? t('card:accLv.fallback'),
  )

  return (
    <div className="app-drawer-form">
      <SectionTitle fontSize={FONT_SIZE}>{t('card:section.info')}</SectionTitle>
      <FRow icon={<CreditCard size={15} />} label={t('card:field.cardNumber')} fontSize={FONT_SIZE}>
        {mode === 'edit' ? (
          <FieldValue mono fontSize={FONT_SIZE}>
            {baseCard?.cardNumber?.trim() ? baseCard.cardNumber : t('common:empty')}
          </FieldValue>
        ) : (
          <Input
            {...register('cardNum')}
            error={errors.cardNum?.message}
            style={fieldFontStyle}
          />
        )}
      </FRow>
      <FRow icon={<Tag size={15} />} label={t('card:field.name')} fontSize={FONT_SIZE}>
        <Input
          {...register('name')}
          error={errors.name?.message}
          style={fieldFontStyle}
        />
      </FRow>
      <FRow icon={<Layers size={15} />} label={t('card:field.type')} fontSize={FONT_SIZE}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={typeOptions}
              fontSize={FONT_SIZE}
            />
          )}
        />
      </FRow>
      <FRow icon={<CircleCheck size={15} />} label={t('card:field.status')} fontSize={FONT_SIZE}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={statusOptions}
              fontSize={FONT_SIZE}
            />
          )}
        />
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>{t('card:section.user')}</SectionTitle>
      <FRow icon={<User size={15} />} label={t('card:field.emp')} fontSize={FONT_SIZE}>
        <Controller
          name="empId"
          control={control}
          render={({ field, fieldState }) => {
            const picked =
              field.value != null ? empList?.find((e) => e.id === field.value) : undefined
            const label = (() => {
              if (field.value == null) return t('card:emp.none')
              const fromMap = empNameMap[field.value]
              if (fromMap) return fromMap
              if (picked) {
                const name = empDisplayName(picked)
                if (name) return name
              }
              return t('card:emp.unknown')
            })()
            const empError = fieldState.error?.message
            return (
              <div className="flex flex-col gap-1 w-full">
                <button
                  type="button"
                  className="app-picker-field"
                  style={{
                    ...fieldFontStyle,
                    ...(empError ? { borderColor: '#c75c5c' } : undefined),
                  }}
                  onClick={() => setEmpModalOpen(true)}
                >
                  {label}
                </button>
                {empError ? <p className="app-field-error">{empError}</p> : null}
                <EmpSelectModal
                  open={empModalOpen}
                  emps={empItems}
                  selectedId={field.value}
                  onCancel={() => setEmpModalOpen(false)}
                  onConfirm={(id) => {
                    field.onChange(id)
                    setEmpModalOpen(false)
                  }}
                />
              </div>
            )
          }}
        />
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>{t('card:section.permission')}</SectionTitle>
      <FRow
        icon={<Shield size={15} />}
        label={t('card:field.accLv')}
        fontSize={FONT_SIZE}
        align="top"
      >
        <div className="flex flex-col items-end gap-1.5 w-full min-w-0">
          <button
            type="button"
            className="app-picker-field"
            style={fieldFontStyle}
            onClick={() => setAccLvModalOpen(true)}
          >
            {selectedAccLvIds.length > 0
              ? t('card:accLv.selectedCount', { count: selectedAccLvIds.length })
              : t('card:accLv.select')}
          </button>
          {selectedAccLvLabels.length > 0 ? (
            <div className="app-selected-chips app-scrollbar">
              {selectedAccLvLabels.map((name, i) => (
                <Badge key={selectedAccLvIds[i]} variant="card">
                  {name}
                </Badge>
              ))}
            </div>
          ) : null}
          <AccLvSelectModal
            open={accLvModalOpen}
            items={accLvItems}
            selectedIds={selectedAccLvIds}
            onCancel={() => setAccLvModalOpen(false)}
            onConfirm={(ids) => {
              onAccLvIdsChange(ids)
              setAccLvModalOpen(false)
            }}
          />
        </div>
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>{t('card:section.period')}</SectionTitle>
      <FRow icon={<CalendarCheck size={15} />} label={t('card:field.activeAt')} fontSize={FONT_SIZE}>
        <Controller
          name="issuedAt"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              type="datetime-local"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              style={fieldFontStyle}
            />
          )}
        />
      </FRow>
      <FRow icon={<CalendarX size={15} />} label={t('card:field.inactiveAt')} fontSize={FONT_SIZE}>
        <Controller
          name="expiredAt"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              type="datetime-local"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              style={fieldFontStyle}
            />
          )}
        />
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>{t('card:section.options')}</SectionTitle>
      <FRow icon={<span />} label={t('card:field.exemptApb')} fontSize={FONT_SIZE}>
        <span className="flex justify-end">
          <Checkbox checked={exemptApb} onChange={onExemptApbChange} />
        </span>
      </FRow>
      <FRow icon={<span />} label={t('card:field.exemptPin')} fontSize={FONT_SIZE}>
        <span className="flex justify-end">
          <Checkbox checked={exemptPin} onChange={onExemptPinChange} />
        </span>
      </FRow>
      <CardPinChangeSection control={control} setValue={setValue} clearErrors={clearErrors} />
    </div>
  )
}
