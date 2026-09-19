# 카카오맵 맛집검색 - Next.js

1~11단계까지 구현한 카카오맵 기반 맛집검색 MVP입니다.

## 구현 기능

- Next.js App Router + TypeScript + Tailwind CSS
- Kakao Map Web SDK 지도 표시
- Kakao Local REST API 음식점(FD6) / 카페(CE7) 검색
- 지역/음식 키워드 검색
- 현재 위치 주변 맛집 검색
- 지도 중심 기준 재검색
- 음식 카테고리 빠른 검색
- 지도 마커 ↔ 음식점 카드 선택 연동
- PC 지도/목록 분할 화면
- 모바일 Bottom Sheet
- `/place/[id]` 음식점 상세페이지
- 전화하기 / 카카오맵 보기 / 길찾기

## 1. 설치

```bash
npm install
```

## 2. 환경변수

`.env.example`을 복사해 `.env.local`을 만듭니다.

```env
NEXT_PUBLIC_KAKAO_MAP_KEY=카카오_JAVASCRIPT_KEY
KAKAO_REST_API_KEY=카카오_REST_API_KEY
```

REST API 키에는 `NEXT_PUBLIC_`을 붙이지 마세요.

## 3. Kakao Developers 설정

- 카카오맵 API 사용 설정 ON
- JavaScript SDK 도메인에 개발 주소 등록
  - `http://localhost:3000`
- Vercel 배포 후 실제 Vercel 도메인도 추가

## 4. 개발 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 5. 빌드 확인

```bash
npm run build
```

## 주요 구조

```text
app/
  api/restaurants/search/route.ts
  api/restaurants/nearby/route.ts
  place/[id]/page.tsx
components/
  map/
  restaurant/
lib/kakao/
types/
```

## 보안

- `.env.local`은 Git에 커밋하지 않습니다.
- `KAKAO_REST_API_KEY`는 서버 Route Handler에서만 사용합니다.
- JavaScript 키는 Kakao Developers의 JavaScript SDK 도메인 제한을 반드시 설정합니다.

## 다음 단계

12단계에서는 Supabase Auth, 즐겨찾기, 최근 본 맛집, RLS를 추가할 수 있습니다.
