import { useMemo, useState } from 'react'
import { LINKAGE_MOCK_RULES } from '@/pages/LinkagePage/linkageMockData'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

export const useLinkageData = () => {
  const [rules, setRules] = useState<LinkageRule[]>(LINKAGE_MOCK_RULES)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) return rules
    const q = searchQuery.trim().toLowerCase()
    return rules.filter((r) => r.name.toLowerCase().includes(q))
  }, [rules, searchQuery])

  const selectedRule = useMemo(
    () => filteredRules.find((r) => r.id === selectedId) ?? null,
    [filteredRules, selectedId],
  )

  return {
    rules: filteredRules,
    allRules: rules,
    selectedId,
    selectedRule,
    searchQuery,
    setSearchQuery,
    selectRule: (id: number) => setSelectedId(id),
    setRules,
  }
}
