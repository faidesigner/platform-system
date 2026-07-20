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

> 규칙 원문은 `design-system.md`의 "AI Execution & Mapping Rules" 참조. (MISSING_FROM_DESIGN 표기 · _description · 누락 알림)
