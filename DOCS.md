# AxiQuant Client — 프로젝트 문서

> 보안/출입 관제 시스템 프론트엔드  
> Electron + React 기반 데스크톱/웹 듀얼 타겟 애플리케이션

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [폴더 구조](#3-폴더-구조)
4. [파일별 용도 설명](#4-파일별-용도-설명)
5. [통신 구조](#5-통신-구조)
6. [인증 흐름](#6-인증-흐름)
7. [상태 관리](#7-상태-관리)
8. [라우팅 구조](#8-라우팅-구조)
9. [UI 컴포넌트 시스템](#9-ui-컴포넌트-시스템)
10. [Electron 듀얼 타겟](#10-electron-듀얼-타겟)
11. [개발 환경 실행](#11-개발-환경-실행)

---

## 1. 프로젝트 개요

AxiQuant Client는 **출입 관제 시스템**의 프론트엔드입니다.  
카드 사용자 관리, 카드 관리, 접근권한 설정 등 보안 시스템을 운영하는 관리자 UI입니다.

**듀얼 타겟**: 동일한 React 코드를 Electron(데스크톱 앱)과 브라우저(웹) 양쪽에서 실행할 수 있습니다.

- **Electron 환경**: 크롬 창 없는 커스텀 타이틀바, 사이드바 접힘/펼침 토글
- **웹 환경**: 사이드바가 오버레이 드로어 방식으로 동작

---

## 2. 기술 스택

### 런타임 & 빌드

| 라이브러리               | 버전   | 용도                                  |
| ------------------------ | ------ | ------------------------------------- |
| **Electron**             | 30.0.1 | 데스크톱 앱 껍데기 (Node.js 프로세스) |
| **Vite**                 | 5.1.6  | 번들러 및 개발 서버                   |
| **TypeScript**           | 5.2.2  | 타입 안전성                           |
| **vite-plugin-electron** | 0.28.6 | Vite ↔ Electron 통합                  |

### UI

| 라이브러리       | 버전   | 용도                                       |
| ---------------- | ------ | ------------------------------------------ |
| **React**        | 18.2.0 | UI 렌더링                                  |
| **Tailwind CSS** | v4.3.0 | 유틸리티 CSS (config 파일 없음, 자동 스캔) |
| **lucide-react** | 1.14.0 | 아이콘                                     |
| **Pretendard**   | 1.3.9  | 한글 폰트                                  |

### 상태 & 서버 데이터

| 라이브러리         | 버전      | 용도                                        |
| ------------------ | --------- | ------------------------------------------- |
| **Zustand**        | v5.0.13   | 클라이언트 전역 상태 (인증, 사이드바, 테마) |
| **TanStack Query** | v5.100.10 | 서버 데이터 캐싱/동기화                     |

### 라우팅 & 폼

| 라이브러리          | 버전     | 용도             |
| ------------------- | -------- | ---------------- |
| **TanStack Router** | v1.169.2 | 타입 안전 라우터 |
| **React Hook Form** | v7.75.0  | 폼 상태 관리     |
| **Zod**             | v4.4.3   | 스키마 검증      |
| **axios**           | v1.16.0  | HTTP 클라이언트  |

---

## 3. 폴더 구조

```
axiquant-client/
├── electron/                      # Electron 메인 프로세스
│   ├── main.ts
│   └── preload.ts
│
├── src/
│   ├── api/                       # HTTP 호출 (axios, try/catch)
│   ├── components/ui/             # 공용 UI (Grid, Drawer, Button …)
│   ├── hooks/                     # TanStack Query 래퍼
│   ├── layouts/                   # RootLayout, TitleBar, Sidebar
│   ├── lib/
│   │   ├── infra/                 # axios, SSE
│   │   ├── query/                 # queryKeys
│   │   ├── wire/                  # wireJson, apiErrors
│   │   ├── mappers/               # wire ↔ UI 변환
│   │   ├── eventMonitor/          # EventRecord 표시 변환
│   │   └── userPermissions.ts
│   ├── pages/                     # 라우트 페이지 (도메인 폴더)
│   │   ├── LoginPage/
│   │   ├── EmpsPage/, CardsPage/, AccessPage/
│   │   ├── AreaPage/              # 구역
│   │   ├── CardFmtPage/           # 카드 포맷
│   │   ├── DevicesPage/           # SCP/SIO/입출력/리더 트리
│   │   ├── EventMonitorPage/      # 실시간·이력 모니터
│   │   ├── UsersPage/             # 사용자·권한
│   │   └── AuditLogPage/          # 운영 기록
│   ├── stores/                    # Zustand (auth, sidebar, theme)
│   ├── types/
│   │   ├── api/                   # 도메인별 API 타입 + index.ts 배럴
│   │   └── electron.d.ts
│   ├── index.css
│   ├── main.tsx
│   └── router.tsx
│
├── DOCS.md
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 데이터 흐름 (요약)

```
페이지 → hooks/useXxx → api/xxx.ts → lib/mappers/* (필요 시) → axiosInstance → 서버
                ↑ SSE OnXxxChanged → useSseInvalidate → invalidateQueries
```

---

## 4. 파일별 용도 설명

### `electron/`

#### `main.ts`

Electron의 **메인 프로세스**. Node.js 환경에서 실행됩니다.

- `BrowserWindow` 생성 (1280×800, 커스텀 타이틀바 `frame: false`)
- 개발 모드: Vite 개발 서버 URL 로드 + DevTools 자동 오픈
- 프로덕션: 빌드된 `dist/index.html` 로드
- IPC 핸들러: `window:minimize`, `window:maximize`, `window:close`

#### `preload.ts`

렌더러(React)와 메인 프로세스 사이의 **안전한 브릿지**.  
`contextBridge`를 통해 `window.electronAPI.window.*` 를 노출합니다.

```
렌더러(React) → window.electronAPI.window.minimize()
                      ↓ IPC
메인 프로세스  → win.minimize()
```

---

### `src/api/`

서버와 통신하는 **순수 함수**. 도메인별 파일 분리.  
대부분 `try/catch` 후 `null` / `false` / 빈 페이지 반환.  
proto/WPF wire와 다른 필드는 **`lib/mappers/*Mappers.ts`**에서 변환 후 호출합니다.

| 파일 | 도메인 | 주요 엔드포인트 | mapper |
| ---- | ------ | --------------- | ------ |
| `auth.ts` | 인증 | `POST /api/auth/login` | — |
| `emps.ts` | 사원 (flat body) | `/api/emps` | `empsMappers` (`udef: "{}"`, `deleted` 제외) |
| `card.ts` | 카드 (`{ card }` 래퍼) | `/api/card` | `cardMappers` |
| `acclv.ts` | 접근권한 (`{ acclv }`) | `/api/acclv` | `acclvMappers` |
| `area.ts` | 구역 (`{ area }`) | `/api/area` | — |
| `scp.ts` | SCP | `/api/scp` | — |
| `sio.ts` | SIO | `/api/scp/:id/sio` | — |
| `input.ts` | 입력 | `/api/scp/:id/input` | — |
| `output.ts` | 출력 | `/api/scp/:id/output` | — |
| `reader.ts` | 리더 | `/api/scp/:id/reader` | — |
| `cardfmt.ts` | 카드 포맷 | `/api/cardfmt` | — |
| `holiday.ts` | 휴일 | `/api/holiday` | `holidayMappers` (`repeat` ↔ `isRecurring`) |
| `timezone.ts` | 시간대 | `/api/timezone` | `timezoneMappers` (`intervals[]`) |
| `modules.ts` | 모듈 상태 | `/api/modules` | `moduleMappers` |
| `management.ts` | 로그·테스트 이벤트 | `/api/management/*` | `managementMappers` |
| `users.ts` | 사용자 (flat) | `/api/users` | `userMappers` |
| `audit.ts` | 운영 기록 | `GET /api/audit-log` | `auditMappers` |
| `eventMonitor.ts` | 출입·경보 이력 | `/api/access-log`, `/api/alarm-log` | `eventMonitorMappers` |

**404 미구현 API** (`users`, `audit-log`, `access-log`, `alarm-log`):  
빈 목록 + `apiNotReady` 플래그. 해당 페이지에 안내 배너 표시.

---

### `src/hooks/`

**TanStack Query 훅 래퍼**. `api/` 함수를 `useQuery` / `useMutation`으로 감싼 것입니다.  
컴포넌트는 `api/`를 직접 호출하지 않고, 반드시 이 훅을 통해 데이터를 가져옵니다.

```
컴포넌트 → useXxxList() → TanStack Query → api/xxx.ts → 서버
                ↓ 캐시 히트 시 즉시 반환
```

| 훅 | 제공 기능 |
| --- | --- |
| `useEmps.ts` | 사원 CRUD |
| `useCard.ts` | 카드 CRUD, 카드별 접근권한 |
| `useAccLv.ts` | 접근권한 CRUD, 리더 매핑 |
| `useArea.ts` | 구역 |
| `useDevices.ts` | SCP 트리 (scp/sio/input/output/reader 통합) |
| `useScp.ts`, `useSio.ts`, `useInput.ts`, `useOutput.ts`, `useReader.ts` | 장치 하위 리소스 |
| `useCardfmt.ts` | 카드 포맷 |
| `useHoliday.ts`, `useTimezone.ts` | 휴일·시간대 |
| `useModules.ts` | 모듈 목록 |
| `useUsers.ts` | 사용자 CRUD |
| `useAuditLog.ts` | 운영 기록 페이징 |
| `useEventMonitor.ts` | 출입·경보 이력 API |
| `useSseInvalidate.ts` | SSE → 쿼리 무효화 (14종 invalidate + 장치 하위) |

#### `useSseInvalidate.ts` — 실시간 자동 갱신

SSE로 서버 이벤트를 수신하면 해당 TanStack Query 캐시를 자동으로 무효화합니다.

```
서버 SSE 이벤트 "OnCardChanged"
  → sseClient.dispatch()
  → useSseInvalidate 핸들러
  → queryClient.invalidateQueries({ queryKey: ['card'] })
  → useCardList() 훅이 리패치 → UI 자동 갱신
```

---

### `src/lib/`

| 경로 | 용도 |
| ---- | ---- |
| `infra/axios.ts` | `axiosInstance`, Bearer 주입, HTTP 401 → 로그아웃 |
| `infra/sse.ts` | `SseClient` (fetch 스트림), Bearer, **SSE 401 → 로그아웃**, 5초 재연결 |
| `query/queryKeys.ts` | TanStack Query 키 중앙 관리 |
| `wire/wireJson.ts` | `firstNumber`, `optionalString`, `asRecordArray` — 구·신 필드명 흡수 |
| `wire/apiErrors.ts` | `isApiNotReady` (HTTP 404) |
| `userPermissions.ts` | 사용자 메뉴 권한 정의·정규화 (`normalizePermissions` 등) |
| `mappers/cardMappers.ts` | 카드 proto `id`/`emp`/`flags` ↔ UI `cid`/`cardNumber` |
| `mappers/empsMappers.ts` | 사원 flat wire payload (`udef: "{}"`) |
| `mappers/holidayMappers.ts` | `repeat` ↔ `isRecurring` |
| `mappers/timezoneMappers.ts` | `TzInfo` + `intervals[]` ↔ UI 시간 필드 |
| `mappers/acclvMappers.ts` | `description` ↔ `ext` JSON |
| `mappers/moduleMappers.ts` | `moduleType`, `connectedAt` → UI 표시 필드 |
| `mappers/managementMappers.ts` | test-events `emitting`/`minIntervalMs` ↔ `isRunning`/`intervalMs` |
| `mappers/userMappers.ts` | users flat wire, `permissions` |
| `mappers/auditMappers.ts` | audit-log 페이징 파싱 |
| `mappers/eventMonitorMappers.ts` | access/alarm 로그 wire 파싱 |
| `eventMonitor/eventRecords.ts` | SSE·이력 → `EventRecord` 표시 변환 |

#### `infra/axios.ts`

- 요청: `Authorization: Bearer {token}`
- 응답 401: `clearToken()` + `/login`

#### `infra/sse.ts`

- `fetch` + `ReadableStream` (EventSource는 Bearer 불가)
- `GET /api/events/stream` + Bearer
- 401 시 재연결 없이 로그아웃
- `OnEventReceived` 등 이벤트명으로 `dispatch`

#### `query/queryKeys.ts` (예)

```ts
queryKeys.emps.all           // ['emps']
queryKeys.card.all           // ['card']
queryKeys.users.all()        // ['users']
queryKeys.auditLog.list(p)   // ['auditLog', params]
queryKeys.eventMonitor.accessLog(p)
```

---

### `src/stores/`

Zustand 전역 상태 스토어. 서버와 무관한 **클라이언트 전용 UI 상태**만 관리합니다.

#### `authStore.ts`

```ts
{
  ;(token, isAuthenticated, setToken(), clearToken())
}
```

로그인 성공 시 `setToken(token)`, 로그아웃/401 시 `clearToken()`.  
토큰은 메모리에만 저장됩니다(새로고침 시 초기화 → 재로그인 필요).

#### `sidebarStore.ts`

```ts
{
  ;(isElectron, isCollapsed, isOpen, toggle())
}
```

- Electron: `isCollapsed` (사이드바 너비 접힘)
- 웹: `isOpen` (사이드바 오버레이 표시 여부)
- `navigator.userAgent.includes('Electron')` 으로 환경 자동 감지

#### `themeStore.ts`

```ts
{
  theme: ('dark' | 'light', toggleTheme())
}
```

`toggleTheme()` 호출 시 `document.documentElement.setAttribute('data-theme', 'light')` 를 변경해  
CSS 변수 값이 전환됩니다.

---

### `src/types/api/`

도메인별 타입 파일 + `index.ts` 배럴 export.

| 파일 | 주요 타입 |
| ---- | --------- |
| `emp.ts` | `EmpInfo` (WPF flat 14필드) |
| `card.ts` | `CardInfo` (`cid`, `cardNumber` — 서버 `id`와 동일 값) |
| `acclv.ts` | `AccLvInfo`, `AccLvRdrInfo` |
| `timezone.ts` | `TimezoneInfo`, `TimezoneInterval` |
| `user.ts` | `UserInfo`, `UserPermissions` |
| `audit.ts` | `AuditLogItem`, `PagedAuditLogResponse` |
| `eventMonitor.ts` | `EventRecord`, `AccessLogItem`, `PagedLogResponse` |
| `sse.ts` | `DeviceEventMessage`, `SseEventName` |
| `module.ts`, `management.ts`, … | 기타 도메인 |

> **Card**: 서버 proto `id` = 카드번호. UI는 `cid`/`cardNumber` 사용.  
> `CardsPage`에서 `CardRow = CardInfo & { id: number }`로 Grid 호환.

---

### `src/layouts/`

#### `RootLayout.tsx`

인증 영역의 **공통 레이아웃**. TitleBar + Sidebar + 페이지 콘텐츠로 구성됩니다.

```
┌─────────────────────────────────┐  ← TitleBar (40px)
│ [≡] AxiQuant          [□][×]   │
├──────┬──────────────────────────┤
│      │                          │
│Sidebar│  <Outlet />             │  ← flex-1 flex-col overflow-hidden
│      │  (페이지 컴포넌트)        │
└──────┴──────────────────────────┘
```

- `useSseInvalidate()` 가 여기서 마운트됨 → SSE 연결은 로그인 후 앱 전체 수명과 동일

#### `TitleBar.tsx`

40px 커스텀 타이틀바. `WebkitAppRegion: 'drag'` 로 드래그 영역 지정.

- 좌: 사이드바 토글 버튼
- 중앙: AxiQuant 로고
- 우: 테마 토글 + Electron 전용 최소화/최대화/닫기

#### `Sidebar.tsx`

환경에 따라 두 가지 렌더 모드:

- **Electron**: 고정 사이드바, 너비 160px ↔ 50px 슬라이드
- **웹**: 고정 위치 오버레이 드로어, 배경 dim + 슬라이드인

---

### `src/pages/`

라우트별 페이지. 복잡한 화면은 **도메인 폴더** (`index.tsx` + 탭/훅/유틸).

| 경로 | 라우트 | 설명 |
| ---- | ------ | ---- |
| `LoginPage/` | `/login` | 로그인·서버 주소 |
| `EmpsPage/` | `/emps` | 사원(카드 사용자) |
| `CardsPage/` | `/cards` | 카드 (번호 = 서버 `id`) |
| `AccessPage/` | `/access` | 접근권한·리더·시간대 목록 |
| `DevicesPage/` | `/devices` | SCP 장치 트리 |
| `AreaPage/` | `/area` | 구역 |
| `CardFmtPage/` | `/cardfmt` | 카드 포맷 |
| `EventMonitorPage/` | `/monitor` | 실시간 SSE + 이력 조회 |
| `UsersPage/` | `/users` | 사용자·메뉴 권한 |
| `AuditLogPage/` | `/audit` | 운영 기록 |

#### 페이지 공통 레이아웃 패턴

```
┌─────────────────────────────────────┐
│ 페이지 헤더 (아이콘 + 제목 + 버튼)   │  42px, var(--color-sidebar)
├────────────────────────┬────────────┤
│                        │            │
│   Grid (flex-1)        │  Drawer    │  flex-1, overflow-hidden
│   - 검색/필터 툴바      │  (268px)   │
│   - 데이터 테이블       │  - 헤더    │
│   - 건수 푸터           │  - 액션    │
│                        │  - 탭      │
│                        │  - 콘텐츠  │
└────────────────────────┴────────────┘
```

---

### `src/components/ui/`

재사용 가능한 공용 UI 컴포넌트. 모든 컴포넌트는 `named export`입니다.

#### `Grid.tsx` — 데이터 테이블

```ts
<Grid<T extends { id: number }>
  columns={ColumnDef<T>[]}   // 컬럼 정의
  data={T[]}                 // 행 데이터
  selectedId={number}        // 선택된 행 id
  onRowClick={(row) => void} // 행 클릭 핸들러
  onSearch={(query) => void} // 검색 핸들러
  searchPlaceholder={string}
  totalCount={number}
  loading={boolean}
  actions={ReactNode}        // 툴바 우측 슬롯
/>
```

- `ColumnDef.render(value, row)` 로 셀 커스텀 렌더 가능
- 선택된 행은 `#172135` 배경으로 하이라이트
- 스티키 헤더, 커스텀 스크롤바

#### `Drawer.tsx` — 상세 패널

```ts
<Drawer
  header={ReactNode}     // 상단 요약 정보 슬롯
  actions={ReactNode}    // 수정/삭제 버튼 슬롯
  tabs={TabItem[]}       // 탭 목록
  activeTab={string}
  onTabChange={(key) => void}
  footer={ReactNode}     // 하단 슬롯
>
  {children}             // 탭별 콘텐츠
</Drawer>
```

#### `Badge.tsx` — 상태 뱃지

```ts
<Badge variant="on|off|lost|visit|issue|card">텍스트</Badge>
```

| variant | 색상 | 사용 예      |
| ------- | ---- | ------------ |
| `on`    | 초록 | 활성, 정상   |
| `off`   | 회색 | 비활성, 없음 |
| `lost`  | 빨강 | 분실         |
| `visit` | 보라 | 방문 카드    |
| `issue` | 파랑 | 발급됨       |
| `card`  | 보라 | 카드 유형    |

#### `Button.tsx`

```ts
<Button variant="default|accent|danger" size="sm|md" leftIcon={ReactNode} loading={boolean}>
  라벨
</Button>
```

#### `Input.tsx`

`forwardRef` 기반 인풋. `react-hook-form`의 `register()` 스프레드와 바로 호환됩니다.

#### `Modal.tsx`

확인/취소 다이얼로그. `open` prop으로 제어. ESC 키 닫기 지원.

#### `Tab.tsx`

```ts
<Tab items={TabItem[]} activeKey={string} onChange={(key) => void} />
```

#### `ListPanel.tsx`

목록 + 상세 분할 패널 래퍼 (용도 확장 예정).

---

## 5. 통신 구조

```
┌──────────────────────────────────────────────────────────┐
│                     React 렌더러                          │
│                                                          │
│  컴포넌트 → useXxxList() → TanStack Query 캐시            │
│                                ↕ miss/stale              │
│                           api/xxx.ts                     │
│                                ↕                         │
│                         axiosInstance                    │
│           (req 인터셉터: Bearer 헤더 주입)                │
│           (res 인터셉터: 401 → clearToken + /login)       │
└───────────────────────────┬──────────────────────────────┘
                            │ HTTP (JSON)
                            │ /api/*
                            ↓
              ┌─────────────────────────┐
              │  백엔드 서버             │
              │  192.168.250.201:5001   │
              │  (개발: Vite 프록시)     │
              └────────────┬────────────┘
                           │
                           │ SSE (text/event-stream)
                           │ /api/events/stream
                           ↓
┌──────────────────────────────────────────────────────────┐
│  SseClient (fetch + ReadableStream)                      │
│  - 연결 끊김 시 5초 후 자동 재연결                         │
│  - Authorization: Bearer 헤더로 인증                      │
│                                                          │
│  useSseInvalidate() 에서 이벤트 → 쿼리 무효화 매핑:       │
│  OnCardChanged, OnScpChanged, OnAreaChanged, … (14종)    │
│  OnModuleStatusChanged, OnEventReceived (라이브 모니터)   │
│  useSseInvalidate → queryKeys.* invalidate               │
└──────────────────────────────────────────────────────────┘
```

### 개발 환경 API 프록시

`vite.config.ts`에 설정된 프록시:

```
브라우저 요청: GET /api/emps
Vite 프록시: → http://192.168.250.201:5001/api/emps
```

CORS 없이 개발 가능. `axiosInstance.defaults.baseURL` 은 별도 설정 없이 상대경로를 사용합니다.

---

## 6. 인증 흐름

```
1. LoginPage에서 서버 주소 입력
   axiosInstance.defaults.baseURL = 'http://서버주소:포트'

2. POST /api/auth/login { username, password }
   응답: { token, expiresAt }

3. authStore.setToken(token)
   → Zustand 메모리에 저장

4. router.navigate({ to: '/emps' })

5. 이후 모든 요청: Authorization: Bearer {token} 자동 추가
   (axios 요청 인터셉터)

6. 401 응답 수신 시:
   authStore.clearToken()
   router.navigate({ to: '/login' })
```

> ⚠️ 토큰은 메모리에만 저장됩니다.  
> 앱을 새로고침하거나 재시작하면 토큰이 사라져 다시 로그인해야 합니다.

---

## 7. 상태 관리

### 서버 상태 — TanStack Query

서버에서 가져오는 데이터는 **TanStack Query가 전담**합니다.

```
useEmpList()
  ↓
useQuery({
  queryKey: ['emps'],      ← 캐시 키
  queryFn: getEmpList,     ← API 함수
})
  ↓
{ data, isLoading, isError }
```

- **staleTime: 30초** — 30초 동안 캐시 재사용, 이후 자동 리패치
- **retry: 1** — 실패 시 1회 재시도
- **refetchOnWindowFocus: false** — 탭 포커스 시 리패치 안 함
- SSE 이벤트로 서버 데이터 변경 감지 → `invalidateQueries` → 즉시 리패치

### 클라이언트 상태 — Zustand

UI 전용 상태(로그인 토큰, 테마, 사이드바)는 **Zustand**가 담당합니다.

```
useAuthStore    →  token, isAuthenticated
useSidebarStore →  isCollapsed(Electron) / isOpen(Web)
useThemeStore   →  'dark' | 'light'
```

### 페이지 내 로컬 상태 — useState

`selectedId`, `editMode`, `searchQuery` 등 페이지 범위의 UI 상태는  
`useState`로 컴포넌트 내부에서 직접 관리합니다.

---

## 8. 라우팅 구조

TanStack Router를 사용합니다. 라우트 트리:

```
rootRoute (Outlet만 렌더)
│
├── indexRoute  /        → redirect → /login
├── loginRoute  /login   → LoginPage (TitleBar 있음, Sidebar 없음)
│
└── appRoute    _app     → RootLayout (TitleBar + Sidebar)
    ├── /emps      → EmpsPage
    ├── /cards     → CardsPage
    ├── /access    → AccessPage
    ├── /devices   → DevicesPage
    ├── /area      → AreaPage
    ├── /cardfmt   → CardFmtPage
    ├── /monitor   → EventMonitorPage
    ├── /users     → UsersPage
    └── /audit     → AuditLogPage
```

`appRoute`는 `path` 없이 `id: '_app'`만 가진 **레이아웃 라우트**입니다.  
자식 라우트들이 `RootLayout` 안의 `<Outlet />`에 렌더됩니다.

---

## 9. UI 컴포넌트 시스템

### 디자인 토큰 (CSS 변수)

`src/index.css`에 정의. Tailwind 커스텀 컬러를 **사용하지 않고** CSS 변수만 사용합니다.

```css
/* 다크 테마 (기본) */
--color-bg: #1a1d21 /* 메인 배경 */ --color-sidebar: #14171a /* 사이드바/헤더 배경 */
  --color-accent: #4f9cf9 /* 포인트 컬러 (파랑) */ --color-text: rgba(255, 255, 255, 0.87)
  --color-text-muted: rgba(255, 255, 255, 0.45) --color-icon: #ffffff
  --color-btn-hover: rgba(255, 255, 255, 0.1) /* 라이트 테마 (data-theme="light") */
  --color-bg: #ffffff --color-accent: #ff6c37 /* 포인트 컬러 (오렌지) */...;
```

### 컴포넌트 작성 규칙

```ts
// ✅ named export
export const MyComponent = () => { ... }

// ❌ default export 금지
export default MyComponent
```

- 파일명: `PascalCase.tsx`
- `any` 타입 금지, TypeScript strict 모드
- 절대경로 import: `@/components/ui/Button`

---

## 10. Electron 듀얼 타겟

Vite가 React 코드와 Electron 메인 프로세스를 **동시에 빌드**합니다.

```
개발: vite (dev server) + electron (main.ts watch)
빌드: tsc → vite build → electron-builder
```

### IPC 통신 (렌더러 ↔ 메인)

```ts
// 렌더러 (React 컴포넌트)
window.electronAPI.window.minimize()
window.electronAPI.window.maximize()
window.electronAPI.window.close()

// preload.ts (contextBridge)
contextBridge.exposeInMainWorld('electronAPI', {
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    ...
  }
})

// main.ts (Node.js)
ipcMain.on('window:minimize', () => win.minimize())
```

### 환경 감지

```ts
const isElectron = navigator.userAgent.includes('Electron')
```

이 값으로 Sidebar 동작 방식, 윈도우 컨트롤 버튼 표시 여부 등을 분기합니다.

---

## 11. 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Electron 앱으로 실행됨)
npm run dev

# 포맷 체크
npm run format:check

# 코드 자동 포맷
npm run format

# 린트 검사
npm run lint

# 프로덕션 빌드 (Electron 인스톨러 생성)
npm run build
```

### 백엔드 서버 연결

현재 `vite.config.ts`의 프록시 타겟:

```
http://192.168.250.201:5001
```

웹 브라우저로 개발 시 Vite 프록시가 자동으로 API를 해당 주소로 포워드합니다.  
Electron에서는 `LoginPage`의 서버 주소 입력란에서 직접 설정합니다.
