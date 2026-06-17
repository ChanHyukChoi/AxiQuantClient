import i18n from '@/lib/i18n'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

export const linkageRuleSummary = (rule: LinkageRule): string => {
  const t = i18n.getFixedT(null, 'linkage')
  const when = rule.when[0]
  const then = rule.then[0]
  if (!when || !then) return '—'
  const trigger = `${when.device} ACTIVE${when.invert ? t('summary.invertSuffix') : ''}`
  return `${trigger} → ${then.device} ${then.mode}`
}
