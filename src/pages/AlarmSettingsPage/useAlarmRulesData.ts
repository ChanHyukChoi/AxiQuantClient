import { useCallback, useMemo, useState } from 'react'
import {
  DEFAULT_ALARM_RULE_EXTRA,
  type AlarmRuleDisplay,
} from '@/pages/AlarmSettingsPage/alarmRuleTypes'
import { useAlarms } from '@/hooks/api/useAlarmSettings'
import { useScps } from '@/hooks/api/useDeviceControl'
import type { AlarmInfo } from '@/types/api'

const alarmToDisplay = (alarm: AlarmInfo): AlarmRuleDisplay => ({
  ...alarm,
  ...DEFAULT_ALARM_RULE_EXTRA,
  eventCode: alarm.eventCondition?.trim() || DEFAULT_ALARM_RULE_EXTRA.eventCode,
})

export const useAlarmRulesData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: alarmList, isLoading, isError } = useAlarms()
  const { data: scpList } = useScps()

  const rules: AlarmRuleDisplay[] = (alarmList ?? []).map(alarmToDisplay)

  const scpNameMap = useMemo(() => {
    const map: Record<number, string> = {}
    ;(scpList ?? []).forEach((s) => {
      map[s.id] = s.name
    })
    return map
  }, [scpList])

  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) return rules
    const q = searchQuery.trim().toLowerCase()
    return rules.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.deviceType.toLowerCase().includes(q) ||
        (scpNameMap[r.scpId] ?? '').toLowerCase().includes(q),
    )
  }, [rules, searchQuery, scpNameMap])

  const selectedRule = useMemo(
    () => rules.find((r) => r.id === selectedId) ?? null,
    [rules, selectedId],
  )

  const selectRule = useCallback((rule: AlarmRuleDisplay) => {
    setSelectedId(rule.id)
  }, [])

  const onRuleDeleted = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    rules,
    filteredRules,
    selectedId,
    selectedRule,
    scpNameMap,
    scpList: scpList ?? [],
    searchQuery,
    setSearchQuery,
    selectRule,
    isLoading,
    isError: isError || alarmList === null,
    onRuleDeleted,
  }
}
