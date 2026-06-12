import { AddButton } from '@/components/page-actions'
import { TabToolbar } from '@/layouts/TabToolbar'
import { HolidayDetailPanel } from '@/pages/TimezoneHolidayPage/components/HolidayDetailPanel'
import { HolidayListPane } from '@/pages/TimezoneHolidayPage/components/HolidayListPane'
import { useHolidayEditor } from '@/pages/TimezoneHolidayPage/useHolidayEditor'
import { useHolidaysData } from '@/pages/TimezoneHolidayPage/useHolidaysData'

export const HolidayTab = () => {
  const data = useHolidaysData()

  const editor = useHolidayEditor({
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
        <HolidayListPane
          items={data.filtered}
          selectedId={data.selectedId}
          searchQuery={data.searchQuery}
          loading={data.isLoading}
          error={data.isError}
          onSearch={data.setSearchQuery}
          onSelect={data.selectItem}
        />
        <HolidayDetailPanel item={data.selectedItem} editor={editor} />
      </div>
    </div>
  )
}
