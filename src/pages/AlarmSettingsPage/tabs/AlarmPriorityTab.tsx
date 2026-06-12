import { AddButton } from '@/components/page-actions'
import { TabToolbar } from '@/layouts/TabToolbar'
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
      <TabToolbar>
        <AddButton
          onClick={() => void editor.handleAdd()}
          loading={editor.isAdding}
        />
      </TabToolbar>
      <div className="flex flex-1 overflow-hidden min-h-0">
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
