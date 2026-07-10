import type { Config } from 'tailwindcss'

/**
 * FAI Design System — Tailwind Config
 *
 * 토큰 소스:
 *   - platform-system/root/foundation/color-global.json         Primitive 색상
 *   - platform-system/root/foundation/color-semantic.json       Semantic 색상 (CSS var)
 *   - platform-system/root/foundation/spacing.json              Spacing & border radius
 *   - platform-system/root/foundation/typography.json           Font family & size
 *   - platform-system-main/root/web/tokens/grid.json            Layout grid (breakpoints, container, gutter)
 *
 * 사용 예:
 *   bg-surface        text-primary       border-border
 *   text-caption-s    p-m                rounded-m
 *   bg-red-500        text-gray-700
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './config/**/*.{ts,tsx}',
    './root/components/**/*.{ts,tsx,js,jsx}',
    '../../packages/ui/components/**/*.{ts,tsx,js,jsx}',
    // 테스트 파일은 스캔에서 제외 — 주석/정규식 속 클래스 리터럴이 프로덕션 CSS로 새는 것 방지.
    '!./**/*.{test,spec}.{ts,tsx,js,jsx}',
    '!../../packages/ui/**/*.{test,spec}.{ts,tsx,js,jsx}',
  ],

  darkMode: 'class', // <html class="dark"> 로 전환

  theme: {
    extend: {

      /* -------------------------------------------------------
         Colors — Primitives  (color-global.json › color.*)
         bg-black / text-red-500 / border-gray-100 …
         ------------------------------------------------------- */
      colors: {
        black: '#000000',
        white: '#ffffff',

        red: {
          '50':  '#fef6f6',
          '100': '#fde5e3',
          '200': '#fbcfcb',
          '300': '#f7a8a1',
          '400': '#f16355',
          '500': '#ea3b2a',
          '600': '#de2412',
          '700': '#a11a0d',
          '800': '#711209',
          '900': '#420b05',
        },
        yellow: {
          '50':  '#fffaeb',
          '100': '#fef1c8',
          '200': '#fee59a',
          '300': '#fdd868',
          '400': '#fdcb35',
          '500': '#fcbe03',
          '600': '#e3ab03',
          '700': '#a17a02',
          '800': '#6f5401',
          '900': '#3c2e01',
        },
        orange: {
          '50':  '#fff7f0',
          '100': '#fee4cd',
          '200': '#fed5ae',
          '300': '#fdaf68',
          '400': '#fd9535',
          '500': '#fc7a03',
          '600': '#d46702',
          '700': '#a24e02',
          '800': '#743801',
          '900': '#3c1d01',
        },
        green: {
          '50':  '#effced',
          '100': '#e4fbdf',
          '200': '#bcf4b3',
          '300': '#81eb70',
          '400': '#5be444',
          '500': '#39db1f',
          '600': '#36cd1e',
          '700': '#2ba018',
          '800': '#1c6b0f',
          '900': '#0e3b08',
        },
        mint: {
          '50':  '#e3fcf1',
          '100': '#baf7de',
          '200': '#8cf2c7',
          '300': '#47eba6',
          '400': '#19e690',
          '500': '#17cf81',
          '600': '#14b873',
          '700': '#0f8a56',
          '800': '#0a5c3a',
          '900': '#063723',
        },
        blue: {
          '50':  '#f0f7fe',
          '100': '#ddecfe',
          '200': '#b6d7fc',
          '300': '#85bdfa',
          '400': '#4a9df7',
          '500': '#2388f6',
          '600': '#096edc',
          '700': '#0756ab',
          '800': '#053d7a',
          '900': '#03274e',
        },
        indigo: {
          '50':  '#eff1fb',
          '100': '#d7dcf4',
          '200': '#bbc3ec',
          '300': '#909ce0',
          '400': '#6071d2',
          '500': '#4459ca',
          '600': '#374cc3',
          '700': '#27378c',
          '800': '#1d2867',
          '900': '#121940',
        },
        purple: {
          '50':  '#f4f1fd',
          '100': '#eae3fc',
          '200': '#c9baf7',
          '300': '#a68cf2',
          '400': '#8d6cef',
          '500': '#693eea',
          '600': '#4c1ae5',
          '700': '#4015c1',
          '800': '#311093',
          '900': '#220b65',
        },
        grape: {
          '50':  '#fbf1fd',
          '100': '#f6dffb',
          '200': '#ecbff8',
          '300': '#e4a3f5',
          '400': '#da7ef1',
          '500': '#cf59ec',
          '600': '#c32ce8',
          '700': '#a716ca',
          '800': '#81119c',
          '900': '#5b0c6e',
        },
        sand: {
          '50':  '#f6f6f1',
          '100': '#f0efe9',
          '200': '#eceae4',
          '300': '#dcdbd8',
          '400': '#cfcfcf',
          '500': '#9e9d9c',
          '600': '#807f7d',
          '700': '#62615f',
          '800': '#484744',
          '900': '#363531',
        },

        gray: {
          '30':  '#f5f5f5',
          '50':  '#e4e6e7',
          '100': '#d2d3d5',
          '200': '#b7b9bd',
          '300': '#a1a5aa',
          '400': '#797e86',
          '500': '#61646b',
          '600': '#484d51',
          '700': '#3a3d40',
          '800': '#2c2d30',
          '900': '#1f2023',
        },

        /* -------------------------------------------------------
           Colors — Semantic  (color-semantic.json › semantic.*)
           CSS vars → globals.css :root / .dark 에서 관리
           ------------------------------------------------------- */

        /* color/bg/100 — 기본 페이지 배경 (light: white / dark: gray-900) */
        'bg-100':           'var(--color-bg-100)',

        /* Surface (배경)  semantic.bg.* */
        'surface':          'var(--fai-bg-surface)',
        'surface-alt':      'var(--fai-bg-surface-alt)',
        'surface-sunken':   'var(--fai-bg-surface-sunken)',
        'surface-raised':   'var(--fai-bg-surface-raised)',
        'overlay':          'var(--fai-bg-overlay)',
        'overlay-strong':   'var(--fai-bg-overlay-strong)',
        'overlay-max':      'var(--fai-bg-overlay-max)',
        'brand':            'var(--fai-bg-brand)',
        'brand-subtle':     'var(--fai-bg-brand-subtle)',
        'fill-strong':      'var(--fai-bg-fill-strong)',
        'fill':             'var(--fai-bg-fill)',
        'fill-soft':        'var(--fai-bg-fill-soft)',
        'fill-faint':       'var(--fai-bg-fill-faint)',
        'fill-inverse':     'var(--fai-bg-fill-inverse)',
        'fill-disabled':    'var(--fai-bg-fill-disabled)',
        'success-bg':       'var(--fai-bg-success)',
        'warning-bg':       'var(--fai-bg-warning)',
        'error-bg':         'var(--fai-bg-error)',
        'info-bg':          'var(--fai-bg-info)',

        /* Content — 텍스트 & 아이콘  semantic.color.* */
        'primary':          'var(--fai-color-primary)',
        'secondary':        'var(--fai-color-secondary)',
        'tertiary':         'var(--fai-color-tertiary)',
        'quaternary':       'var(--fai-color-quaternary)',
        'inverse':          'var(--fai-color-inverse)',
        'inverse-subtle':   'var(--fai-color-inverse-subtle)',
        'disabled':         'var(--fai-color-disabled)',
        'brand-text':       'var(--fai-color-brand)',
        'on-brand':         'var(--fai-color-on-brand)',
        'success':          'var(--fai-color-success)',
        'warning':          'var(--fai-color-warning)',
        'error':            'var(--fai-color-error)',
        'info':             'var(--fai-color-info)',

        /* Sand Filled — bg-sand-filled-* (위계: primary=옅음/면용, tertiary=진함/카드용) */
        'sand-filled-primary':   'var(--fai-bg-filled-sand-primary)',
        'sand-filled-secondary': 'var(--fai-bg-filled-sand-secondary)',
        'sand-filled-tertiary':  'var(--fai-bg-filled-sand-tertiary)',
        'sand-filled-disabled':  'var(--fai-bg-filled-sand-disabled)',
        /* legacy aliases */
        'filled-sand-primary':   'var(--fai-bg-filled-sand-primary)',
        'filled-sand-secondary': 'var(--fai-bg-filled-sand-secondary)',
        'filled-sand-tertiary':  'var(--fai-bg-filled-sand-tertiary)',
        'filled-sand-disabled':  'var(--fai-bg-filled-sand-disabled)',

        /* Text Basic — text-text-basic-* (root/foundation/color.css) */
        'text-basic': {
          primary:             'var(--color-text-basic-primary)',
          secondary:           'var(--color-text-basic-secondary)',
          tertiary:            'var(--color-text-basic-tertiary)',
          inverse:             'var(--color-text-basic-inverse)',
          'inverse-secondary': 'var(--color-text-basic-inverse-secondary)',
        },

        /* Text inverse / optional brand */
        'text-inverse':                      'var(--color-text-inverse)',
        'text-optional-brand-secondaryBtn':  'var(--color-text-optional-brand-secondaryBtn)',

        /* Filled — bg-filled-basic-* / bg-filled-optional-* */
        'filled-basic-primary':               'var(--color-filled-basic-primary)',
        'filled-optional-brand-primary':      'var(--color-filled-optional-brand-primary)',
        'filled-optional-brand-secondaryBtn': 'var(--color-filled-optional-brand-secondaryBtn)',

        /* Icon */
        'icon-basic-inverse': 'var(--color-icon-basic-inverse)',

        /* Background extended */
        'bg-200': 'var(--color-bg-200)',

        /* Border extended */
        'border-secondary': 'var(--color-border-secondary)',

        /* Sand Text — text-sand-text-* */
        'sand-text-primary':   'var(--fai-sand-text-primary)',
        'sand-text-secondary': 'var(--fai-sand-text-secondary)',
        'sand-text-tertiary':  'var(--fai-sand-text-tertiary)',

        /* Sand Border — border-sand-border-* */
        'sand-border-primary':   'var(--fai-sand-border-primary)',
        'sand-border-secondary': 'var(--fai-sand-border-secondary)',

        /* Interaction — hover overlay */
        'interaction-light-white-hover':   'var(--fai-interaction-white-hover)',
        'interaction-light-black-hover':   'var(--fai-interaction-black-hover)',
        'interaction-light-black-pressed': 'var(--fai-interaction-black-pressed)',

        /* Border  semantic.border.* */
        'border':           'var(--fai-border-default)',
        'border-subtle':    'var(--fai-border-subtle)',
        'border-faint':     'var(--fai-border-faint)',
        'border-inverse':   'var(--fai-border-inverse)',
        'border-brand':     'var(--fai-border-brand)',
        'border-brand-sub': 'var(--fai-border-brand-subtle)',
        'border-disabled':  'var(--fai-border-disabled)',
        'border-success':   'var(--fai-border-success)',
        'border-warning':   'var(--fai-border-warning)',
        'border-error':     'var(--fai-border-error)',
        'border-info':      'var(--fai-border-info)',
      },

      /* -------------------------------------------------------
         Font Family  (typography.json › fontFamily.*)
         font-base
         ------------------------------------------------------- */
      fontFamily: {
        base: ['var(--w-font-family)'], /* 로케일별 활성 폰트 — globals.css html[lang] 재정의 */
      },

      /* -------------------------------------------------------
         Font Size  (typography.json › fontSize.*)
         text-caption-s / text-body / text-title-l / text-display-m …
         ------------------------------------------------------- */
      fontSize: {
        'caption-s':  ['0.688rem', { lineHeight: '1rem' }],
        'caption-m':  ['var(--w-caption-M-size, 0.75rem)',  { lineHeight: 'var(--w-caption-M-lineHeight, 1.125rem)', letterSpacing: 'var(--w-caption-M-letterSpacing, -0.1px)' }],
        'body-xs':    ['0.813rem', { lineHeight: '1.25' }],
        'body-s':     ['var(--w-text-S-size, 0.875rem)', { lineHeight: 'var(--w-text-S-lineHeight, 1.3125rem)', letterSpacing: 'var(--w-text-S-letterSpacing, 0px)' }],
        'body-ms':    ['0.938rem', { lineHeight: '1.375rem' }],
        'body':       ['1rem',     { lineHeight: '1.5rem' }],
        'body-l':     ['var(--w-text-L-size, 1.125rem)', { lineHeight: 'var(--w-text-L-lineHeight, 1.6875rem)', letterSpacing: 'var(--w-text-L-letterSpacing, 0px)' }],
        'body-xl':    ['var(--w-text-XL-size, 1.25rem)', { lineHeight: 'var(--w-text-XL-lineHeight, 1.875rem)', letterSpacing: 'var(--w-text-XL-letterSpacing, 0px)' }],
        'title-s':    ['1.5rem',   { lineHeight: '2.25rem' }],
        'title-m':    ['var(--w-title-M-size, 1.75rem)',  { lineHeight: 'var(--w-title-M-lineHeight, 2.4375rem)', letterSpacing: 'var(--w-title-M-letterSpacing, 0.3px)' }],
        'title-l':    ['2.25rem',  { lineHeight: '3.375rem' }],
        'title-xl':   ['3rem',     { lineHeight: '4.188rem' }],
        'display-s':  ['var(--w-display-S-size, 3.5rem)', { lineHeight: 'var(--w-display-S-lineHeight, 4.875rem)', letterSpacing: 'var(--w-display-S-letterSpacing, 0.8px)' }],
        'display-m':  ['4rem',     { lineHeight: '5.188rem' }],
        'display-l':  ['5rem',     { lineHeight: '6.5rem' }],

        /* Typography Web (typography-w.json) — w/{category}/{scale}/{weight} */
        'w-display-S-bold': [
          'var(--w-display-S-size)',
          {
            lineHeight: 'var(--w-display-S-lineHeight)',
            letterSpacing: 'var(--w-display-S-letterSpacing)',
            fontWeight: '700',
          },
        ],
        'w-text-XL-regular': [
          'var(--w-text-XL-size)',
          {
            lineHeight: 'var(--w-text-XL-lineHeight)',
            letterSpacing: 'var(--w-text-XL-letterSpacing)',
            fontWeight: '400',
          },
        ],

        /* w/text shorthand — text-text-xl, text-text-m */
        'text-xl': [
          'var(--w-text-XL-size)',
          {
            lineHeight: 'var(--w-text-XL-lineHeight)',
            letterSpacing: 'var(--w-text-XL-letterSpacing)',
          },
        ],
        'text-m': [
          'var(--w-text-M-size)',
          {
            lineHeight: 'var(--w-text-M-lineHeight)',
            letterSpacing: 'var(--w-text-M-letterSpacing)',
          },
        ],
      },

      /* -------------------------------------------------------
         Spacing  (spacing.json › spacing.*)
         p-3xs / m-m / gap-xl / w-2xl …
         ------------------------------------------------------- */
      spacing: {
        '3xs': '0.125rem',
        '2xs': '0.25rem',
        'xs':  '0.375rem',
        's':   '0.5rem',
        'ms':  '0.75rem',
        'm':   '1rem',
        'ml':  'var(--fai-space-ml)',  // 18px
        'l':   '1.25rem',
        'xl':  '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3.5rem',
        '5xl': 'var(--fai-space-5xl)', // 80px
        '6xl': 'var(--fai-space-6xl)', // 100px
        '7xl': 'var(--fai-space-7xl)', // 120px
        '8xl': 'var(--fai-space-8xl)', // 180px
        '9xl': 'var(--fai-space-9xl)', // 240px
      },

      /* -------------------------------------------------------
         Border Radius  (spacing.json › borderRadius.*)
         rounded-fai-xs / rounded-fai-s / rounded-fai-circle …
         NOTE: `rounded-s`는 Tailwind v4 논리 속성(좌측 모서리)과 충돌하므로 fai- 접두어 사용
         ------------------------------------------------------- */
      borderRadius: {
        'fai-xs':     'var(--fai-radius-xs)',
        'fai-s':      'var(--fai-radius-s)',
        'fai-ms':     'var(--fai-radius-ms)',
        'fai-m':      'var(--fai-radius-m)',
        'fai-l':      'var(--fai-radius-l)',
        'fai-xl':     'var(--fai-radius-xl)',
        'fai-circle': 'var(--fai-radius-circle)',
      },

      /* -------------------------------------------------------
         Box Shadow  (effects.json › shadow.*)
         사용: shadow-XS / shadow-S / shadow-M / shadow-L / shadow-XL / shadow-XXL
         ------------------------------------------------------- */
      boxShadow: {
        'XS':  'var(--shadow-XS)',
        'S':   'var(--shadow-S)',
        'M':   'var(--shadow-M)',
        'L':   'var(--shadow-L)',
        'XL':  'var(--shadow-XL)',
        'XXL': 'var(--shadow-XXL)',
      },

      /* -------------------------------------------------------
         Screens / Breakpoints  (grid.json › layout.breakpoints.*.width)
         반응형 접두어: mobile: / tablet: / laptop: / desktop: / desktop-lg:
         ------------------------------------------------------- */
      screens: {
        'mobile':      '390px',
        'tablet':      '768px',
        'desktop-s':   '961px',   // 태블릿·모바일 공용 드로어 ↔ 데스크톱 풀 내비 전환점
        'laptop':      '1280px',
        'desktop':     '1440px',
        'desktop-lg':  '1920px',
      },

      /* -------------------------------------------------------
         Container  (grid.json › maxContentWidth + containerPadding)
         사용: <div class="container">  →  자동 center + max-w + px
         ------------------------------------------------------- */
      container: {
        center: true,
        padding: {
          DEFAULT:       '1.25rem',  // mobile      — 20px
          'tablet':      '1.5rem',   // tablet      — 24px
          'laptop':      '1.5rem',   // laptop      — 24px
          'desktop':     '9.375rem', // desktop     — 150px (Figma 공통 패딩)
          'desktop-lg':  '9.375rem', // desktop-lg  — 150px (Figma 공통 패딩)
        },
        screens: {
          'mobile':      '390px',
          'tablet':      '720px',
          'laptop':      '1120px',
          'desktop':     '1440px',   // max-w 1440px + padding 150px = content 1140px
          'desktop-lg':  '1440px',   // max-w 1440px + padding 150px = content 1140px
        },
      },

    },
  },

  plugins: [],
}

export default config
