# 03 · 화면 인덱스 (hynix 메뉴 도메인)

> 지금까지 구현한 화면을 SCR 코드로 정리한다. 라우팅·컴포넌트·상태의 단일 출처.

## 화면 목록

| SCR 코드 | 화면명 | 라우트 | 파일 | 피그마 |
|---|---|---|---|---|
| **SCR-41** | 메뉴 관리 (목록) | `/menu` | `app/menu/page.tsx` | 67:8635 |
| **SCR-41-C** | 메뉴 등록 | `/menu/new` | `app/menu/new/page.tsx` | 120:6824 |
| **SCR-41-UD** | 메뉴 수정·삭제 | `/menu/new?id=N` | `app/menu/new/page.tsx` (isDetail 분기) | 67:8636 |

- **SCR-41-C 와 SCR-41-UD 는 같은 컴포넌트**다. `?id` 쿼리 유무(`isDetail`)로 분기:
  - 없으면 = 등록(C): 빈 폼, 하단 [취소][저장]
  - 있으면 = 수정·삭제(UD): 기본 정보 상단 KPI(누적 식수·만족도), 데이터 채움, 하단 [삭제][취소][수정]

## 화면 흐름

```
SCR-41 (목록)
  ├─ [단품 등록] 버튼 ─────────→ SCR-41-C (/menu/new)
  └─ 테이블 행 클릭 ──────────→ SCR-41-UD (/menu/new?id=N)
                                    ├─ [수정] → 목록
                                    ├─ [삭제] → confirm → 목록
                                    └─ [취소] → 목록
```

## 인터랙션 (구현 완료)

**SCR-41 (목록)**
- 사이드바 메뉴 클릭 → 라우팅 (`nav.ts`의 NAV_ROUTES 매핑)
- 필터 셀렉트 3개(캠퍼스/식당위치/운영코너) + [조회] → 아래 조회 영역 갱신
- 검색 인풋 → 테이블 즉시 필터 + 카운트 갱신
- 페이지네이션: 한 페이지 10개, 번호 10개 묶음. 10페이지 이하면 ‹ › 미노출, 넘으면 묶음 이동
- 테이블 행 클릭 → SCR-41-UD 이동 + hover 하이라이트

**SCR-41-C / SCR-41-UD (등록/수정)**
- 인풋·textarea·select·radio·checkbox·toggle 전부 상태 연결
- 주재료·부재료: 태그 클릭 추가 / X 제거 (TagPicker)
- 알레르기: 8열 × 3행 체크박스 각 셀 독립 토글
- 파일 올리기: 실제 파일 선택 + 파일명 표시
- 저장/수정/삭제/취소 → 목록 이동

## 라우팅 매핑 (nav.ts)

현재 실제 라우트가 있는 것은 메뉴 관리(`/menu`)뿐. 나머지 사이드바 항목은 화면 생기면 `NAV_ROUTES`에 추가한다.

## 컴포넌트 (app/components/ui/ · 승격 대기)

Button · Input · Textarea · Select · Radio · Checkbox · Toggle · TagChip · Badge · Table · Breadcrumbs · Sidebar · Modal · Toast · Icon(스캐폴드)

> 공용 `packages/ui`로 승격 시: Input·Select·Radio·Toggle·TagChip·Sidebar·Icon·Modal·Toast는 신규(안전). **Button·Checkbox·Badge·Table·Breadcrumbs·Textarea는 공용에 동명 존재 → 접두어/네임스페이스로 분리 필요(그대로 덮으면 기존 브랜드 깨짐).**
