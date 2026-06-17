import { useMemo, useState } from 'react'
import { useLinkageList } from '@/hooks/api/useLinkage'

export const useLinkageData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: rules, isLoading, isError } = useLinkageList()
  const allRules = rules ?? []

  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) return allRules
    const q = searchQuery.trim().toLowerCase()
    return allRules.filter((r) => r.name.toLowerCase().includes(q))
  }, [allRules, searchQuery])

  const selectedRule = useMemo(
    () => filteredRules.find((r) => r.id === selectedId) ?? null,
    [filteredRules, selectedId],
  )

  return {
    rules: filteredRules,
    allRules,
    selectedId,
    selectedRule,
    searchQuery,
    setSearchQuery,
    selectRule: (id: number) => setSelectedId(id),
    isLoading,
    isError: isError || rules === null,
  }
}
