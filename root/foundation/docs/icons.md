# Icons Guide

이 문서는 서비스에서 사용하는 시맨틱 아이콘 이름을 정의합니다.
실제 목록은 동일 폴더의 `icons.json` 파일을 참조하세요.

---

## 규칙

- 컴포넌트에서는 가능한 한 시맨틱 아이콘 이름을 사용합니다.
- 아이콘 구현체는 교체될 수 있으므로, 사용처에서는 SVG 파일명보다 역할 이름을 우선합니다.
- 목록에 없는 아이콘이 필요하면 먼저 시맨틱 이름과 용도를 정의한 뒤 추가합니다.
- 장식 목적 아이콘은 접근성 텍스트와 상태 전달 여부를 함께 검토합니다.

---

## 시맨틱 아이콘 이름

| 이름 | 용도 |
| --- | --- |
| close | 닫기, 다이얼로그/패널 해제 |
| chevronDown | 드롭다운, 펼침/접힘 |
| chevronLeft | 이전, 뒤로 이동 |
| chevronRight | 다음, 앞으로 이동 |
| check | 체크박스 선택, 확인 |
| success | 성공 상태 |
| error | 오류 상태 |
| warning | 경고 상태 |
| info | 정보, 툴팁 |
| calendar | 날짜 선택, 일정 |
| clock | 시간 선택, 타임스탬프 |
| externalLink | 새 창 링크 |
| menu | 햄버거 메뉴, 내비게이션 토글 |
| moreHorizontal | 더보기, 오버플로우 메뉴 |
| search | 검색 |
| arrowUp | 오름차순, 위로 이동 |
| arrowDown | 내림차순, 아래로 이동 |
| arrowsUpDown | 정렬 가능 컬럼 |
| funnel | 필터 |
| eyeSlash | 숨김, 표시 토글 |
| viewColumns | 컬럼 표시 설정 |
| copy | 클립보드 복사 |
| checkDouble | 복사 완료 |
| wrench | 설정 |
| stop | 중지, 취소 |
| microphone | 음성 입력, 오디오 녹음 |

---

## 사용 패턴

```tsx
<Icon name="search" />
<Icon name="externalLink" />
```
