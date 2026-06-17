import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation(['emp', 'common'])

  const val = (content: string | undefined, mono?: boolean) => (
    <FieldValue mono={mono} fontSize={FONT_SIZE}>
      {content || t('common:empty')}
    </FieldValue>
  )

  return (
    <div>
      <SectionTitle fontSize={FONT_SIZE}>{t('emp:section.basic')}</SectionTitle>
      <FRow icon={<User size={15} />} label={t('emp:field.name')} fontSize={FONT_SIZE}>
        {val(emp.name)}
      </FRow>
      <FRow icon={<Hash size={15} />} label={t('emp:field.empNo')} fontSize={FONT_SIZE}>
        {val(emp.udef, true)}
      </FRow>
      <FRow icon={<Users size={15} />} label={t('emp:field.gender')} fontSize={FONT_SIZE}>
        {val(undefined)}
      </FRow>
      <FRow icon={<Calendar size={15} />} label={t('emp:field.birth')} fontSize={FONT_SIZE}>
        {val(formatEmpBirthForForm(emp.birth) || undefined, true)}
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>{t('emp:section.affiliation')}</SectionTitle>
      <FRow icon={<Building2 size={15} />} label={t('emp:field.company')} fontSize={FONT_SIZE}>
        {val(undefined)}
      </FRow>
      <FRow icon={<Network size={15} />} label={t('emp:field.dept')} fontSize={FONT_SIZE}>
        {val(empDeptLabel(emp.dept))}
      </FRow>
      <FRow icon={<Award size={15} />} label={t('emp:field.lv')} fontSize={FONT_SIZE}>
        {val(empLvLabel(emp.lv))}
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>{t('emp:section.contact')}</SectionTitle>
      <FRow icon={<Phone size={15} />} label={t('emp:field.tel')} fontSize={FONT_SIZE}>
        {val(emp.tel, true)}
      </FRow>
      <FRow icon={<Mail size={15} />} label={t('emp:field.email')} fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>
          {emp.email.trim() !== '' ? emp.email : t('common:empty')}
        </FieldValue>
      </FRow>
      <FRow icon={<MapPin size={15} />} label={t('emp:field.address')} fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>{t('common:empty')}</FieldValue>
      </FRow>
    </div>
  )
}
