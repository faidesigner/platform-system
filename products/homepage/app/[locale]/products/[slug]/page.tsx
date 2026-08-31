import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { siteConfig, type ProductSlug } from '@/config/site'
import { localePolicy, orderReviews } from '@/config/locale-policy'
import { pageMetadata } from '@/lib/seo'
import { getPageDescription, type SeoPageKey } from '@/config/seo'
import ProductHero from '@/components/sections/products/ProductHero'
import StoreHero from '@/components/sections/products/StoreHero'
import ProductFeatures from '@/components/sections/products/ProductFeatures'
import ProductBenefits from '@/components/sections/products/ProductBenefits'
import ProductIndustries from '@/components/sections/products/ProductIndustries'
import ProductReviews from '@/components/sections/products/ProductReviews'
import StoreEffects from '@/components/sections/products/StoreEffects'
import StoreInteractiveContainer from '@/components/sections/products/StoreInteractiveContainer'
import { CtaBanner } from '@/components/sections/CtaBanner'

const PRODUCT_SLUGS = Object.keys(siteConfig.products) as ProductSlug[]

/** slug → messages namespace (products.*). heroTitle/label 등 제품 고유명사는 config 유지. */
const SLUG_NS: Record<ProductSlug, string> = {
  'vision-check-out': 'products.visionCheckout',
  'unmanned-store': 'products.unmannedStore',
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PRODUCT_SLUGS.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!PRODUCT_SLUGS.includes(slug as ProductSlug)) return {}
  const product = siteConfig.products[slug as ProductSlug]
  // 설명은 노션 SEO 명세(④ 사이트 링크)의 제품별 문구를 쓴다(HOM-74).
  return pageMetadata({
    locale,
    path: `products/${slug}`,
    title: product.label,
    description: getPageDescription(slug as SeoPageKey, locale),
  })
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  if (!PRODUCT_SLUGS.includes(slug as ProductSlug)) {
    notFound()
  }

  const product = siteConfig.products[slug as ProductSlug]
  // 텍스트는 messages(products.*)에서, 이미지/비디오/아이콘/색상 등 구조는 config에서.
  // 서버 컴포넌트에서 config 구조 + 번역 텍스트를 인덱스로 병합해 하위 컴포넌트에 주입.
  const t = await getTranslations(SLUG_NS[slug as ProductSlug])
  const ctaLabel = await getTranslations('common.cta').then((c) => c('requestDemo'))

  const features = product.features.map((f, i) => ({
    ...f,
    title: t(`features.${i}.title`),
    description: t(`features.${i}.description`),
  }))

  const benefits = product.benefits.map((b, i) => ({
    ...b,
    eyebrow: t(`benefits.${i}.eyebrow`),
    title: t(`benefits.${i}.title`),
    items: b.items.map((item, j) => ({
      ...item,
      subtitle: t(`benefits.${i}.items.${j}.subtitle`),
      description: t(`benefits.${i}.items.${j}.description`),
    })),
  }))

  const industries = product.industries.map((ind, i) => ({
    ...ind,
    label: t(`industries.${i}.label`),
  }))

  const reviews = [
    ...product.reviews.map((r, i) => ({
      ...r,
      category: t(`reviews.${i}.category`),
      store: t(`reviews.${i}.store`),
      role: t(`reviews.${i}.role`),
      quote: r.quote.map((seg, k) => ({
        ...seg,
        text: t(`reviews.${i}.quote.${k}.text`),
      })),
    })),
    ...(locale === 'ja' && slug === 'vision-check-out' ? [{
      key: 'retail' as const,
      category: t('reviews.3.category'),
      categoryColorVar: '--color-text-basic-positive',
      iconBgVar: '--color-filled-basic-positive-secondary',
      iconColorVar: '--color-icon-tag-category-mint',
      icon: 'cafeteria' as const,
      store: t('reviews.3.store'),
      role: t('reviews.3.role'),
      image: '/images/products/review/vco-review-retail-hibinoma-final.webp',
      quote: [{ text: t('reviews.3.quote.0.text'), emphasis: false }],
    }] : []),
  ]

  // ja는 일본 고객사(리조트·리테일)를 앞세운다(HOM-80). ko/en은 config 기본 순서 유지.
  const orderedReviews = orderReviews(reviews, locale)

  const heroVideoSrc =
    slug === 'vision-check-out' ? localePolicy(locale).vcoHeroVideo : product.heroVideo

  const effectCards = product.effectCards.map((c, i) => ({
    ...c,
    title: t(`effectCards.${i}.title`),
    description: t(`effectCards.${i}.description`),
  }))

  const effectList = product.effectList.map((item, i) => ({
    ...item,
    title: t(`effectList.${i}.title`),
    description: t(`effectList.${i}.description`),
  }))

  const storeTypes = product.storeTypes.map((st, i) => ({
    ...st,
    subtitle: t(`storeTypes.${i}.subtitle`),
    description: t(`storeTypes.${i}.description`),
    sectionTitle: t(`storeTypes.${i}.sectionTitle`),
    cards: st.cards.map((card, j) => ({
      ...card,
      title: t(`storeTypes.${i}.cards.${j}.title`),
      description: t(`storeTypes.${i}.cards.${j}.description`),
    })),
  }))

  const caseStudies = Object.fromEntries(
    Object.entries(product.caseStudies).map(([key, list]) => [
      key,
      list.map((cs, i) => ({
        ...cs,
        brand: t(`caseStudies.${key}.${i}.brand`),
        store: t(`caseStudies.${key}.${i}.store`),
        // 도입 시점 표기도 번역 대상이다(HOM-75). en은 `Oct '23` 처럼 영문 표기를 쓰는데,
        // site.ts 값을 그대로 흘리면 전 로케일에 한국식 `'23.10`이 나간다 — 실제로 그랬다.
        date: t(`caseStudies.${key}.${i}.date`),
        description: t(`caseStudies.${key}.${i}.description`),
      })),
    ]),
  ) as typeof product.caseStudies

  const effectsTitle = effectCards.length > 0 || effectList.length > 0 ? t('effectsTitle') : ''

  return (
    <main className="flex flex-col">
      {/* VCO 히어로 영상은 로케일별 자막 버전으로 갈린다(HOM-70). 영상 히어로는 현재 VCO뿐이라
          다른 제품이 영상 히어로가 되어도 VCO 영상을 물려받지 않도록 slug로 좁힌다. */}
      {product.heroType === 'video' ? (
        <ProductHero
          subtitle={t('heroSubtitle')}
          title={product.heroTitle}
          ctaLabel={ctaLabel}
          videoSrc={heroVideoSrc}
        />
      ) : (
        <StoreHero
          subtitle={t('heroSubtitle')}
          title={product.heroTitle}
          ctaLabel={product.ctaLabel}
          imageSrc={product.heroImage}
        />
      )}
      <StoreEffects
        title={effectsTitle}
        cards={effectCards}
        list={effectList}
      />
      <StoreInteractiveContainer
        storeTypes={storeTypes}
        caseStudies={caseStudies}
        caseStudiesEyebrow={product.caseStudiesEyebrow}
      />
      <ProductFeatures
        title={features.length > 0 ? t('featuresTitle') : ''}
        features={features}
      />
      <ProductBenefits
        title={benefits.length > 0 ? t('benefitsTitle') : ''}
        benefits={benefits}
      />
      <ProductIndustries
        title={industries.length > 0 ? t('industriesTitle') : ''}
        description={industries.length > 0 ? t('industriesDescription') : ''}
        industries={industries}
      />
      <ProductReviews
        title={orderedReviews.length > 0 ? t('reviewsTitle') : ''}
        reviews={orderedReviews}
      />
      {slug !== 'unmanned-store' && <CtaBanner location="product_cta_banner" />}
    </main>
  );
}
