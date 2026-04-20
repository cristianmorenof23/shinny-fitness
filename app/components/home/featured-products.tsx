import { getStorefrontProducts } from '@/app/lib/storefront'
import { FeaturedProductsCarousel } from '@/app/components/home/featured-products-carousel'

export async function FeaturedProducts() {
  const products = await getStorefrontProducts({ featured: true, take: 8 })

  if (products.length === 0) {
    return null
  }

  return <FeaturedProductsCarousel products={products} />
}
