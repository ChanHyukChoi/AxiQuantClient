# AxiQuant Client

보안/출입 관제 시스템 프론트엔드  
Electron + React 기반 데스크톱/웹 듀얼 타겟 애플리케이션

## 기술스택

| 분류 | 기술 |
|------|------|
| Runtime | Electron + React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| 클라이언트 상태 | Zustand |
| 서버 상태 | TanStack Query |
| 라우팅 | TanStack Router |
| API | axios |
| 폼 | React Hook Form + Zod |
| 실시간 | SSE (Server-Sent Events) |
| 다국어 | i18next |

## 프로젝트 구조

```
src/
├── assets/       # 정적 파일 (이미지, 폰트)
├── components/   # 공통 재사용 컴포넌트
│   └── ui/       # 기본 UI 단위 (버튼, 인풋 등)
├── features/     # 페이지별 기능 모듈
├── hooks/        # 커스텀 훅
├── layouts/      # 레이아웃 컴포넌트 (사이드바, 타이틀바 등)
├── lib/          # 라이브러리 설정 (axios 인스턴스, i18n 등)
├── pages/        # 라우팅 단위 페이지
├── stores/       # Zustand 스토어
├── types/        # 전역 TypeScript 타입 정의
└── utils/        # 유틸리티 함수
```

## 개발 환경

- Node.js v22 이상
- npm v10 이상

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Electron)
npm run dev

# 빌드
npm run build
```

## 디자인 시스템

- 테마: 다크 고정
- 배경색: `#1a1d21`
- 포인트 컬러: `#4f9cf9`
