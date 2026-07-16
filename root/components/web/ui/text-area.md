# TextArea Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 댓글, 설명, 메시지 등 여러 줄의 긴 텍스트 입력
- **사용 금지**: 이름, 이메일 등 한 줄 값(TextInput 사용)

## 2. ⚡ Variants
- size: `sm` / `md` / `lg` — padding만 변경, 높이는 rows가 소유
- status: `warning` / `error` / `success`
- startIcon, description, required/optional, hidden label

## 3. ⚡ Interaction & State
- controlled `value` / `onChange`
- `changeAction` 중 Spinner, readOnly, `aria-busy`
- `maxLength`는 입력을 막지 않고 현재/최대 문자 수와 초과 오류를 표시
- disabledMessage가 있으면 focus 가능한 aria-disabled + readOnly
- resize vertical 허용

## 4. 🧩 Props (API)
`label`, `value`, `onChange`, `changeAction`, `description`, `placeholder`, `rows`, `size`, `status`, `maxLength`, `startIcon`, `isDisabled`, `disabledMessage`, `isLoading`, `isLabelHidden`, `isOptional`, `isRequired`, `hasSpellCheck`, `hasAutoFocus`, `htmlName`

## 5. 🎨 Token Mapping
- wrapper: `rounded-fai-s border bg-100`
- size padding: sm `px-s py-xs`, md `px-ms py-s`, lg `px-m py-ms`
- 기본/focus: `border-border-subtle` / `border-border-brand`
- status: `border-border-error/warning/success`, `text-error/warning/success`
- label: `text-body-s font-medium text-primary`
- 입력: `text-body text-primary`, placeholder `text-tertiary`
- helper/counter: `text-caption-m`
- motion: `--duration-fast`

## 6. ✅ Best Practices
- 항상 명확한 label 제공, placeholder만으로 목적 전달 금지
- 제한이 있으면 maxLength와 counter 함께 제공
- validation 메시지는 status type과 함께 제공
- disabled 이유는 `disabledMessage` 사용

