import React from "react";
import FeaturedProduct from "../components/promotional/FeaturedProduct";
import Hero from "../components/promotional/Hero";
import { BrowseCategories } from "../components/promotional/BrowseCategories";
import PromoVideo from "../components/promotional/PromoVideo";

export const HomeScreen = () => {
  return (
    <div>
      <FeaturedProduct />
      <Hero />
      <BrowseCategories/>
      <PromoVideo />
    </div>
  );
};
