import type { Metadata } from 'next'
import { FeaturedCategories } from "./components/home/featured-categories";
import { FeaturedProducts } from "./components/home/featured-products";
import { HeroSlider } from "./components/home/hero-slider";
import { StoreBenefits } from "./components/home/store-benefits";
import { Testimonials } from "./components/home/testimonials";
import { createMetadata } from "./lib/seo";

export const metadata: Metadata = createMetadata({
  title: 'Ropa deportiva femenina en Cordoba',
  description:
    'Descubri Shiny Fitness: calzas, tops, shorts, conjuntos y ropa deportiva femenina pensada para entrenar comoda, con estilo y cerca de vos.',
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
