import { useCallback, useMemo, useState } from 'react'
import {
  DEFAULT_ALARM_RULE_EXTRA,
  type AlarmRuleDisplay,
} from '@/pages/AlarmSettingsPage/alarmRuleTypes'
import { MOCK_ALARM_RULES, MOCK_ALARM_SCPS } from '@/pages/AlarmSettingsPage/alarmRulesMockData'
import { useAlarms } from '@/hooks/api/useAlarmSettings'
import { useScps } from '@/hooks/api/useDeviceControl'
import type { AlarmInfo } from '@/types/api'

const forceAlarmRulesMock = import.meta.env.VITE_ALARM_RULES_MOCK === 'true'

const alarmToDisplay = (alarm: AlarmInfo): AlarmRuleDisplay => ({
  ...alarm,
  ...DEFAULT_ALARM_RULE_EXTRA,
  eventCode: alarm.eventCondition?.trim() || DEFAULT_ALARM_RULE_EXTRA.eventCode,
})

export const useAlarmRulesData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mockRules, setMockRules] = useState<AlarmRuleDisplay[]>(MOCK_ALARM_RULES)

  const { data: alarmList, isLoading, isError } = useAlarms()
  const { data: scpList } = useScps()

  const useMock =
    forceAlarmRulesMock ||
    (import.meta.env.DEV && !isLoading && (isError || alarmList === null))

  const rules: AlarmRuleDisplay[] = useMock
    ? mockRules
    : (alarmList ?? []).map(alarmToDisplay)

  const scpNameMap = useMemo(() => {
    const map: Record<number, string> = {}
    ;(scpList ?? []).forEach((s) => {
      map[s.id] = s.name
    })
    if (useMock) {
      map[1] = 'DGU-TEST-1'
      map[2] = 'Adam242'
    }
    return map
  }, [scpList, useMock])

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

  const patchMockRule = useCallback((id: number, patch: Partial<AlarmRuleDisplay>) => {
    setMockRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }, [])

  const addMockRule = useCallback((): number => {
    const newId = Math.max(0, ...mockRules.map((r) => r.id)) + 1
    const created: AlarmRuleDisplay = {
      id: newId,
      name: '새 경보',
      active: 1,
      deviceId: 0,
      deviceType: '',
      eventCondition: '',
      ...DEFAULT_ALARM_RULE_EXTRA,
    }
    setMockRules((prev) => [...prev, created])
    setSelectedId(newId)
    return newId
  }, [mockRules])

  const removeMockRule = useCallback((id: number) => {
    setMockRules((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const onRuleDeleted = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    useMock,
    rules,
    filteredRules,
    selectedId,
    selectedRule,
    scpNameMap,
    scpList: useMock ? MOCK_ALARM_SCPS : (scpList ?? []),
    searchQuery,
    setSearchQuery,
    selectRule,
    isLoading,
    isError: isError || (!useMock && alarmList === null),
    patchMockRule,
    addMockRule,
    removeMockRule,
    onRuleDeleted,
  }
}
