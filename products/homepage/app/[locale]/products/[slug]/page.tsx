import { notFound } from 'next/navigation'
import { siteConfig, type ProductSlug } from '@/config/site'
import ProductHero from '@/components/sections/products/ProductHero'
import ProductFeatures from '@/components/sections/products/ProductFeatures'
import ProductBenefits from '@/components/sections/products/ProductBenefits'
import ProductIndustries from '@/components/sections/products/ProductIndustries'
import ProductReviews from '@/components/sections/products/ProductReviews'

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
      <ProductHero
        subtitle={product.heroSubtitle}
        title={product.heroTitle}
        ctaLabel={product.ctaLabel}
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
      {/* 다음 섹션은 여기에 하나씩 추가 */}
    </main>
  );
}
