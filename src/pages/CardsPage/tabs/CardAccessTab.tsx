import { useMemo, useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { AreaSelectModal } from '@/components/basic/AreaSelectModal'
import { Button } from '@/components/primitive/Button'
import {
  AccLvGroupCards,
  type CardAccLvDisplayItem,
} from '@/pages/CardsPage/components/AccLvGroupCards'
import { LastAreaCard } from '@/pages/CardsPage/components/LastAreaCard'
import { SectionTitle } from '@/pages/CardsPage/components/CardFieldUi'
import type { CardRow } from '@/pages/CardsPage/utils/cardPageHelpers'
import { isAreaActive } from '@/pages/AreaPage/utils/areaHelpers'
import { useMoveCardArea } from '@/hooks/api/useCard'
import type { AreaInfo } from '@/types/api'

interface CardAccessTabProps {
  card: CardRow
  accLvItems: CardAccLvDisplayItem[]
  areaList?: AreaInfo[]
  fontSize: number
}

export const CardAccessTab = ({
  card,
  accLvItems,
  areaList,
  fontSize = 15,
}: CardAccessTabProps) => {
  const [areaModalOpen, setAreaModalOpen] = useState(false)
  const [moveError, setMoveError] = useState<string | null>(null)

  const cardId = card.id ?? card.cid
  const { mutateAsync: moveCardAreaAsync, isPending: isMoving } = useMoveCardArea(cardId)

  const area = card.area?.trim() ? card.area : '—'

  const areaItems = useMemo(
    () =>
      (areaList ?? [])
        .filter((a) => a.id > 0)
        .map((a) => ({
          id: a.id,
          name: a.name?.trim() || '영역',
          active: isAreaActive(a.active),
        })),
    [areaList],
  )

  const handleMoveConfirm = async (areaId: number) => {
    setMoveError(null)
    const ok = await moveCardAreaAsync({ areaId })
    if (!ok) {
      setMoveError('영역 이동 API가 아직 연결되지 않았습니다.')
      return
    }
    setAreaModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <section>
        <SectionTitle fontSize={fontSize}>접근 권한</SectionTitle>
        <AccLvGroupCards items={accLvItems} fontSize={fontSize} />
        <div
          className="flex items-center mt-2"
          style={{
            padding: '5px 0',
            color: 'var(--color-text-cell)',
            fontSize: 15,
          }}
        >
          전체 {accLvItems.length}건
        </div>
      </section>

      <section>
        <SectionTitle fontSize={fontSize}>영역</SectionTitle>
        <LastAreaCard area={area} fontSize={fontSize} />
        <div className="flex flex-col gap-1.5 mt-2">
          <Button
            variant="default"
            size="sm"
            leftIcon={<ArrowRightLeft size={12} />}
            onClick={() => {
              setMoveError(null)
              setAreaModalOpen(true)
            }}
            disabled={areaItems.length === 0}
            loading={isMoving}
          >
            영역 이동
          </Button>
          {moveError ? (
            <p className="text-[12px]" style={{ color: 'var(--color-danger)' }}>
              {moveError}
            </p>
          ) : null}
        </div>
      </section>

      <AreaSelectModal
        open={areaModalOpen}
        title="이동할 영역 선택"
        areas={areaItems}
        onCancel={() => setAreaModalOpen(false)}
        onConfirm={handleMoveConfirm}
      />
    </div>
  )
}
