import {
  Award,
  Building2,
  Calendar,
  Hash,
  Mail,
  Phone,
  User,
} from 'lucide-react'
import { Controller, type Control, type UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/primitive/Input'
import { Select } from '@/components/primitive/Select'
import { FRow, SectionTitle } from '@/pages/EmpsPage/components/EmpFieldUi'
import type { UpdateEmpFormValues } from '@/pages/EmpsPage/formTypes'
import { EMP_DEPT_OPTIONS, EMP_LV_OPTIONS } from '@/pages/EmpsPage/utils/empHelpers'
import type { FieldErrors } from 'react-hook-form'

const FONT_SIZE = 15
const fieldFontStyle = { fontSize: FONT_SIZE } as const

interface EmpUpsertFormProps {
  mode: 'create' | 'edit'
  register: UseFormRegister<UpdateEmpFormValues>
  control: Control<UpdateEmpFormValues>
  errors: FieldErrors<UpdateEmpFormValues>
}

export const EmpUpsertForm = ({ mode, register, control, errors }: EmpUpsertFormProps) => {
  return (
    <div>
      <SectionTitle fontSize={FONT_SIZE}>기본 정보</SectionTitle>
      <FRow icon={<User size={15} />} label="이름" fontSize={FONT_SIZE}>
        <Input
          {...register('name')}
          error={errors.name?.message}
          style={fieldFontStyle}
        />
      </FRow>
      <FRow icon={<User size={15} />} label="이름2" fontSize={FONT_SIZE}>
        <Input {...register('name2')} style={fieldFontStyle} />
      </FRow>
      <FRow icon={<User size={15} />} label="성" fontSize={FONT_SIZE}>
        <Input {...register('lastName')} style={fieldFontStyle} />
      </FRow>
      {mode === 'create' ? (
        <FRow icon={<Hash size={15} />} label="사번" fontSize={FONT_SIZE} align="top">
          <div className="flex flex-col gap-0.5 w-full min-w-0">
            <Input {...register('empNo')} style={fieldFontStyle} />
            <p
              className="leading-snug"
              style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}
            >
              WPF AdminClient와 동일: 이 값은 API 본문에 넣지 않습니다.
            </p>
          </div>
        </FRow>
      ) : null}
      <FRow icon={<Calendar size={15} />} label="생년월일" fontSize={FONT_SIZE}>
        <Input
          {...register('birth')}
          type="date"
          error={errors.birth?.message}
          style={fieldFontStyle}
        />
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>소속</SectionTitle>
      <FRow icon={<Building2 size={15} />} label="부서" fontSize={FONT_SIZE}>
        <Controller
          name="dept"
          control={control}
          render={({ field }) => (
            <Select
              value={String(field.value ?? 0)}
              onChange={(v) => field.onChange(Number(v))}
              onBlur={field.onBlur}
              options={EMP_DEPT_OPTIONS}
              fontSize={FONT_SIZE}
            />
          )}
        />
      </FRow>
      <FRow icon={<Award size={15} />} label="직급" fontSize={FONT_SIZE}>
        <Controller
          name="lv"
          control={control}
          render={({ field }) => (
            <Select
              value={String(field.value ?? 0)}
              onChange={(v) => field.onChange(Number(v))}
              onBlur={field.onBlur}
              options={EMP_LV_OPTIONS}
              fontSize={FONT_SIZE}
            />
          )}
        />
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>연락처</SectionTitle>
      <FRow icon={<Phone size={15} />} label="전화" fontSize={FONT_SIZE}>
        <Input {...register('tel')} style={fieldFontStyle} />
      </FRow>
      <FRow icon={<Mail size={15} />} label="이메일" fontSize={FONT_SIZE}>
        <Input
          {...register('email')}
          error={errors.email?.message}
          style={fieldFontStyle}
        />
      </FRow>
    </div>
  )
}
