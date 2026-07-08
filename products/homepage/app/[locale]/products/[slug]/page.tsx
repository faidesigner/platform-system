import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { siteConfig, type ProductSlug } from '@/config/site'
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
  const t = await getTranslations(SLUG_NS[slug as ProductSlug])
  return {
    title: product.label,
    description: t('heroSubtitle'),
    ...(locale === routing.defaultLocale
      ? { alternates: { canonical: `/${locale}/products/${slug}/` } }
      : {}),
  }
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

  const reviews = product.reviews.map((r, i) => ({
    ...r,
    category: t(`reviews.${i}.category`),
    store: t(`reviews.${i}.store`),
    role: t(`reviews.${i}.role`),
    quote: r.quote.map((seg, k) => ({
      ...seg,
      text: t(`reviews.${i}.quote.${k}.text`),
    })),
  }))

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
        description: t(`caseStudies.${key}.${i}.description`),
      })),
    ]),
  ) as typeof product.caseStudies

  const effectsTitle = effectCards.length > 0 || effectList.length > 0 ? t('effectsTitle') : ''

  return (
    <main className="flex flex-col">
      {product.heroType === 'video' ? (
        <ProductHero
          subtitle={t('heroSubtitle')}
          title={product.heroTitle}
          ctaLabel={ctaLabel}
          videoSrc={product.heroVideo}
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
        title={reviews.length > 0 ? t('reviewsTitle') : ''}
        reviews={reviews}
      />
      {slug !== 'unmanned-store' && <CtaBanner location="product_cta_banner" />}
    </main>
  );
}
