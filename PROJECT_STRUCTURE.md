# AxiQuant Client — 프로젝트 폴더 구조

> 보안/출입 관제 시스템 프론트엔드  
> Electron + React 기반 데스크톱/웹 듀얼 타겟

---

## 목차

1. [전체 폴더 트리](#1-전체-폴더-트리)
2. [루트 설정 파일](#2-루트-설정-파일)
3. [electron/ — 데스크톱 셸](#3-electron--데스크톱-셸)
4. [src/ — 애플리케이션 소스](#4-src--애플리케이션-소스)
5. [데이터 흐름](#5-데이터-흐름)
6. [페이지 폴더 내부 패턴](#6-페이지-폴더-내부-패턴)
7. [라우트 ↔ 페이지 매핑](#7-라우트--페이지-매핑)

---

## 1. 전체 폴더 트리

```
axiquant-client/
├── .cursor/
│   └── rules/
│       └── project.mdc          # Cursor AI 프로젝트 규칙
│
├── electron/                    # Electron 메인 프로세스
│   ├── main.ts
│   ├── preload.ts
│   └── electron-env.d.ts
│
├── src/
│   ├── api/                     # HTTP 호출 (도메인별)
│   ├── assets/                  # 정적 에셋
│   ├── components/
│   │   ├── primitive/           # Grid, Drawer, Button, SearchField 등
│   │   ├── basic/               # 도메인 선택 모달, DetailTitleBar 등
│   │   ├── layout/              # SplitDrawerLayout
│   │   └── page-actions/        # 페이지 공통 액션 버튼
│   ├── hooks/
│   │   ├── api/                 # TanStack Query 훅
│   │   ├── sse/                 # SSE 실시간 갱신 훅
│   │   └── ui/                  # UI 동작 훅
│   ├── layouts/                 # 앱 레이아웃 (TitleBar, Sidebar 등)
│   ├── lib/                     # 인프라·유틸·매퍼
│   ├── pages/                   # 라우트별 페이지
│   ├── stores/                  # Zustand 클라이언트 상태
│   ├── styles/                  # CSS 디자인 토큰
│   ├── types/                   # TypeScript 타입 정의
│   ├── index.css                # Tailwind·폰트·theme import
│   ├── main.tsx                 # React 엔트리포인트
│   └── router.tsx               # TanStack Router 정의
│
├── index.html                   # Vite HTML 엔트리
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts               # 웹 빌드 설정
├── vite.config.electron.ts      # Electron 빌드 설정
└── PROJECT_STRUCTURE.md         # 이 문서
```

---

## 2. 루트 설정 파일

| 파일 | 역할 |
|------|------|
| `package.json` | 의존성·npm 스크립트 (`dev`, `build`, `dev:electron`, `build:electron`, `lint`, `format`) |
| `tsconfig.json` | TypeScript 컴파일 옵션 (`@/` 절대경로 alias) |
| `tsconfig.node.json` | Vite/Electron 설정 파일용 TS 설정 |
| `vite.config.ts` | 웹 개발 서버·빌드, API 프록시 |
| `vite.config.electron.ts` | Electron + Vite 통합 빌드 |
| `index.html` | React 앱 마운트 (`#root`) |
| `.eslintrc.cjs` | ESLint 규칙 |
| `.prettierrc` / `.prettierignore` | 코드 포맷 설정 |
| `.gitignore` | Git 제외 목록 |
| `PROJECT_STRUCTURE.md` | 폴더·파일 구조 문서 (이 문서) |

---

## 3. electron/ — 데스크톱 셸

Node.js 환경에서 실행되는 **메인 프로세스** 코드입니다. React 렌더러와 IPC로 통신합니다.

| 파일 | 역할 |
|------|------|
| `main.ts` | `BrowserWindow` 생성, 개발/프로덕션 URL 로드, 창 최소화·최대화·닫기 IPC 핸들러 |
| `preload.ts` | `contextBridge`로 `window.electronAPI` 노출 (렌더러 ↔ 메인 안전 브릿지) |
| `electron-env.d.ts` | Electron 환경 타입 선언 |

---

## 4. src/ — 애플리케이션 소스

### 4.1 엔트리·라우팅

| 파일 | 역할 |
|------|------|
| `main.tsx` | React DOM 마운트, `QueryClientProvider` + `RouterProvider` 설정 |
| `router.tsx` | TanStack Router 라우트 트리 정의 (`/login`, `/_app` 하위 페이지) |
| `index.css` | Tailwind v4, Pretendard 폰트, `theme.css` import, Grid 드래그 유틸 |
| `vite-env.d.ts` | Vite 환경 타입 |
| `App.css` | 앱 레벨 보조 스타일 |

---

### 4.2 `api/` — HTTP 호출

서버와 통신하는 **순수 함수** 모음. 컴포넌트는 직접 호출하지 않고 `hooks/api/`를 통해 사용합니다.  
proto/WPF wire 형식과 다른 필드는 `lib/mappers/`에서 변환 후 전송합니다.

| 파일 | 도메인 | 비고 |
|------|--------|------|
| `auth.ts` | 인증 | `POST /api/auth/login` |
| `emps.ts` | 사원(카드 사용자) | flat body, `empsMappers` |
| `card.ts` | 카드 | `{ card }` 래퍼, `cardMappers` |
| `acclv.ts` | 접근권한 | `{ acclv }` 래퍼, `acclvMappers` |
| `area.ts` | 영역 | `{ area }` 래퍼 |
| `scp.ts` | SCP 장치 | |
| `sio.ts` | SIO | SCP 하위 |
| `input.ts` | 입력 포트 | SCP 하위 |
| `output.ts` | 출력 포트 | SCP 하위 |
| `reader.ts` | 리더 | SCP 하위 |
| `cardfmt.ts` | 카드 형식 | |
| `holiday.ts` | 휴일 | `holidayMappers` |
| `timezone.ts` | 시간대 | `timezoneMappers` |
| `modules.ts` | 모듈 상태 | `moduleMappers` |
| `deviceControl.ts` | 장치 제어 | 리더/출력 제어 |
| `alarmSettings.ts` | 경보 설정 | 경보·우선순위·메일 |
| `users.ts` | 사용자 | flat body, `userMappers` |
| `audit.ts` | 운영 기록 | `auditMappers` |
| `eventMonitor.ts` | 출입·경보 이력 | `eventMonitorMappers` |
| `linkage.ts` | 연동 규칙 | 백엔드 연동 예정 (스텁) |
| `system.ts` | 라이선스 정보 | `systemMappers` |

---

### 4.3 `hooks/` — 데이터·UI 훅

#### `hooks/api/` — TanStack Query 래퍼

`pages/`는 이 레이어만 호출합니다. HTTP·캐시 무효화·`queryKeys` 관리는 여기서 담당하고, 실제 요청은 `@/api/*`로 위임합니다.

| 파일 | 역할 |
|------|------|
| `queryCache.ts` | 생성·수정 직후 목록 재조회 (`fetchScpList`, `fetchTimezoneList` 등) |
| `useAuth.ts` | 로그인 mutation |
| `useSystem.ts` | 라이선스 조회 |
| `useEmps.ts` | 사원 CRUD |
| `useCard.ts` | 카드 CRUD, 카드별 접근권한, `syncCardAccLvLinks` |
| `useAccLv.ts` | 접근권한 CRUD, 리더 매핑 |
| `useArea.ts` | 영역 |
| `useDeviceControl.ts` | SCP·SIO·입력·출력·리더 조회·CRUD·제어, `useDevicePeripheralsForScps` |
| `useCardfmt.ts` | 카드 형식 |
| `useHoliday.ts` | 휴일 |
| `useTimezone.ts` | 시간대 |
| `useAlarmSettings.ts` | 경보·우선순위·메일 설정 |
| `useLinkage.ts` | 연동 규칙 (스텁) |
| `useUsers.ts` | 사용자 CRUD |
| `useAuditLog.ts` | 운영 기록 페이징 |
| `useEventMonitor.ts` | 출입·경보 이력 API |

#### `hooks/sse/` — 실시간 갱신

| 파일 | 역할 |
|------|------|
| `useSseInvalidate.ts` | SSE 이벤트 수신 → TanStack Query 캐시 무효화 (14종+ 장치 하위) |
| `useDeviceControlSse.ts` | 장치 제어 페이지 전용 SSE 처리 |

#### `hooks/ui/` — UI 동작

| 파일 | 역할 |
|------|------|
| `useGridLayout.ts` | Grid 컬럼 레이아웃·드래그 상태 |
| `useGridColumnLayout.ts` | Grid 컬럼 순서·너비 저장/복원 |
| `useResizableDrawerWidth.ts` | Drawer 너비 리사이즈 |
| `useStatusBar.ts` | 상태바 (모듈 연결·라이선스·SSE·메모리) |

---

### 4.4 `lib/` — 인프라·변환·유틸

| 경로 | 역할 |
|------|------|
| `infra/axios.ts` | `axiosInstance`, Bearer 토큰 주입, 401 → 로그아웃 |
| `infra/sse.ts` | `SseClient` (fetch 스트림), Bearer 인증, 자동 재연결 |
| `query/queryKeys.ts` | TanStack Query 키 중앙 관리 |
| `wire/wireJson.ts` | 구·신 필드명 흡수 (`firstNumber`, `asRecordArray` 등) |
| `wire/apiErrors.ts` | `isAxiosNotFound` (HTTP 404 판별) |
| `userPermissions.ts` | 사용자 메뉴 권한 정의·정규화 |
| `grid/gridLayout.ts` | Grid 컬럼 순서·너비 저장/복원 |
| `layout/columnWidths.ts` | 컬럼 너비 상수·헬퍼 |
| `layout/splitDrawerDefaults.ts` | SplitDrawer 기본/최소 너비 (400/320) |
| `image/` | 사원·생체 사진 처리 (`processEmpPhoto`, `processBioPhoto` 등) |
| `entityDisplayLabels.ts` | 엔티티 표시 라벨 |
| `isElectronRuntime.ts` | Electron 런타임 판별 |
| `eventMonitor/eventRecords.ts` | SSE·이력 → `EventRecord` 표시 변환 |
| `device/deviceHelpers.ts` | 장치 라벨·활성 상태·아이콘 헬퍼 |
| `device/buildTree.ts` | SCP 장치 트리 구성 (`DevicePickerModal` 등) |

#### `lib/mappers/` — wire ↔ UI 변환

| 파일 | 변환 대상 |
|------|-----------|
| `empsMappers.ts` | 사원 flat wire (`udef: "{}"`, `deleted` 제외) |
| `cardMappers.ts` | 카드 `id`/`emp`/`flags` ↔ UI `cid`/`cardNumber` |
| `acclvMappers.ts` | `description` ↔ `ext` JSON |
| `holidayMappers.ts` | `repeat` ↔ `isRecurring` |
| `timezoneMappers.ts` | `TzInfo` + `intervals[]` ↔ UI 시간 필드 |
| `moduleMappers.ts` | `moduleType`, `connectedAt` → UI 표시 필드 |
| `userMappers.ts` | users flat wire, `permissions` |
| `auditMappers.ts` | audit-log 페이징 파싱 |
| `eventMonitorMappers.ts` | access/alarm 로그 wire 파싱 |
| `systemMappers.ts` | 시스템 설정 wire 변환 |

---

### 4.5 `components/` — 공용 UI

#### `components/primitive/` — 기본 UI

스타일이 지정된 재사용 컴포넌트. `index.ts`에서 배럴 export.  
`SearchField`는 검색 색상 단일 소스(`--color-search-*`)를 사용합니다.

| 파일 | 역할 |
|------|------|
| `Button.tsx` | 버튼 (`default` / `accent` / `danger`) |
| `Input.tsx` | 폼 입력 (`react-hook-form` 호환) |
| `SearchField.tsx` | 검색 입력 (CSS 변수 `--color-search-*` 사용) |
| `Badge.tsx` | 상태 뱃지 (`on`, `off`, `lost` 등) |
| `Grid.tsx` | 데이터 테이블 (검색, 정렬, 컬럼 드래그) |
| `Drawer.tsx` | 상세 패널 (헤더·탭·액션 슬롯) |
| `Modal.tsx` | 확인/취소 다이얼로그 |
| `Tab.tsx` | 탭 네비게이션 |
| `ListPanel.tsx` | 목록 + 상세 분할 패널 |
| `Toast.tsx` | 토스트 알림 (`ToastHost`) |
| `Checkbox.tsx` | 체크박스 |
| `Select.tsx` | 셀렉트 |
| `icons/` | 커스텀 아이콘 (`WindowRestoreIcon` 등) |

#### `components/basic/` — 도메인 조합 UI

| 파일 | 역할 |
|------|------|
| `DetailTitleBar.tsx` | Drawer 상단 제목·상태 바 |
| `DetailInfoField.tsx` | 상세 필드 레이아웃 |
| `AccLvSelectModal.tsx` | 접근권한 선택 모달 |
| `AreaSelectModal.tsx` | 영역 선택 모달 |
| `EmpSelectModal.tsx` | 사원 선택 모달 |
| `DeviceTreeNode.tsx` | SCP 장치 트리 노드 (`DevicePickerModal` 등) |
| `ActiveStatusBadge.tsx` | 활성 상태 뱃지 |
| `ListOptionsModalShell.tsx` | 목록 옵션 모달 셸 |
| `MultiSelectToggleAllButton.tsx` | 전체 선택 토글 |

#### `components/page-actions/` — 페이지 액션 버튼

목록 페이지 툴바에 공통으로 쓰이는 액션 버튼.

| 파일 | 역할 |
|------|------|
| `AddButton.tsx` | 추가 |
| `FilterButton.tsx` | 필터 |
| `ImportButton.tsx` | 가져오기 |
| `ExportButton.tsx` |보내기 |
| `PrintButton.tsx` | 인쇄 |
| `SearchButton.tsx` | 검색 |
| `CrudDetailActions.tsx` | Drawer CRUD 액션 (저장/삭제) |
| `types.ts` | `PageActionButtonProps` 공통 타입 |
| `index.ts` | 배럴 export |

#### `components/layout/`

| 파일 | 역할 |
|------|------|
| `SplitDrawerLayout.tsx` | Grid + Drawer 분할 레이아웃 (리사이즈, 기본 400px) |

---

### 4.6 `layouts/` — 앱 레이아웃

| 파일 | 역할 |
|------|------|
| `RootLayout.tsx` | 인증 영역 공통 레이아웃 (TitleBar + Sidebar + `<Outlet />`), SSE 연결 마운트 |
| `TitleBar.tsx` | 40px 커스텀 타이틀바 (사이드바 토글, 테마, Electron 창 컨트롤) |
| `Sidebar.tsx` | 사이드바 메뉴 (Electron: 접힘, 웹: 오버레이) |
| `PageHeader.tsx` | 페이지 상단 헤더 (아이콘 + 제목 + 액션 슬롯) |

---

### 4.7 `stores/` — Zustand 클라이언트 상태

서버와 무관한 **UI 전용** 전역 상태.

| 파일 | 역할 |
|------|------|
| `authStore.ts` | `token`, `isAuthenticated`, `setToken()`, `clearToken()` |
| `sidebarStore.ts` | `isElectron`, `isCollapsed`, `isOpen`, `toggle()` |
| `themeStore.ts` | `theme` (`dark` / `light`), `toggleTheme()` |
| `toastStore.ts` | 토스트 메시지 큐 관리 |

---

### 4.8 `types/` — TypeScript 타입

| 경로 | 역할 |
|------|------|
| `types/api/` | 도메인별 API 요청/응답 타입 |
| `types/api/index.ts` | 배럴 export (모든 도메인 타입 re-export) |
| `types/electron.d.ts` | `window.electronAPI` 타입 |

#### `types/api/` 파일 목록

| 파일 | 주요 타입 |
|------|-----------|
| `auth.ts` | `LoginResponse` |
| `emp.ts` | `EmpInfo`, `CreateEmpRequest` |
| `card.ts` | `CardInfo`, `CardAccLvInfo` |
| `acclv.ts` | `AccLvInfo`, `AccLvRdrInfo` |
| `area.ts` | `AreaInfo` |
| `scp.ts` / `sio.ts` / `input.ts` / `output.ts` / `reader.ts` | 장치 트리 리소스 |
| `cardfmt.ts` | `CardfmtInfo` |
| `holiday.ts` | `HolidayInfo` |
| `timezone.ts` | `TimezoneInfo`, `TimezoneInterval` |
| `module.ts` | `ModuleInfo` |
| `deviceControl.ts` | 장치 제어 요청/액션 |
| `alarmSettings.ts` | `AlarmInfo`, `AlarmPriorityInfo`, `AlarmMailInfo` |
| `user.ts` | `UserInfo`, `UserPermissions` |
| `audit.ts` | `AuditLogItem`, `PagedAuditLogResponse` |
| `eventMonitor.ts` | `EventRecord`, `AccessLogItem`, `AlarmLogItem` |
| `sse.ts` | `DeviceEventMessage`, `SseEventName` |

---

### 4.9 `styles/` — 디자인 토큰

| 파일 | 역할 |
|------|------|
| `theme.css` | **색상 단일 소스** — `--color-bg`, `--color-accent`, `--color-search-*` 등 CSS 변수. `data-theme="light"`로 라이트 전환 |
| `ui-primitives.css` | `.app-scrollbar`, `.app-search-field` 등 공통 UI 스타일 |

> 색상·토큰은 `theme.css`에만 추가합니다. `index.css`는 import·base 스타일만 담당합니다.

---

### 4.10 `assets/`

| 파일 | 역할 |
|------|------|
| `react.svg` | React 로고 SVG |

---

### 4.11 `pages/` — 라우트별 페이지

각 페이지는 **도메인 폴더**로 구성됩니다. 상세 구조는 [§6 페이지 폴더 내부 패턴](#6-페이지-폴더-내부-패턴) 참고.

| 폴더 | 라우트 | 설명 |
|------|--------|------|
| `LoginPage/` | `/login` | 로그인·서버 주소 설정 |
| `EmpsPage/` | `/emps` | 카드 사용자(사원) 관리 |
| `CardsPage/` | `/cards` | 카드 관리 (번호 = 서버 `id`) |
| `AccessPage/` | `/access` | 접근권한·리더 매핑 |
| `ControllersPage/` | `/controllers` | SCP(제어기) 목록 + 상세 패널 |
| `ReadersPage/` | `/readers` | 리더 목록 + Drawer |
| `InputsPage/` | `/inputs` | 입력 포트 목록 + Drawer |
| `OutputsPage/` | `/outputs` | 출력 포트 목록 + Drawer |
| `AreaPage/` | `/area` | 영역 관리 |
| `CardFmtPage/` | `/cardfmt` | 카드 형식(비트 포맷) |
| `LinkagePage/` | `/linkage` | 연동 규칙 |
| `EventMonitorPage/` | `/monitor` | 실시간 SSE + 이력 조회 |
| `AlarmSettingsPage/` | `/alarm-settings` | 경보·우선순위·메일 설정 (탭 Shell) |
| `SchedulePage/` | `/schedule` | 스케쥴 (타임존 + 휴일) |
| `UsersPage/` | `/users` | 사용자·메뉴 권한 |
| `AuditLogPage/` | `/audit` | 운영 기록 (Grid만) |

---

## 5. 데이터 흐름

### 레이어 책임

| 레이어 | 경로 | 역할 | 호출 대상 |
|--------|------|------|-----------|
| UI | `pages/`, `components/` | 화면·폼·로컬 선택 상태 | `hooks/api/`, `hooks/ui/`, `stores/` |
| 서버 상태 | `hooks/api/` | TanStack Query, 캐시·mutation | `api/`, `lib/query/queryKeys` |
| HTTP | `api/` | axios 요청·응답 파싱 | `lib/infra/axios`, `lib/mappers/` |
| 변환 | `lib/mappers/` | wire ↔ UI 타입 | — |
| 클라이언트 상태 | `stores/` | 인증·테마·토스트 등 | — |

### 요청 흐름

```
pages/ (index.tsx, *Drawer, 페이지 전용 훅)
    ↓  hooks/api/useXxx, queryCache.fetchXxxList
hooks/api/
    ↓  api/xxx.ts
api/
    ↓  lib/mappers/*Mappers.ts (필요 시)
lib/infra/axios.ts  →  백엔드 (/api/*)
```

### 실시간 갱신

```
lib/infra/sse.ts              ← GET /api/events/stream
    ↓
hooks/sse/useSseInvalidate    ← 이벤트 → queryKeys 무효화
    ↓
hooks/api/useXxx.ts           ← 자동 리패치 → UI 갱신
```

### 규칙

- **`pages/`는 `api/`를 직접 import하지 않음** → `hooks/api/`만 사용
- 일반 CRUD: mutation `onSuccess` → `invalidateQueries`
- 생성 직후 새 항목 선택: `hooks/api/queryCache.ts`의 `fetchXxxList(qc)` 사용
- 페이지 전용 훅(`useXxxData.ts`, `useXxxEditor.ts`)도 데이터는 `hooks/api`에서 가져옴
- 서버 wire 형식 변환은 `lib/mappers/`에서 처리
- 클라이언트 UI 상태는 `stores/` (Zustand), 서버 데이터는 TanStack Query

---

## 6. 페이지 폴더 내부 패턴

목록+상세 페이지는 `CardsPage`/`EmpsPage` 패턴을 따릅니다.

```
PageName/
├── index.tsx              # Grid + SplitDrawerLayout 조합
├── useXxxColumns.tsx      # Grid 컬럼 정의 훅
├── useXxxData.ts          # 선택·필터 등 로컬 상태 (데이터는 hooks/api)
├── useXxxEditor.ts        # 생성·수정·삭제 (hooks/api mutation)
├── XxxDrawer.tsx          # 선택 항목 상세 Drawer (또는 *DetailPanel)
├── formTypes.ts           # React Hook Form + Zod 스키마
├── tabs/                  # Drawer 내 탭 콘텐츠
│   ├── XxxInfoTab.tsx
│   └── ...
├── components/            # 페이지 전용 하위 컴포넌트
│   └── ...
├── utils/                 # 페이지 전용 헬퍼 (표시 변환, 폼 매핑)
│   └── xxxHelpers.ts
└── hooks/                 # 페이지 전용 훅 (EventMonitorPage 등)
    └── useLiveEvents.ts
```

공통 레이아웃 상수: `lib/layout/splitDrawerDefaults.ts` (`SPLIT_DRAWER_DEFAULT_WIDTH=400`, `SPLIT_DRAWER_MIN_WIDTH=320`).

### 페이지별 주요 파일

#### `LoginPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 로그인 페이지 레이아웃 |
| `LoginForm.tsx` | 로그인 폼 (`useLogin`) |
| `LoginField.tsx` | 폼 필드 UI |
| `LogoSection.tsx` | 로고 영역 |
| `formTypes.ts` | 폼 스키마 |

#### `EmpsPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 사원 목록 + Drawer |
| `EmpDrawer.tsx` | 사원 상세 Drawer |
| `CreateEmpModal.tsx` | 사원 생성 모달 |
| `useEmpColumns.tsx` | Grid 컬럼 |
| `tabs/EmpInfoTab.tsx` | 기본 정보 탭 |
| `tabs/EmpCardTab.tsx` | 카드 탭 |
| `tabs/EmpBioTab.tsx` | 생체 정보 탭 |
| `components/EmpFieldUi.tsx` | 필드 UI |
| `components/EmpFilterModal.tsx` | 필터 모달 |
| `utils/empHelpers.ts` | 헬퍼 |

#### `CardsPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 카드 목록 + Drawer |
| `CardDrawer.tsx` | 카드 상세 Drawer |
| `CreateCardModal.tsx` | 카드 생성 모달 |
| `useCardColumns.tsx` | Grid 컬럼 |
| `tabs/CardInfoTab.tsx` | 카드 정보 탭 |
| `tabs/CardAccessTab.tsx` | 접근권한 탭 |
| `tabs/CardHistTab.tsx` | 이력 탭 |
| `components/` | `CardFieldUi`, `AccLvGroupCards`, `LastAreaCard` 등 |
| `utils/cardPageHelpers.ts` | 폼·표시 헬퍼 (API 호출 없음) |

#### `AccessPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 접근권한 Grid + SplitDrawerLayout |
| `AccessDetailPanel.tsx` | 접근권한 상세 패널 (Drawer) |
| `useAccLvColumns.tsx` | Grid 컬럼 |
| `components/CreateAccLvModal.tsx` | 접근권한 생성 모달 |
| `components/AccLvReaderTable.tsx` | 리더 매핑 테이블 |
| `utils/accLvHelpers.ts` | 헬퍼 |

#### `ControllersPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | SCP Grid + SplitDrawerLayout |
| `useScpColumns.tsx` | Grid 컬럼 |
| `useControllersData.ts` | SCP/SIO 데이터 |
| `components/ScpDetailPanel.tsx` | SCP 상세 패널 |
| `components/SioWorkspace.tsx` | SIO 하위 편집 |
| `components/ScpCreateModal.tsx` | SCP 생성 모달 |

#### `ReadersPage/`, `InputsPage/`, `OutputsPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 장치 포트 Grid + SplitDrawerLayout |
| `use*Columns.tsx` | Grid 컬럼 |
| `use*Data.ts` | 데이터·선택 (`hooks/api/useDeviceControl`) |
| `*Drawer.tsx` | 상세 Drawer |
| `*DisplayTypes.ts` | 표시용 타입·라벨 |

#### `AreaPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 영역 Grid + SplitDrawerLayout |
| `AreaDrawer.tsx` | 영역 상세 Drawer |
| `useAreaColumns.tsx` | Grid 컬럼 |
| `tabs/AreaInfoTab.tsx` | 영역 정보 |
| `tabs/AreaReadersTab.tsx` | 리더 매핑 |
| `tabs/AreaOccupantsTab.tsx` | 재실자 |
| `utils/areaHelpers.ts` | 헬퍼 |

#### `CardFmtPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 카드 형식 Grid + SplitDrawerLayout |
| `CardFmtDrawer.tsx` | 형식 상세 Drawer |
| `useCardFmtColumns.tsx` | Grid 컬럼 |
| `BitVisualizer.tsx` | 비트 시각화 |
| `utils/cardFmtHelpers.ts` | 헬퍼 |

#### `LinkagePage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 연동 규칙 Grid + SplitDrawerLayout |
| `LinkageDrawer.tsx` | `LinkageWorkspace` 래핑 Drawer |
| `useLinkageColumns.tsx` | Grid 컬럼 |
| `components/LinkageWhenSection.tsx` | 조건 섹션 |
| `components/LinkageThenSection.tsx` | 동작 섹션 |

#### `SchedulePage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 타임존 Grid + Drawer (`PageHeader`「스케쥴」) |
| `components/TimezoneDetailPanel.tsx` | 타임존 상세 Drawer |
| `components/TimezoneDetailFields.tsx` | 타임존 필드 |
| `components/HolidaySection.tsx` | Drawer 내 휴일 섹션 (타임존 소속) |
| `components/HolidayDetailFields.tsx` | 휴일 필드 |
| `useTimezoneColumns.tsx` | Grid 컬럼 |
| `useTimezonesData.ts` | 타임존 목록·선택 |
| `useScheduleHolidays.ts` | 휴일 목록·타임존별 필터 (`useHolidayList`) |
| `useTimezoneEditor.ts` / `useHolidayEditor.ts` | CRUD mutation 래퍼 |

#### `EventMonitorPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 실시간·이력 모니터 |
| `EventGrid.tsx` | 이벤트 Grid |
| `EventDetailPanel.tsx` | 이벤트 상세 Drawer |
| `MonitorToolbar.tsx` | 툴바 (날짜·필터) |
| `hooks/useLiveEvents.ts` | SSE 실시간 이벤트 |
| `hooks/useHistoryEvents.ts` | 이력 API 이벤트 |
| `utils/dateRange.ts` | 날짜 범위 헬퍼 |

#### `AlarmSettingsPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 경보 설정 Shell |
| `AlarmSettingsShell.tsx` | 탭 컨테이너 |
| `tabs/AlarmRulesTab.tsx` | 규칙 Grid + SplitDrawerLayout |
| `tabs/AlarmPriorityTab.tsx` | 우선순위 Grid + SplitDrawerLayout |
| `tabs/AlarmMailTab.tsx` | 메일 (`AlarmMailListPane` — 예외) |
| `components/AlarmRuleDrawer.tsx` | 규칙 Drawer |
| `components/AlarmPriorityDrawer.tsx` | 우선순위 Drawer |
| `components/AlarmMailDrawer.tsx` | 메일 Drawer |
| `useAlarmRuleColumns.tsx`, `useAlarmPriorityColumns.tsx` | Grid 컬럼 |
| `utils/alarmHelpers.ts` | 헬퍼 |

#### `UsersPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 사용자 Grid + SplitDrawerLayout |
| `UserDrawer.tsx` | 사용자 상세 Drawer |
| `useUserColumns.tsx` | Grid 컬럼 |
| `tabs/UserInfoTab.tsx` | 기본 정보 |
| `tabs/UserPermissionsTab.tsx` | 메뉴 권한 |
| `permissions.ts` | 권한 상수 |
| `utils/userHelpers.ts` | 헬퍼 |

#### `AuditLogPage/`
| 파일 | 역할 |
|------|------|
| `index.tsx` | 운영 기록 페이지 |
| `AuditGrid.tsx` | 기록 Grid |
| `AuditToolbar.tsx` | 검색·필터 툴바 |
| `utils/auditBadge.ts` | 액션 타입 뱃지 |

---

## 7. 라우트 ↔ 페이지 매핑

`src/router.tsx` 기준:

```
/                    → redirect → /login
/login               → LoginPage

/_app (RootLayout)
├── /emps              → EmpsPage
├── /cards             → CardsPage
├── /access            → AccessPage
├── /controllers       → ControllersPage
├── /readers           → ReadersPage
├── /inputs            → InputsPage
├── /outputs           → OutputsPage
├── /area              → AreaPage
├── /cardfmt           → CardFmtPage
├── /monitor           → EventMonitorPage
├── /users             → UsersPage
├── /audit             → AuditLogPage
├── /alarm-settings    → AlarmSettingsPage
├── /schedule          → SchedulePage
└── /linkage           → LinkagePage
```

---

## 국제화 (i18n)

UI 표시 문자열은 **컴포넌트 JSX에 한글을 직접 넣지 않습니다.** `src/locales/ko/*.json` + `react-i18next`를 사용합니다.

| 경로 | 역할 |
|------|------|
| `src/lib/i18n/index.ts` | i18next 초기화 (`main.tsx`에서 import) |
| `src/locales/ko/common.json` | 공통 라벨 (명칭, 상태, 활성 등) |
| `src/locales/ko/nav.json` | 사이드바 메뉴·권한 카테고리/항목 |
| `src/locales/ko/layout.json` | 타이틀바·상태바·사이드바 헤더 |
| `src/locales/ko/auth.json` | 로그인 폼·검증 메시지 |
| `src/locales/ko/device.json` | 장치 도메인 (제어기·입출력·리더·트리) |
| `src/locales/ko/reader.json` | 리더 상세·탭 |
| `src/locales/ko/emp.json` | 직원 |
| `src/locales/ko/card.json` | 카드 |
| `src/locales/ko/area.json` | 영역 |
| `src/locales/ko/access.json` | 접근 권한 |
| `src/locales/ko/schedule.json` | 스케줄·타임존 |
| `src/locales/ko/alarm.json` | 경보 설정 |
| `src/locales/ko/user.json` | 사용자 |
| `src/locales/ko/cardFmt.json` | 카드 형식 |
| `src/locales/ko/linkage.json` | 연동 규칙 |
| `src/locales/ko/eventMonitor.json` | 이벤트 모니터 |
| `src/locales/ko/audit.json` | 운영 기록 |
| `src/locales/ko/entity.json` | 엔티티 표시 fallback (`entityDisplayLabels`) |

**사용 패턴**

- React 컴포넌트: `const { t } = useTranslation('device')` → `t('grid.scp')`
- 비-React 유틸: `import i18n from '@/lib/i18n'` → `i18n.t('tree.controllers', { ns: 'device' })`
- 네임스페이스 복수: `useTranslation(['common', 'device'])` → `t('common:name')`
- Zod: `createXxxSchema(t)` 팩토리 (`formTypes.ts`)

---

## 부록: 명명 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `SearchField.tsx` |
| 일반 파일 | camelCase | `empHelpers.ts` |
| 폴더 | kebab-case | `page-actions/` |
| export | named export only | `export const Button = ...` |
| import 경로 | `@/` 절대경로 | `@/components/primitive/Button` |
