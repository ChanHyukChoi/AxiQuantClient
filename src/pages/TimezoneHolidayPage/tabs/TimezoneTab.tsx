import { AddButton } from '@/components/page-actions'
import { TabToolbar } from '@/layouts/TabToolbar'
import { TimezoneDetailPanel } from '@/pages/TimezoneHolidayPage/components/TimezoneDetailPanel'
import { TimezoneListPane } from '@/pages/TimezoneHolidayPage/components/TimezoneListPane'
import { useTimezoneEditor } from '@/pages/TimezoneHolidayPage/useTimezoneEditor'
import { useTimezonesData } from '@/pages/TimezoneHolidayPage/useTimezonesData'

export const TimezoneTab = () => {
  const data = useTimezonesData()

  const editor = useTimezoneEditor({
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
        <AddButton onClick={editor.handleAdd} />
      </TabToolbar>
      <div className="flex flex-1 overflow-hidden min-h-0">
        <TimezoneListPane
          items={data.filtered}
          selectedId={data.selectedId}
          searchQuery={data.searchQuery}
          loading={data.isLoading}
          error={data.isError}
          onSearch={data.setSearchQuery}
          onSelect={data.selectItem}
        />
        <TimezoneDetailPanel item={data.selectedItem} editor={editor} />
      </div>
    </div>
  )
}
