---

## 📁 File Naming Convention (파일 이름 규칙)
AI는 새로운 컴포넌트 파일(.md, .json) 생성 시 아래의 **Kebab-case** 규칙을 엄격히 준수한다.

| 추천 이름 (Kebab-case) | 설명 |
| :--- | :--- |
| `input-field.md` | 공백 대신 하이픈(`-`) 사용으로 통일 |
| `checkbox-radio.md` | 유사한 두 요소를 한 파일에 담을 때 적합 |
| `select-dropdown.md` | 동작 중심의 이름 사용 |
| `navigation-bar.md` | 줄임말 사용을 최소화하고 풀네임 사용 |

---

# 📑 [컴포넌트 이름] Specification
**Status**: Draft / Review / Final

## 1. 🎯 Definition & Usage
- **목적**: 
- **사용처**: 

## 2. ⚡ Interaction & State
- **Default**: 
- **Hover / Active / Disabled**: 

## 3. 📐 Layout & Content Rules
- **Label/Icon**: 
- **Padding/Gap**: 

---

## 🧱 JSON Structure Reference
AI는 `design-system.md`의 규칙을 준수하여 아래 구조로 데이터를 생성한다.

```json
{
  "component": "[Name]",
  "variants": {
    "primary": {
      "default": {
        "bg-color": "{token.path}",
        "padding": {
          "value": "{token.path}",
          "tailwind": "{class}"
        },
        "_description": "설명"
      }
    }
  }
}
```
---

### 🚨 데이터 누락 및 오류 대응 (Validation)

1. 누락 데이터: 피그마에서 확인되지 않는 값은 임의로 추측하지 말고 "MISSING_FROM_DESIGN"으로 표기한다.
2. 설명 추가: 해당 값 옆에 _description 키를 사용하여 어떤 정보가 누락되었는지 명시한다.
3. 알림: 작업 완료 후 반드시 "⚠️ 데이터 누락 알림: [컴포넌트명]에서 [항목] 확인 필요" 메시지를 출력한다.