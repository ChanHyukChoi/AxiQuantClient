import {
  Award,
  Building2,
  Calendar,
  Hash,
  Mail,
  MapPin,
  Network,
  Phone,
  User,
  Users,
} from 'lucide-react'
import { Input } from '@/components/primitive/Input'
import { FRow, FieldValue, SectionTitle } from '@/pages/EmpsPage/components/EmpFieldUi'
import type { EmpInfo, UpdateEmpRequest } from '@/types/api'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

interface EmpInfoTabProps {
  emp: EmpInfo
  editMode: boolean
  register: UseFormRegister<UpdateEmpRequest>
  errors: FieldErrors<UpdateEmpRequest>
}

export const EmpInfoTab = ({ emp, editMode, register, errors }: EmpInfoTabProps) => {
  const val = (content: string | undefined, mono?: boolean, small?: boolean) => (
    <FieldValue mono={mono} small={small}>
      {content || '—'}
    </FieldValue>
  )

  return (
    <div>
      <SectionTitle>기본 정보</SectionTitle>
      <FRow icon={<User size={12} />} label="이름">
        {editMode ? (
          <Input {...register('name')} style={{ width: 148 }} />
        ) : (
          val(emp.name)
        )}
      </FRow>
      <FRow icon={<Hash size={12} />} label="사번">
        {val(emp.udef, true)}
      </FRow>
      <FRow icon={<Users size={12} />} label="성별">
        {val(undefined)}
      </FRow>
      <FRow icon={<Calendar size={12} />} label="생년월일">
        {val(undefined, true)}
      </FRow>

      <div className="mt-4" />
      <SectionTitle>소속</SectionTitle>
      <FRow icon={<Building2 size={12} />} label="회사">
        {val(undefined)}
      </FRow>
      <FRow icon={<Network size={12} />} label="부서">
        {editMode ? (
          <Input
            type="number"
            {...register('dept', { valueAsNumber: true })}
            style={{ width: 148 }}
          />
        ) : (
          val(emp.dept !== 0 ? String(emp.dept) : undefined)
        )}
      </FRow>
      <FRow icon={<Award size={12} />} label="직급">
        {val(undefined)}
      </FRow>

      <div className="mt-4" />
      <SectionTitle>연락처</SectionTitle>
      <FRow icon={<Phone size={12} />} label="전화">
        {editMode ? (
          <Input {...register('tel')} style={{ width: 148 }} />
        ) : (
          val(emp.tel, true)
        )}
      </FRow>
      <FRow icon={<Mail size={12} />} label="이메일">
        {editMode ? (
          <Input
            {...register('email')}
            error={errors.email?.message}
            style={{ width: 148 }}
          />
        ) : (
          <FieldValue small>{emp.email.trim() !== '' ? emp.email : '—'}</FieldValue>
        )}
      </FRow>
      <FRow icon={<MapPin size={12} />} label="주소">
        <span
          className="text-[12px] text-right"
          style={{ color: 'var(--color-text)', maxWidth: 148, lineHeight: 1.5 }}
        >
          —
        </span>
      </FRow>
    </div>
  )
}
