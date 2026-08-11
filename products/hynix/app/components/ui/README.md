# hynix 로컬 컴포넌트 (승격 대기소)

피그마 기준으로 **여기서 먼저** 컴포넌트를 만들고 → hynix 페이지에서 검증 → 안정되면
공용 `packages/ui/components/`로 승격한다.

## 규칙
- 폴더 구조는 공용 `packages/ui/components/`와 **동일하게** 미러링 (승격 시 파일 통째 이동)
- import: 로컬은 `@/app/components/ui/...`, 공용은 `@fai/ui/components/...`
- 승격 절차: ① 파일을 packages/ui로 이동 ② import 경로 교체 ③ hynix 페이지에서 공용 것 사용하도록 변경 ④ 로컬본 삭제
- 컬러/토큰은 root/foundation 것을 그대로 참조 (하드코딩 금지)

## 진행 현황
| 컴포넌트 | 로컬 생성 | 페이지 검증 | 공용 승격 |
|---|---|---|---|
| (아직 없음) | | | |
