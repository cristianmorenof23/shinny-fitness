import { FeaturedCategories } from "./components/home/featured-categories";
import { FeaturedProducts } from "./components/home/featured-products";
import { HeroSlider } from "./components/home/hero-slider";
import { StoreBenefits } from "./components/home/store-benefits";
import { Testimonials } from "./components/home/testimonials";

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
