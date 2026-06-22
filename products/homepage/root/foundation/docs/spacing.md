# Spacing & Border Radius Tokens

> FAI 디자인 시스템의 여백(spacing)과 모서리 둥글기(border-radius) 규격 정의.

## 개요

여백 토큰은 `--size-{n}` 원시값을 기반으로 `--fai-space-{scale}` 시맨틱 변수로 매핑됩니다.
Border Radius 역시 동일한 size 스케일을 공유합니다.

---

## Spacing (여백)

CSS 변수: `--fai-space-{scale}` / Tailwind: `p-*`, `m-*`, `gap-*` (spacing은 `fai-` 접두어 없음)

| 토큰 | CSS 변수 | rem | px | 주요 용도 |
|------|----------|-----|----|-----------|
| `3xs` | `--fai-space-3xs` | 0.125rem | 2px | 아이콘·텍스트 사이 최소 간격 |
| `2xs` | `--fai-space-2xs` | 0.25rem | 4px | 인라인 요소 사이 간격 |
| `xs` | `--fai-space-xs` | 0.375rem | 6px | 컴팩트 UI 내부 패딩 |
| `s` | `--fai-space-s` | 0.5rem | 8px | 소형 컴포넌트 패딩 |
| `ms` | `--fai-space-ms` | 0.75rem | 12px | 중소형 컴포넌트 패딩 |
| `m` | `--fai-space-m` | 1rem | 16px | **기본 패딩·마진 (베이스라인)** |
| `ml` | `--fai-space-ml` | 1.125rem | 18px | M과 L 사이 보조 간격 |
| `l` | `--fai-space-l` | 1.25rem | 20px | 카드 내부 패딩 |
| `xl` | `--fai-space-xl` | 1.5rem | 24px | 섹션 내부 간격 |
| `2xl` | `--fai-space-2xl` | 2rem | 32px | 컴포넌트 간 간격 |
| `3xl` | `--fai-space-3xl` | 2.5rem | 40px | 섹션 간 간격 |
| `4xl` | `--fai-space-4xl` | 3.5rem | 56px | 대형 섹션 간격·여백 |
| `5xl` | `--fai-space-5xl` | 5rem | 80px | 히어로·페이지 섹션 간격 |
| `6xl` | `--fai-space-6xl` | 6.25rem | 100px | 대형 레이아웃 간격 |
| `7xl` | `--fai-space-7xl` | 7.5rem | 120px | 섹션 상하 여백 |
| `8xl` | `--fai-space-8xl` | 11.25rem | 180px | 히어로 하단 여백 |
| `9xl` | `--fai-space-9xl` | 15rem | 240px | 풀페이지 레이아웃 여백 |

---

## Border Radius (모서리 둥글기)

CSS 변수: `--fai-radius-{scale}` / Tailwind: `rounded-fai-*`

| 토큰 | CSS 변수 | rem | px | 주요 용도 |
|------|----------|-----|----|-----------|
| `none` | `--fai-radius-none` | 0rem | 0px | 모서리 없음 |
| `2xs` | `--fai-radius-2xs` | 0.25rem | 4px | 태그, 배지, 칩 |
| `xs` | `--fai-radius-xs` | 0.375rem | 6px | 소형 인풋 |
| `s` | `--fai-radius-s` | 0.5rem | 8px | 인풋, 버튼 소형 |
| `ms` | `--fai-radius-ms` | 0.75rem | 12px | 카드 소형, 버튼 중형 |
| `m` | `--fai-radius-m` | 1rem | 16px | 카드 기본, 패널 |
| `l` | `--fai-radius-l` | 1.25rem | 20px | 대형 카드, 모달 |
| `xl` | `--fai-radius-xl` | 1.5rem | 24px | 풀스크린 시트, 바텀시트 |
| `circle` | `--fai-radius-circle` | 62.438rem | ~999px | 아바타, 원형 버튼, 필 배지 |

---

## Tailwind 사용 예시

```tsx
// Spacing — fai- 접두어 없음
<div className="p-m gap-xl">...</div>
<section className="py-4xl px-2xl">...</section>
<div className="mt-3xs ml-xs">...</div>

// Border Radius — rounded-fai-* 접두어 유지
<button className="rounded-fai-s px-m py-s">버튼</button>
<div className="rounded-fai-m p-l">카드</div>
<img className="rounded-fai-circle" />
```

## 스케일 시각화

```
9xl  ████████████████████████████████████████████████   240px
8xl  ██████████████████████████████████████             180px
7xl  ███████████████████████████████                    120px
6xl  █████████████████████████                          100px
5xl  █████████████████████                              80px
4xl  ██████████████                                     56px
3xl  ██████████                                         40px
2xl  ████████                                           32px
xl   ██████                                             24px
l    █████                                              20px
ml   ████▌                                              18px
m    ████                                               16px  ← baseline
ms   ███                                                12px
s    ██                                                 8px
xs   █▌                                                 6px
2xs  █                                                  4px
3xs  ▌                                                  2px
```

## 사용 규칙

- 컴포넌트 내부 패딩은 주로 `s`(8px) ~ `xl`(24px) 범위 사용
- 섹션 간 세로 여백은 `2xl`(32px) ~ `4xl`(56px) 범위 사용
- 히어로·페이지 레이아웃 여백은 `5xl`(80px) ~ `8xl`(180px) 범위 사용
- `ml`(18px)은 `m`(16px)과 `l`(20px) 사이 보조 단계로 필요 시 사용
- `3xs`(2px), `2xs`(4px)는 아이콘·텍스트 정렬 미세 조정 용도
- Border radius는 컴포넌트 높이의 절반을 넘지 않도록 권장 (단, `circle` 제외)
