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
import { FRow, FieldValue, SectionTitle } from '@/pages/EmpsPage/components/EmpFieldUi'
import { formatEmpBirthForForm } from '@/lib/mappers/empsMappers'
import { empDeptLabel, empLvLabel } from '@/pages/EmpsPage/utils/empHelpers'
import type { EmpInfo } from '@/types/api'

interface EmpInfoTabProps {
  emp: EmpInfo
  fontSize?: number
}

export const EmpInfoTab = ({ emp, fontSize }: EmpInfoTabProps) => {
  const val = (content: string | undefined, mono?: boolean, small?: boolean) => (
    <FieldValue mono={mono} small={small} fontSize={fontSize}>
      {content || '—'}
    </FieldValue>
  )

  return (
    <div>
      <SectionTitle fontSize={fontSize}>기본 정보</SectionTitle>
      <FRow icon={<User size={12} />} label="이름" fontSize={fontSize}>
        {val(emp.name)}
      </FRow>
      <FRow icon={<Hash size={12} />} label="사번" fontSize={fontSize}>
        {val(emp.udef, true)}
      </FRow>
      <FRow icon={<Users size={12} />} label="성별" fontSize={fontSize}>
        {val(undefined)}
      </FRow>
      <FRow icon={<Calendar size={12} />} label="생년월일" fontSize={fontSize}>
        {val(formatEmpBirthForForm(emp.birth) || undefined, true)}
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={fontSize}>소속</SectionTitle>
      <FRow icon={<Building2 size={12} />} label="회사" fontSize={fontSize}>
        {val(undefined)}
      </FRow>
      <FRow icon={<Network size={12} />} label="부서" fontSize={fontSize}>
        {val(empDeptLabel(emp.dept))}
      </FRow>
      <FRow icon={<Award size={12} />} label="직급" fontSize={fontSize}>
        {val(empLvLabel(emp.lv))}
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={fontSize}>연락처</SectionTitle>
      <FRow icon={<Phone size={12} />} label="전화" fontSize={fontSize}>
        {val(emp.tel, true)}
      </FRow>
      <FRow icon={<Mail size={12} />} label="이메일" fontSize={fontSize}>
        <FieldValue small fontSize={fontSize}>
          {emp.email.trim() !== '' ? emp.email : '—'}
        </FieldValue>
      </FRow>
      <FRow icon={<MapPin size={12} />} label="주소" fontSize={fontSize}>
        <FieldValue small fontSize={fontSize}>
          —
        </FieldValue>
      </FRow>
    </div>
  )
}
