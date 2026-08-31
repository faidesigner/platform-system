# Typography Web Guide

이 문서는 Web 플랫폼의 타이포그래피 토큰을 정의합니다.
실제 수치는 동일 폴더의 `typography-w.json` 파일을 참조하세요.

---

## 규칙

- Web UI의 모든 텍스트 스타일은 이 토큰을 사용합니다.
- CSS 접두사는 `w-`입니다.
- KO(한국어)가 기본값입니다. EN·JA는 다른 값이 있는 항목만 오버라이드됩니다.
- 폰트 크기를 임의 지정하지 않습니다. 스케일 외 크기가 필요한 경우 시스템 관리자에게 요청합니다.

---

## 언어별 적용 방식

| 언어 | 적용 방식 |
| --- | --- |
| KO | `@theme` 기본값 |
| EN | `html[lang='en']` 오버라이드 |
| JA | `html[lang='ja']` 오버라이드 (M PLUS 2 폰트) |

---

## 타입 스케일

| 카테고리 | 스케일 | 용도 |
| --- | --- | --- |
| display | L / M / S | 히어로, 랜딩 대형 텍스트 |
| title | XL / L / M / S | 페이지 제목, 섹션 제목 |
| text | XL / L / M / S / XS | 본문, 설명, 라벨 |
| caption | L / M / S | 보조 설명, 메타 정보 |

---

## CSS 변수 패턴

```css
--w-{카테고리}-{스케일}-{속성}
/* 예시 */
--w-display-L-size
--w-title-M-lineHeight
--w-text-S-letterSpacing
--w-caption-M-size
```
