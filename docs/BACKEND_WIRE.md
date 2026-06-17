# 백엔드 Wire 스펙 (프론트 선행 구현)

> 프론트가 먼저 구현한 엔드포인트 제안입니다. WPF AdminClient와 맞추면서 조정하세요.

## 사원 미디어 (`src/api/empMedia.ts` → `hooks/api/useEmpMedia.ts`)

| 메서드 | 경로 | Body | 비고 |
|--------|------|------|------|
| PUT | `/api/emps/{id}/photo` | JPEG bytes (`Content-Type: image/jpeg`) | WPF `ImageHelper` 규칙 적용 후 전송 |
| DELETE | `/api/emps/{id}/photo` | — | 프로필 사진 삭제 |
| PUT | `/api/emps/{id}/bio` | 이미지 bytes (`image/jpeg` \| `image/png`) | 바이오 등록 이미지 |
| DELETE | `/api/emps/{id}/bio` | — | 바이오 삭제 |

- UI: `EmpDrawer` → `useSyncEmpPhoto` / `useSyncEmpBio` → `api/empMedia.ts`
- 사원 flat body (`POST/PUT /api/emps`)에는 이미지 필드 없음 — 미디어는 위 전용 엔드포인트 사용
- `GET /api/emps` 응답에 `photoUrl` (또는 base64) 제공 시 드로어 헤더에 표시

## 카드 영역 이동 (`src/api/card.ts`)

| 메서드 | 경로 | Body |
|--------|------|------|
| POST | `/api/card/{cid}/area` | `{ "areaId": number }` |

## 연동 규칙 (`src/api/linkage.ts`)

| 메서드 | 경로 | Body |
|--------|------|------|
| GET | `/api/linkage` | — (배열 또는 `{ items: [] }`) |
| POST | `/api/linkage` | `LinkageRule` (id 제외) |
| PUT | `/api/linkage/{id}` | `LinkageRule` |
| DELETE | `/api/linkage/{id}` | — |

타입: `src/pages/LinkagePage/linkageTypes.ts`

## 기존 문서

- 일반 CRUD wire: `PROJECT_STRUCTURE.md` §4.2 `api/`, `types/api/`, `lib/mappers/`
