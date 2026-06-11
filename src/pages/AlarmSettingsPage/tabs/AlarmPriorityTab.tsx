import { Plus } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { AlarmPriorityDrawer } from '@/pages/AlarmSettingsPage/components/AlarmPriorityDrawer'
import { AlarmPriorityListPane } from '@/pages/AlarmSettingsPage/components/AlarmPriorityListPane'
import { useAlarmPrioritiesData } from '@/pages/AlarmSettingsPage/useAlarmPrioritiesData'
import { useAlarmPriorityEditor } from '@/pages/AlarmSettingsPage/useAlarmPriorityEditor'

export const AlarmPriorityTab = () => {
  const data = useAlarmPrioritiesData()

  const editor = useAlarmPriorityEditor({
    item: data.selectedItem,
    useMock: data.useMock,
    patchMockItem: data.patchMockItem,
    addMockItem: data.addMockItem,
    removeMockItem: data.removeMockItem,
    onDeleted: data.onItemDeleted,
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex items-center justify-end flex-shrink-0 px-3 py-1.5"
        style={{ borderBottom: '0.5px solid var(--color-border)' }}
      >
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Plus size={12} />}
          loading={editor.isAdding}
          onClick={() => void editor.handleAdd()}
        >
          추가
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <AlarmPriorityListPane
          items={data.items}
          selectedId={data.selectedId}
          loading={data.isLoading}
          error={data.isError}
          onSelect={data.selectItem}
        />
        <AlarmPriorityDrawer item={data.selectedItem} editor={editor} />
      </div>
    </div>
  )
}
