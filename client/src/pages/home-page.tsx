import React from "react";
import { Helmet } from "react-helmet";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Services from "@/components/home/Services";
import RecentProperties from "@/components/home/RecentProperties";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>HomeVerse - Find Your Dream Home</title>
        <meta name="description" content="Find your dream home with HomeVerse. Browse properties for sale and rent across the country." />
      </Helmet>
      
      <HeroSection />
      <FeaturedProperties />
      <Services />
      <RecentProperties />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default HomePage;
