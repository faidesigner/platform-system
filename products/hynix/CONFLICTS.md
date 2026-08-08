# 컴포넌트 승격 충돌 로그

hynix → packages/ui 승격/재사용 시 발견된 충돌을 **기록만** 한다 (현재 정책: 무시하고 진행).

| 날짜 | 컴포넌트 | 충돌 유형 | 내용 | 상태 |
|---|---|---|---|---|
| 2026-08-08 | `packages/ui/components/navigation/TabletDrawerMenu.tsx` | 프로덕트 종속 import | 공용 컴포넌트인데 homepage 전용 `@/config/site`(=`products/homepage/config/site.ts`)를 import함. `@fai/ui` 배럴(index.ts)을 통째로 당기면 이 파일 때문에 hynix 빌드가 `Module not found: '@/config/site'` 로 깨진다. | 보류(무시). hynix는 배럴 대신 `@fai/ui/components/...` 서브패스로 필요한 것만 import해서 우회. 근본 수정(공용 컴포넌트에서 프로덕트 종속 제거)은 나중에 일괄 처리. |

## 메모
- `@fai/ui` package.json 에 `exports` 필드가 없음 → 서브패스 import 동작이 번들러에 의존적일 수 있음. 추후 `exports` 맵 추가를 검토.
