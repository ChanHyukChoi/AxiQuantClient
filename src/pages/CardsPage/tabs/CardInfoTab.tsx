import { Controller, type Control, type UseFormRegister } from 'react-hook-form'
import {
  CalendarCheck,
  CalendarX,
  CircleCheck,
  CreditCard,
  Layers,
  Tag,
  User,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import {
  CheckboxLook,
  FRow,
  FieldValue,
  SectionTitle,
  selectLikeStyle,
  typeBadgeVariant,
} from '@/pages/CardsPage/components/CardFieldUi'
import { cardStatusLabel, cardTypeLabel, type CardRow } from '@/pages/CardsPage/utils/cardPageHelpers'
import type { UpdateCardFormValues } from '@/pages/CardsPage/formTypes'
import type { EmpInfo } from '@/types/api'

interface CardInfoTabProps {
  card: CardRow
  editMode: boolean
  register: UseFormRegister<UpdateCardFormValues>
  control: Control<UpdateCardFormValues>
  empList: EmpInfo[] | undefined
  empNameMap: Record<number, string>
  exemptApb: boolean
  exemptPin: boolean
  onExemptApbChange: (v: boolean) => void
  onExemptPinChange: (v: boolean) => void
}

export const CardInfoTab = ({
  card,
  editMode,
  register,
  control,
  empList,
  empNameMap,
  exemptApb,
  exemptPin,
  onExemptApbChange,
  onExemptPinChange,
}: CardInfoTabProps) => {
  const t = cardTypeLabel(card)
  const s = cardStatusLabel(card)
  const empLabel =
    card.empId != null ? (empNameMap[card.empId] ?? card.empName ?? '—') : '—'
  const activeAt = card.issuedAt?.trim() ? card.issuedAt : '—'
  const inactiveAt = card.expiredAt?.trim() ? card.expiredAt : '—'

  return (
    <div>
      <SectionTitle>카드 정보</SectionTitle>
      <FRow icon={<CreditCard size={12} />} label="카드 번호">
        {editMode ? (
          <Input {...register('cardNum')} style={{ width: 148 }} />
        ) : (
          <FieldValue mono>{card.cardNumber}</FieldValue>
        )}
      </FRow>
      <FRow icon={<Tag size={12} />} label="명칭">
        {editMode ? (
          <Input {...register('name')} style={{ width: 148 }} />
        ) : (
          <FieldValue>{card.name?.trim() ? card.name : '—'}</FieldValue>
        )}
      </FRow>
      <FRow icon={<Layers size={12} />} label="유형">
        {editMode ? (
          <select
            {...register('type')}
            className="w-full text-[12px] px-2 py-1 rounded border outline-none"
            style={{ ...selectLikeStyle, width: 148 }}
          >
            <option value="직원">직원</option>
            <option value="방문">방문</option>
            <option value="발급">발급</option>
          </select>
        ) : (
          <Badge variant={typeBadgeVariant(t)}>{t}</Badge>
        )}
      </FRow>
      <FRow icon={<CircleCheck size={12} />} label="상태">
        {editMode ? (
          <select
            {...register('status')}
            className="w-full text-[12px] px-2 py-1 rounded border outline-none"
            style={{ ...selectLikeStyle, width: 148 }}
          >
            <option value="활성">활성</option>
            <option value="비활성">비활성</option>
          </select>
        ) : (
          <Badge variant={s === '활성' ? 'on' : 'off'}>{s}</Badge>
        )}
      </FRow>

      <div className="mt-4" />
      <SectionTitle>사용자</SectionTitle>
      <FRow icon={<User size={12} />} label="카드 사용자">
        {editMode ? (
          <Controller
            name="empId"
            control={control}
            render={({ field }) => (
              <select
                className="w-full text-[12px] px-2 py-1 rounded border outline-none"
                style={{ ...selectLikeStyle, width: 148 }}
                value={field.value === undefined ? '' : String(field.value)}
                onChange={(e) => {
                  const v = e.target.value
                  field.onChange(v === '' ? undefined : Number(v))
                }}
              >
                <option value="">선택 안 함</option>
                {(empList ?? []).map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            )}
          />
        ) : (
          <FieldValue>{empLabel}</FieldValue>
        )}
      </FRow>

      <div className="mt-4" />
      <SectionTitle>기간</SectionTitle>
      <FRow icon={<CalendarCheck size={12} />} label="활성 일시">
        <span className="text-[11px] text-right" style={{ color: 'var(--color-text)' }}>
          {activeAt}
        </span>
      </FRow>
      <FRow icon={<CalendarX size={12} />} label="비활성 일시">
        <span className="text-[11px] text-right" style={{ color: 'var(--color-text)' }}>
          {inactiveAt}
        </span>
      </FRow>

      <div className="mt-4" />
      <SectionTitle>옵션</SectionTitle>
      <FRow icon={<span className="w-3" />} label="APB 면제">
        {editMode ? (
          <label className="flex items-center justify-end gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={exemptApb}
              onChange={(e) => onExemptApbChange(e.target.checked)}
              className="accent-[var(--color-accent)]"
            />
          </label>
        ) : (
          <span className="flex justify-end">
            <CheckboxLook checked={!!card.exemptApb} />
          </span>
        )}
      </FRow>
      <FRow icon={<span className="w-3" />} label="PIN 면제">
        {editMode ? (
          <label className="flex items-center justify-end gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={exemptPin}
              onChange={(e) => onExemptPinChange(e.target.checked)}
              className="accent-[var(--color-accent)]"
            />
          </label>
        ) : (
          <span className="flex justify-end">
            <CheckboxLook checked={!!card.exemptPin} />
          </span>
        )}
      </FRow>
    </div>
  )
}
