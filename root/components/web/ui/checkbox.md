# Checkbox Specification
**Status**: Draft

> CheckboxInput(단일) + CheckboxList(그룹) + CheckboxListItem(항목) 3개 컴포넌트를 한 파일에 정의.
> 기존 Checkbox(18px 박스 프리미티브, partial 지원)·CheckboxField(고정폭 폼 레이아웃)를 그대로 재사용.

## 1. 🎯 Definition & Usage
- **CheckboxInput**: 체크박스 + 라벨 + 설명 단일 입력 (약관 동의, 단일 옵션)
- **CheckboxList / ListItem**: 다중 선택 목록 (알림 설정, 필터, 권한 선택)
- **사용 금지**: 상호 배타적 단일 선택은 Radio 사용. 즉시 적용되는 on/off 설정은 Switch 사용. 항목이 7개 이상이면 검색/그룹핑 검토

## 2. ⚡ Variants & State

| 체크 상태 | 박스 스타일 (기존 Checkbox 그대로) |
|---|---|
| unchecked | border-secondary 1.2px + 흰 배경 |
| checked | filled-primary 배경 + 체크 아이콘 |
| partial (indeterminate) | filled-primary 배경 + 가로선 |
| error | border-negative |
| disabled | border-disabled + 텍스트 disabled 컬러 |

## 3. ⚡ Interaction & State
- **클릭 영역**: 라벨 포함 행 전체 (`<label>` 래핑)
- **그룹 모드**: CheckboxList 안의 ListItem은 `value` 기준으로 선택을 그룹에 위임 (컨텍스트 자동 감지). 그룹의 disabled/error가 항목에 전파
- **단독 모드**: ListItem을 `checked`/`onCheck`로 독립 사용 가능
- **접근성**: 네이티브 `<input type="checkbox">`(sr-only) 기반 — 키보드/스크린리더 기본 지원. 그룹은 `role="group"` + `aria-labelledby`

## 4. 📐 Layout & Content Rules
- **박스**: 18px, radius `{cornerRadius.XXS}` 4px, 터치 영역 24px (기존 Checkbox)
- **라벨**: `w/text/S` primary. **설명**: `w/caption/M` tertiary
- **간격**: 박스-라벨 gap `{size.8}`, ListItem 상하 padding `{size.12}`
- **endContent**: ListItem 우측 끝 (Badge, 카운트 등), 세로 중앙
- **hasDividers**: 항목 사이 border-tertiary 구분선

## 5. 🧩 Props (API)

### CheckboxInput
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | 라벨 (labelHidden으로 시각 숨김 가능) |
| description | string | – | 보조 설명 |
| checked | boolean \| 'partial' | `false` | 체크 상태 |
| onChange | (checked) => void | – | 변경 콜백 |
| disabled / error | boolean | `false` | |
| name / value | string | – | 폼 제출용 |

### CheckboxList
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | 그룹 라벨 (labelHidden 가능) |
| description | string | – | 그룹 설명 |
| value | string[] | `[]` | 선택된 값들 (제어형) |
| onChange | (values: string[]) => void | – | 변경 콜백 |
| hasDividers | boolean | `false` | 구분선 |
| disabled / error | boolean | `false` | 그룹 전체 적용 |

### CheckboxListItem
| prop | type | default | 설명 |
|---|---|---|---|
| label | ReactNode | 필수 | 항목 라벨 |
| value | string | – | 그룹 모드 식별 값 |
| description | string | – | 보조 설명 |
| endContent | ReactNode | – | 우측 콘텐츠 |
| disabled | boolean | `false` | 개별 비활성 |
| checked / onCheck | – | – | 단독 모드 전용 |

## 6. 🎨 Token Mapping
```json
{
  "component": "Checkbox",
  "box": {
    "size": "18px",
    "radius": "{cornerRadius.XXS}",
    "unchecked-border": "{color.border.secondary}",
    "checked-bg": "{color.filled.basic.primary}",
    "error-border": "{color.border.negative}",
    "disabled-border": "{color.border.disabled}"
  },
  "text": {
    "label": { "typography": "{w.text.S}", "color": "{color.text.basic.primary}" },
    "description": { "typography": "{w.caption.M}", "color": "{color.text.basic.tertiary}" },
    "disabled-color": "{color.text.basic.disabled}"
  },
  "layout": {
    "gap": "{size.8}",
    "item-padding-y": "{size.12}",
    "divider": "{color.border.tertiary}"
  }
}
```

## 7. ✅ Best Practices
- 라벨은 항상 제공 — 시각적으로 숨겨도 labelHidden으로 스크린리더에 유지
- 체크 = 긍정 상태로 문구 작성 ("알림 끄기" ❌ / "알림 받기" ⭕)
- partial은 하위 항목 일부 선택 표시 용도로만 (전체 선택 패턴)
- 선택 결과가 즉시 적용되면 Switch, 폼 제출로 적용되면 Checkbox
- ListItem endContent에는 읽기 전용 요소만 (버튼 중첩 금지)
