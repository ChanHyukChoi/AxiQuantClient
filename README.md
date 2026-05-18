# AxiQuant Client

보안/출입 관제 시스템 프론트엔드  
Electron + React 기반 데스크톱/웹 듀얼 타겟 애플리케이션

## 기술스택

| 분류 | 기술 |
|------|------|
| Runtime | Electron + React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v4 (CSS 변수만 사용) |
| 클라이언트 상태 | Zustand v5 |
| 서버 상태 | TanStack Query v5 |
| 라우팅 | TanStack Router |
| API | axios |
| 폼 | React Hook Form + Zod |
| 실시간 | SSE (`fetch` + Bearer) |

## 프로젝트 구조

```
src/
├── api/              # HTTP 호출 (도메인별)
├── components/ui/    # 공용 UI
├── hooks/            # TanStack Query 래퍼
├── layouts/          # RootLayout, TitleBar, Sidebar
├── lib/              # axios, sse, queryKeys, wireJson, *Mappers
├── pages/            # 라우트 페이지
│   ├── *.tsx         # Emps, Cards, Access, Login …
│   ├── AreaPage/
│   ├── CardFmtPage/
│   ├── DevicesPage/
│   ├── EventMonitorPage/
│   ├── UsersPage/
│   └── AuditLogPage/
├── stores/           # auth, sidebar, theme
└── types/
    └── api/          # 도메인별 타입 (index.ts 배럴)
```

상세 설명은 [DOCS.md](./DOCS.md) 참고.

## API 계약 (요약)

- **기준**: 서버 proto/WPF wire. UI 전용 필드는 `src/lib/*Mappers.ts`에서 변환.
- **래퍼**: emps/users는 flat body, 카드·구역 등은 `{ card }`, `{ area }` 형태.
- **카드**: `POST` 시 `card.id` = 사용자 입력 카드번호 (자동 발번 없음).
- **미구현** (서버 404): `/api/users`, `/api/audit-log`, `/api/access-log`, `/api/alarm-log` → 빈 목록 + UI 안내.

## 개발 환경

- Node.js v22 이상
- npm v10 이상

## 시작하기

```bash
npm install
npm run dev      # Electron 개발
npm run build    # 프로덕션 빌드
```

## 디자인 시스템

- 기본 다크 테마 (`data-theme="light"`로 라이트 전환)
- Tailwind 커스텀 컬러 없음 — `src/index.css` CSS 변수만 사용
- 주요 변수: `--color-bg`, `--color-accent`, `--color-sidebar`, `--color-text`, `--color-text-muted`
