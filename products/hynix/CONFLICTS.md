# 컴포넌트 승격 충돌 로그

hynix → packages/ui 승격/재사용 시 발견된 충돌을 **기록만** 한다 (현재 정책: 무시하고 진행).

| 날짜 | 컴포넌트 | 충돌 유형 | 내용 | 상태 |
|---|---|---|---|---|
| 2026-08-08 | `packages/ui/components/navigation/TabletDrawerMenu.tsx` | 프로덕트 종속 import | 공용 컴포넌트인데 homepage 전용 `@/config/site`(=`products/homepage/config/site.ts`)를 import함. `@fai/ui` 배럴(index.ts)을 통째로 당기면 이 파일 때문에 hynix 빌드가 `Module not found: '@/config/site'` 로 깨진다. | 보류(무시). hynix는 배럴 대신 `@fai/ui/components/...` 서브패스로 필요한 것만 import해서 우회. 근본 수정(공용 컴포넌트에서 프로덕트 종속 제거)은 나중에 일괄 처리. |

## 메모
- `@fai/ui` package.json 에 `exports` 필드가 없음 → 서브패스 import 동작이 번들러에 의존적일 수 있음. 추후 `exports` 맵 추가를 검토.

## 컬러 토큰 최신화 (2026-08-08, 피그마 기준)

피그마(사연님이 직접 조정한 최신)를 SSOT로, 저장소 토큰을 대조·갱신.

| 항목 | 저장소(구) | 피그마(최신) | 조치 |
|---|---|---|---|
| hynix `filled-brand-primaryBtn` (버튼 주색) | teal-500 #00827c | teal-400 #009a93 | ✅ 변경함 (Light 블록) |
| hynix `filled-brand-primary` (채움) | teal-500 | teal-400 #009a93 | ✅ 변경함 |
| 텍스트 강조(날짜/제목) | teal-500 | teal-500 #00827c | 유지 (피그마도 500) |
| 선택 배경 `#e0f3f2` | 없음 | 신규 톤 사용 | ⏸ 보류 — selected 컴포넌트 만들 때 토큰 추가 (teal-50 #e6f5f4 과 teal-100 #ccebe9 사이) |

- 범위: hynix Light 블록의 버튼/채움 계열만. text/icon/border 및 brand-primary(범용)는 유지(사용자 결정).
- 다른 브랜드(fainders 등) 무영향 확인. 기존 Button 사용처 88곳 안 깨짐(토큰 이름 유지, 값만 갱신).
- 백업: color-brand.css.bak_before_hynix_teal400
