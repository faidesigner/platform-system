# Typography Tokens

> FAI 디자인 시스템의 폰트 패밀리·사이즈·줄간격 규격 정의.

## 폰트 패밀리

| 역할 | 값 | 로드 방식 |
|------|----|-----------|
| 기본 (`base`) | Pretendard Variable | CDN — `pretendardvariable-dynamic-subset.min.css` (v1.3.9) |
| ja 로케일 (`ja`) | M PLUS 2 | Google Fonts — `family=M+PLUS+2:wght@400;500;600;700` |

폰트는 `globals.css`에서 `@import url(...)` 방식으로 로드됩니다.

---

## 타입 스케일

CSS 변수는 `--fai-text-{scale}`, Tailwind 클래스는 `text-fai-{scale}` 형식입니다.

### Caption

| 토큰 | CSS 변수 | 크기 | 줄간격 | 용도 |
|------|----------|------|--------|------|
| `caption-s` | `--fai-text-caption-s` | 11px (0.688rem) | 1rem | 초소형 레이블, 태그 내 텍스트 |
| `caption-m` | `--fai-text-caption-m` | 12px (0.75rem) | 1.125rem | 캡션, 메타 정보 |

### Body

| 토큰 | CSS 변수 | 크기 | 줄간격 | 용도 |
|------|----------|------|--------|------|
| `body-xs` | `--fai-text-body-xs` | 13px (0.813rem) | 1.25 | 보조 설명, 인풋 힌트 |
| `body-s` | `--fai-text-body-s` | 14px (0.875rem) | 1.313rem | 보조 본문, 레이블 |
| `body-ms` | `--fai-text-body-ms` | 15px (0.938rem) | 1.375rem | 보조 본문 (중간) |
| `body` | `--fai-text-body` | 16px (1rem) | 1.5rem | **기본 본문 (베이스라인)** |
| `body-l` | `--fai-text-body-l` | 18px (1.125rem) | 1.688rem | 강조 본문 |
| `body-xl` | `--fai-text-body-xl` | 20px (1.25rem) | 1.875rem | 리드 텍스트 |

### Title

| 토큰 | CSS 변수 | 크기 | 줄간격 | 용도 |
|------|----------|------|--------|------|
| `title-s` | `--fai-text-title-s` | 24px (1.5rem) | 2.25rem | 섹션 타이틀 소형 |
| `title-m` | `--fai-text-title-m` | 28px (1.75rem) | 2.438rem | 섹션 타이틀 중형 |
| `title-l` | `--fai-text-title-l` | 36px (2.25rem) | 3.375rem | 페이지 타이틀 |
| `title-xl` | `--fai-text-title-xl` | 48px (3rem) | 4.188rem | 히어로 타이틀 |

### Display

| 토큰 | CSS 변수 | 크기 | 줄간격 | 용도 |
|------|----------|------|--------|------|
| `display-s` | `--fai-text-display-s` | 56px (3.5rem) | 4.875rem | 랜딩 디스플레이 소형 |
| `display-m` | `--fai-text-display-m` | 64px (4rem) | 5.188rem | 랜딩 디스플레이 중형 |
| `display-l` | `--fai-text-display-l` | 80px (5rem) | 6.5rem | 랜딩 디스플레이 대형 |

---

## Tailwind 사용 예시

```tsx
<h1 className="text-fai-display-m">대형 헤드라인</h1>
<h2 className="text-fai-title-l">페이지 타이틀</h2>
<p  className="text-fai-body">기본 본문 텍스트</p>
<span className="text-fai-caption-m text-fai-tertiary">보조 캡션</span>
```

## 타입 스케일 시각화

```
display-l  ████████████████████████ 80px
display-m  ██████████████████████   64px
display-s  ████████████████████     56px
title-xl   ████████████████         48px
title-l    ████████████             36px
title-m    ██████████               28px
title-s    █████████                24px
body-xl    ████████                 20px
body-l     ███████                  18px
body       ██████                   16px  ← baseline
body-ms    █████                    15px
body-s     █████                    14px
body-xs    ████                     13px
caption-m  ███                      12px
caption-s  ██                       11px
```

## 사용 규칙

- `body` (16px) 이하의 텍스트에는 `font-weight: 400` 기본
- `title-*` 이상은 `font-weight: 600` 또는 `700` 권장
- 줄간격은 Tailwind에서 자동 적용되므로 별도 `leading-*` 클래스 사용 자제
