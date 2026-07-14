# File Input Specification
**Status**: Draft

> 셸 없음(디자이너 확정): 라벨/설명은 **Field(field.md)**가 담당. 내부 검증 에러(maxSize/maxFiles)만 스스로 표시.
> 드롭존 dashed 보더: **2px + `{color.border.fourth}`** (디자이너 확정 2026-07-14 — border-fourth: 중간톤·dashed 용도 토큰)

## 1. 🎯 Definition & Usage
- **목적**: 파일 선택·업로드 입력 (드래그&드롭 + 클릭)
- **사용처**: 첨부 파일, 이미지 업로드, 문서 제출 폼
- **사용 금지**: 업로드 진행률/서버 상태 표시는 상위에서 (이 컴포넌트는 선택까지만)

## 2. ⚡ Variants

| mode | 형태 |
|---|---|
| dropzone *(default)* | 세로형 드롭 영역 — dashed 보더 ✱, 아이콘+안내 문구 |
| input | 한 줄 박스형 (h 40px) — 폼 인라인 배치 |

| 트리거 상태 | 스타일 |
|---|---|
| default | input: border-secondary / dropzone: **border-fourth 2px dashed** |
| hover | input: border-primary / dropzone: fill-faint 배경 |
| dragover | border-brand + fill-faint 배경 |
| error | input 모드: negative 2px 스트로크 / dropzone: 2px dashed negative |
| disabled | fill-disabled + disabled 텍스트 |

## 3. ⚡ Interaction & State
- **선택**: 클릭 → 네이티브 파일 피커 / 드래그&드롭 (disabled 시 차단)
- **검증**: `maxSize`(파일당)·`maxFiles` 초과는 내부에서 거부 + 에러 메시지(`role="alert"`). 같은 파일 재선택 허용
- **파일 목록**: 이름(truncate) + 크기 + 개별 제거(X) 버튼. multiple이면 기존 목록에 추가
- **접근성**: 네이티브 `input[type=file]`(sr-only) 기반, 라벨 연결

## 4. 📐 Layout & Content Rules
- **dropzone**: 상하 padding `{size.24}`, 업로드 아이콘 20px + 안내 문구(tertiary)
- **파일 항목**: fill-faint 배경 + radius 8, padding `{size.12}`×`{size.4}`
- **description**: 허용 형식·최대 용량 안내 권장 ("PDF, 10MB 이하")

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | 라벨 (labelHidden 가능) |
| value / onChange | File \| File[] \| null | 필수 | 제어형 |
| accept | string | – | 허용 형식 |
| multiple | boolean | `false` | 복수 선택 |
| maxSize | number(byte) | – | 파일당 최대 크기 |
| maxFiles | number | – | 최대 개수 (multiple) |
| mode | 'dropzone' \| 'input' | `'dropzone'` | 형태 |
| placeholder / description / required / disabled / error / errorMessage | – | – | 폼 공통 |

## 6. 🎨 Token Mapping
```json
{
  "component": "FileInput",
  "trigger": "date-input.md 박스형 규칙. dropzone: {color.border.fourth} 2px dashed",
  "dragover": { "border": "{color.border.brand-primary}", "bg-color": "{color.filled.basic.primaryOp-secondary}" },
  "file-item": { "bg-color": "{color.filled.basic.primaryOp-secondary}", "radius": "rounded-8px", "size-text": "{w.caption.M} tertiary" }
}
```

## 7. ✅ Best Practices
- description에 허용 형식과 용량 한도를 미리 안내 — 실패 후 알림보다 사전 안내
- 이미지 전용이면 accept="image/*"로 피커 단계에서 제한
- 업로드 자체(진행률·재시도)는 별도 레이어 — 이 컴포넌트는 "선택"까지만 담당

