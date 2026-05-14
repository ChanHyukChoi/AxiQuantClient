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
├── electron/                  # Electron 메인 프로세스
│   ├── main.ts                # BrowserWindow 생성, IPC 핸들러
│   └── preload.ts             # 렌더러 ↔ 메인 브릿지 (contextBridge)
│
├── src/                       # React 렌더러 프로세스 (웹 UI)
│   ├── api/                   # 서버 API 호출 함수 모음
│   ├── components/
│   │   └── ui/                # 공용 UI 컴포넌트
│   ├── features/              # 도메인별 복합 기능 (현재 확장 예정)
│   ├── hooks/                 # TanStack Query 래퍼 훅 모음
│   ├── layouts/               # 앱 레이아웃 컴포넌트
│   ├── lib/                   # 전역 인스턴스, 설정
│   ├── pages/                 # 라우트별 페이지 컴포넌트
│   ├── stores/                # Zustand 전역 상태
│   ├── types/                 # TypeScript 타입 정의
│   ├── utils/                 # 순수 유틸 함수 (현재 확장 예정)
│   ├── index.css              # CSS 변수, 글로벌 스타일
│   ├── main.tsx               # React 진입점 (ReactDOM.createRoot)
│   └── router.tsx             # TanStack Router 라우트 트리
│
├── DOCS.md                    # 이 문서
├── package.json
├── tsconfig.json
└── vite.config.ts
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

서버와 통신하는 **순수 함수들**. 각 도메인별 파일로 분리되어 있습니다.  
모두 `try/catch`로 에러를 처리하고 실패 시 `null` 또는 `false`를 반환합니다.

| 파일            | 도메인                   | 주요 엔드포인트                  |
| --------------- | ------------------------ | -------------------------------- |
| `auth.ts`       | 인증                     | `POST /api/auth/login`           |
| `emps.ts`       | 사원(카드 사용자)        | `GET/POST/PUT/DELETE /api/emps`  |
| `card.ts`       | 카드                     | `GET/POST/PUT/DELETE /api/card`  |
| `acclv.ts`      | 접근권한                 | `GET/POST/PUT/DELETE /api/acclv` |
| `area.ts`       | 구역                     | `GET/POST/PUT/DELETE /api/area`  |
| `scp.ts`        | 보안 컨트롤러(SCP)       | `/api/scp`                       |
| `sio.ts`        | SIO 모듈                 | `/api/scp/:id/sio`               |
| `input.ts`      | 입력 포트                | `/api/scp/:id/input`             |
| `output.ts`     | 출력 포트                | `/api/scp/:id/output`            |
| `reader.ts`     | 카드 리더                | `/api/scp/:id/reader`            |
| `cardfmt.ts`    | 카드 포맷                | `/api/cardfmt`                   |
| `holiday.ts`    | 휴일 설정                | `/api/holiday`                   |
| `timezone.ts`   | 시간대 설정              | `/api/timezone`                  |
| `modules.ts`    | 시스템 모듈 상태         | `/api/modules`                   |
| `management.ts` | 로그 레벨, 테스트 이벤트 | `/api/management`                |

---

### `src/hooks/`

**TanStack Query 훅 래퍼**. `api/` 함수를 `useQuery` / `useMutation`으로 감싼 것입니다.  
컴포넌트는 `api/`를 직접 호출하지 않고, 반드시 이 훅을 통해 데이터를 가져옵니다.

```
컴포넌트 → useXxxList() → TanStack Query → api/xxx.ts → 서버
                ↓ 캐시 히트 시 즉시 반환
```

| 훅                    | 제공 기능                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `useEmps.ts`          | `useEmpList`, `useCreateEmp`, `useUpdateEmp`, `useDeleteEmp`                               |
| `useCard.ts`          | `useCardList`, `useCreateCard`, `useUpdateCard`, `useDeleteCard`, `useCardAccLvList`       |
| `useAccLv.ts`         | `useAccLvList`, `useCreateAccLv`, `useUpdateAccLv`, `useDeleteAccLv`, `useAccLvReaderList` |
| `useSseInvalidate.ts` | SSE 이벤트 수신 시 관련 쿼리 자동 무효화                                                   |
| 나머지                | 각 도메인 CRUD 훅 동일 패턴                                                                |

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

#### `axios.ts`

전역 `axiosInstance` 설정:

- **요청 인터셉터**: 모든 요청에 `Authorization: Bearer {token}` 헤더 자동 주입
- **응답 인터셉터**: 401 응답 시 토큰 삭제 + `/login`으로 자동 리다이렉트

#### `sse.ts`

커스텀 `SseClient` 클래스. 브라우저 기본 `EventSource` 대신 `fetch + ReadableStream`을 사용합니다.  
이유: JWT `Authorization` 헤더를 `EventSource`는 설정할 수 없기 때문입니다.

- 연결 끊김 시 5초 후 자동 재연결
- `on(eventName, callback)` / `off()` 로 이벤트 구독/해제
- 싱글톤 `sseClient` 인스턴스를 앱 전역에서 공유

#### `queryKeys.ts`

TanStack Query의 **쿼리 키 중앙 관리**.  
쿼리 키를 한 곳에서 관리해 `invalidateQueries` 호출 시 일관성을 보장합니다.

```ts
queryKeys.emps.all // ['emps']
queryKeys.card.all // ['card']
queryKeys.card.acclv(5) // ['card', 5, 'acclv']
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

### `src/types/api.ts`

서버 API의 **모든 타입 정의** 단일 파일.  
인터페이스, Request 타입 등을 도메인별로 구분해 선언합니다.

주요 타입:

```ts
EmpInfo        { id, name, employeeNumber, department?, email?, phone? }
CardInfo       { cid, cardNumber, empId?, empName?, isActive, issuedAt?, expiredAt? }
AccLvInfo      { id, name, description? }
ScpInfo        { id, name, ipAddress, port, isOnline? }
LoginResponse  { token, expiresAt }
SseEventName   'device-event' | 'access-event' | 'alarm-event' | ...
```

> **주의**: `CardInfo`는 `id` 대신 `cid`를 PK로 사용합니다.  
> Grid 컴포넌트는 `T extends { id: number }`를 요구하므로,  
> `CardsPage`에서 `CardRow = CardInfo & { id: number }` 로컬 타입으로 정규화해서 사용합니다.

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

각 라우트에 대응하는 **페이지 컴포넌트**. 레이아웃은 `Grid + Drawer` 패턴을 따릅니다.

| 파일            | 라우트    | 설명                           |
| --------------- | --------- | ------------------------------ |
| `LoginPage.tsx` | `/login`  | 로그인 (서버 주소 입력 + 인증) |
| `EmpsPage.tsx`  | `/emps`   | 카드 사용자(사원) 관리         |
| `CardsPage.tsx` | `/cards`  | 카드 관리                      |
| `AccessPage`    | `/access` | 접근권한 (placeholder)         |

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
│  OnCardChanged      → queryKeys.card.all                 │
│  OnScpChanged       → queryKeys.scp.all                  │
│  OnAccLvChanged     → queryKeys.acclv.all                │
│  ... (총 12개 이벤트 매핑)                                 │
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
└── appRoute    _app     → RootLayout (TitleBar + Sidebar 레이아웃)
    ├── empsRoute   /emps    → EmpsPage
    ├── cardsRoute  /cards   → CardsPage
    └── accessRoute /access  → AccessPage
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
