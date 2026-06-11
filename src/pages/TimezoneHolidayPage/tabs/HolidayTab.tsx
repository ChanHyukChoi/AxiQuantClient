import { Plus } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
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
      <div
        className="flex items-center justify-end flex-shrink-0 px-3 py-1.5"
        style={{ borderBottom: '0.5px solid var(--color-border)' }}
      >
        {editor.actionError ? (
          <p className="app-text-xs mr-auto" style={{ color: '#c75c5c' }}>
            {editor.actionError}
          </p>
        ) : null}
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Plus size={12} />}
          onClick={() => editor.handleAdd()}
        >
          ì¶”ê?
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
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
