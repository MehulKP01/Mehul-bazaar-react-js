"use client";

const SEO = lazy(() => import("../src/components/SEO"));
const Section1 = lazy(() => import("../src/pages-sections/home/Section1"));
const Section2 = lazy(() => import("../src/pages-sections/home/Section2"));
const Section3 = lazy(() => import("../src/pages-sections/home/Section3"));
const Section5 = lazy(() => import("../src/pages-sections/home/Section5"));
const Section11 = lazy(() => import("../src/pages-sections/home/Section11"));
const Section13 = lazy(() => import("../src/pages-sections/home/Section13"));
import { getAppDataLogo, getAllSubject } from "../src/redux/action";
import { useDispatch } from "react-redux";
const Banner3 = lazy(() =>
  import("../src/components/homepage-sections/Banner3.jsx")
);
const Banner4 = lazy(() =>
  import("../src/components/homepage-sections/Banner4")
);
const BannerCard = lazy(() => import("../src/common/BannerCard"));
import { lazy, useEffect } from "react";
const Section4 = lazy(() => import("../src/pages-sections/home/Section4"));

const MarketShop = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAppDataLogo());
    dispatch(getAllSubject());
  }, []);

  return (
    <>
      {/* <SEO
          title={pageData?.seoData?.title}
          description={pageData?.seoData?.description}
          image={pageData?.seoData?.image?.url}
          keyword={pageData?.seoData?.keyword}
          type={pageData?.seoData?.type}
          slug={pageData?.seoData?.slug}
          /> */}

      {/* // HERO SLIDER SECTION */}
      <Section1 />

      <Banner4 />

      {/* FLASH DEALS SECTION */}
      <Section2 />

      <BannerCard title={"Banner1"} />

      {/* TOP CATEGORIES */}
      <Section3 />

      {/* TOP RATED PRODUCTS */}
      <Section4 />

      <BannerCard title={"Banner2"} />

      {/* NEW ARRIVAL LIST */}
      <Section5 />

      {/* BIG DISCOUNTS */}
      <Section13 />

      <Banner3 />

      {/* MORE FOR YOU */}
      <Section11 />
    </>
  );
};

export default MarketShop;
