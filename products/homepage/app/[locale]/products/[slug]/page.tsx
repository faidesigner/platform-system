import { notFound } from 'next/navigation'
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

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!PRODUCT_SLUGS.includes(slug as ProductSlug)) {
    notFound()
  }

  const product = siteConfig.products[slug as ProductSlug]

  return (
    <main className="flex flex-col">
      {product.heroType === 'video' ? (
        <ProductHero
          subtitle={product.heroSubtitle}
          title={product.heroTitle}
          ctaLabel={product.ctaLabel}
          videoSrc={product.heroVideo}
        />
      ) : (
        <StoreHero
          subtitle={product.heroSubtitle}
          title={product.heroTitle}
          ctaLabel={product.ctaLabel}
          imageSrc={product.heroImage}
        />
      )}
      <StoreEffects
        title={product.effectsTitle}
        cards={product.effectCards}
        list={product.effectList}
      />
      <StoreInteractiveContainer
        storeTypes={product.storeTypes}
        caseStudies={product.caseStudies}
        caseStudiesEyebrow={product.caseStudiesEyebrow}
      />
      <ProductFeatures
        title={product.featuresTitle}
        features={product.features}
      />
      <ProductBenefits
        title={product.benefitsTitle}
        benefits={product.benefits}
      />
      <ProductIndustries
        title={product.industriesTitle}
        description={product.industriesDescription}
        industries={product.industries}
      />
      <ProductReviews
        title={product.reviewsTitle}
        reviews={product.reviews}
      />
      {slug !== 'unmanned-store' && <CtaBanner />}
    </main>
  );
}
