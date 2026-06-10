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

const FONT_SIZE = 15

interface EmpInfoTabProps {
  emp: EmpInfo
}

export const EmpInfoTab = ({ emp }: EmpInfoTabProps) => {
  const val = (content: string | undefined, mono?: boolean) => (
    <FieldValue mono={mono} fontSize={FONT_SIZE}>
      {content || '—'}
    </FieldValue>
  )

  return (
    <div>
      <SectionTitle fontSize={FONT_SIZE}>기본 정보</SectionTitle>
      <FRow icon={<User size={15} />} label="이름" fontSize={FONT_SIZE}>
        {val(emp.name)}
      </FRow>
      <FRow icon={<Hash size={15} />} label="사번" fontSize={FONT_SIZE}>
        {val(emp.udef, true)}
      </FRow>
      <FRow icon={<Users size={15} />} label="성별" fontSize={FONT_SIZE}>
        {val(undefined)}
      </FRow>
      <FRow icon={<Calendar size={15} />} label="생년월일" fontSize={FONT_SIZE}>
        {val(formatEmpBirthForForm(emp.birth) || undefined, true)}
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>소속</SectionTitle>
      <FRow icon={<Building2 size={15} />} label="회사" fontSize={FONT_SIZE}>
        {val(undefined)}
      </FRow>
      <FRow icon={<Network size={15} />} label="부서" fontSize={FONT_SIZE}>
        {val(empDeptLabel(emp.dept))}
      </FRow>
      <FRow icon={<Award size={15} />} label="직급" fontSize={FONT_SIZE}>
        {val(empLvLabel(emp.lv))}
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>연락처</SectionTitle>
      <FRow icon={<Phone size={15} />} label="전화" fontSize={FONT_SIZE}>
        {val(emp.tel, true)}
      </FRow>
      <FRow icon={<Mail size={15} />} label="이메일" fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>
          {emp.email.trim() !== '' ? emp.email : '—'}
        </FieldValue>
      </FRow>
      <FRow icon={<MapPin size={15} />} label="주소" fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>—</FieldValue>
      </FRow>
    </div>
  )
}
