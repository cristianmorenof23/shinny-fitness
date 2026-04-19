import type { Metadata } from 'next'
import { FeaturedCategories } from "./components/home/featured-categories";
import { FeaturedProducts } from "./components/home/featured-products";
import { HeroSlider } from "./components/home/hero-slider";
import { StoreBenefits } from "./components/home/store-benefits";
import { Testimonials } from "./components/home/testimonials";
import { createMetadata } from "./lib/seo";

export const metadata: Metadata = createMetadata({
  title: 'Ropa deportiva femenina premium',
  description:
    'Descubri Shiny Fitness: ropa deportiva femenina con estilo, confort y prendas pensadas para entrenar y sentirte bien todos los dias.',
  path: '/',
})

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturedCategories />
      <FeaturedProducts />
      <StoreBenefits />
      <Testimonials />

    </>
  );
}
