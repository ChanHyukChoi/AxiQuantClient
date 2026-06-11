import { Plus } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
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
      <div
        className="flex items-center justify-end flex-shrink-0 px-3 py-1.5"
        style={{ borderBottom: '0.5px solid var(--color-border)' }}
      >
        {editor.actionError ? (
          <p className="text-[13px] mr-auto" style={{ color: '#c75c5c' }}>
            {editor.actionError}
          </p>
        ) : null}
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Plus size={12} />}
          onClick={() => editor.handleAdd()}
        >
          추가
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
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
