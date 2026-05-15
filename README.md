# Festival Korea

한국관광공사 TourAPI 기반 전국 행사·축제 정보 앱. Cloudflare Workers로 배포.

## 로컬 개발

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 설정
cp .dev.vars.example .dev.vars
# .dev.vars에 DATA_GO_KR_APIKEY 값 입력

# 3. Next.js dev 서버 (일반 개발)
pnpm dev

# 4. Workers 런타임 프리뷰
pnpm preview
# → http://localhost:8787
```

## 환경변수

| 이름 | 설명 |
|------|------|
| `DATA_GO_KR_APIKEY` | 한국관광공사 TourAPI 서비스키 (URL-encoded) |

- **로컬**: `.dev.vars` 파일
- **프로덕션**: Cloudflare Workers 대시보드 → Settings → Variables and Secrets → **Secret** 타입으로 등록

## 배포

GitHub 저장소를 Cloudflare Workers Builds에 연결:

- **Build command**: `pnpm run build:worker`
- **Node version**: `20` (`NODE_VERSION=20` 환경변수)

push → 자동 빌드 및 배포.

수동 배포:
```bash
pnpm deploy
```

## 기술 스택

- Next.js 16 (App Router)
- Cloudflare Workers (`@opennextjs/cloudflare`)
- Tailwind CSS v4
- 한국관광공사 TourAPI v2
