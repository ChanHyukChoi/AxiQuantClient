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
import { Badge } from '@/components/primitive/Badge'
import { Input } from '@/components/primitive/Input'
import {
  CheckboxLook,
  FRow,
  FieldValue,
  SectionTitle,
  selectLikeStyle,
  typeBadgeVariant,
} from '@/pages/CardsPage/components/CardFieldUi'
import {
  cardStatusLabel,
  cardTypeLabel,
  type CardRow,
} from '@/pages/CardsPage/utils/cardPageHelpers'
import type { UpdateCardFormValues } from '@/pages/CardsPage/formTypes'
import type { EmpInfo } from '@/types/api'

const FONT_SIZE = 15

const fieldFontStyle = { fontSize: FONT_SIZE } as const

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
      <SectionTitle fontSize={FONT_SIZE}>카드 정보</SectionTitle>
      <FRow icon={<CreditCard size={15} />} label="카드 번호" fontSize={FONT_SIZE}>
        {editMode ? (
          <Input {...register('cardNum')} style={fieldFontStyle} />
        ) : (
          <FieldValue mono fontSize={FONT_SIZE}>
            {card.cardNumber}
          </FieldValue>
        )}
      </FRow>
      <FRow icon={<Tag size={15} />} label="명칭" fontSize={FONT_SIZE}>
        {editMode ? (
          <Input {...register('name')} style={fieldFontStyle} />
        ) : (
          <FieldValue fontSize={FONT_SIZE}>
            {card.name?.trim() ? card.name : '—'}
          </FieldValue>
        )}
      </FRow>
      <FRow icon={<Layers size={15} />} label="유형" fontSize={FONT_SIZE}>
        {editMode ? (
          <select
            {...register('type')}
            className="w-full px-2 py-1 rounded border outline-none"
            style={{ ...selectLikeStyle, ...fieldFontStyle }}
          >
            <option value="직원">직원</option>
            <option value="방문">방문</option>
            <option value="발급">발급</option>
          </select>
        ) : (
          <Badge variant={typeBadgeVariant(t)}>{t}</Badge>
        )}
      </FRow>
      <FRow icon={<CircleCheck size={15} />} label="상태" fontSize={FONT_SIZE}>
        {editMode ? (
          <select
            {...register('status')}
            className="w-full px-2 py-1 rounded border outline-none"
            style={{ ...selectLikeStyle, ...fieldFontStyle }}
          >
            <option value="활성">활성</option>
            <option value="비활성">비활성</option>
          </select>
        ) : (
          <Badge variant={s === '활성' ? 'on' : 'off'}>{s}</Badge>
        )}
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>사용자</SectionTitle>
      <FRow icon={<User size={15} />} label="카드 사용자" fontSize={FONT_SIZE}>
        {editMode ? (
          <Controller
            name="empId"
            control={control}
            render={({ field }) => (
              <select
                className="w-full px-2 py-1 rounded border outline-none"
                style={{ ...selectLikeStyle, ...fieldFontStyle }}
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
          <FieldValue fontSize={FONT_SIZE}>{empLabel}</FieldValue>
        )}
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>기간</SectionTitle>
      <FRow icon={<CalendarCheck size={15} />} label="활성 일시" fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>{activeAt}</FieldValue>
      </FRow>
      <FRow icon={<CalendarX size={15} />} label="비활성 일시" fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>{inactiveAt}</FieldValue>
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>옵션</SectionTitle>
      <FRow icon={<span />} label="APB 면제" fontSize={FONT_SIZE}>
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
      <FRow icon={<span />} label="PIN 면제" fontSize={FONT_SIZE}>
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
