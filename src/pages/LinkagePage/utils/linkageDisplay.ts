import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

export const linkageRuleSummary = (rule: LinkageRule): string => {
  const when = rule.when[0]
  const then = rule.then[0]
  if (!when || !then) return '—'
  const trigger = `${when.device} ACTIVE${when.invert ? ' (반전)' : ''}`
  return `${trigger} → ${then.device} ${then.mode}`
}
