"use client"

const SEO =  dynamic(()=> import("../src/components/SEO"));
const Section1 =  dynamic(()=> import("../src/pages-sections/home/Section1"),{ssr:false});
const Section2 =  dynamic(()=> import("../src/pages-sections/home/Section2"),{ssr:false});
const Section3 =  dynamic(()=> import("../src/pages-sections/home/Section3"),{ssr:false});
const Section5 =  dynamic(()=> import("../src/pages-sections/home/Section5"),{ssr:false});
const Section11 =  dynamic(()=> import("../src/pages-sections/home/Section11"),{ssr:false});
const Section13 =  dynamic(()=> import("../src/pages-sections/home/Section13"),{ssr:false});
import { getAppDataLogo, getAllSubject } from "../src/redux/action";
import { useDispatch } from "react-redux";
const Banner3 =  dynamic(()=> import("../src/components/homepage-sections/Banner3.jsx"), {ssr:false});
const Banner4 =  dynamic(()=> import("../src/components/homepage-sections/Banner4"), {ssr:false});
const BannerCard =  dynamic(()=> import("../src/common/BannerCard"), {ssr:false});
import { memo, useEffect } from "react";
const Section4 = dynamic(() => import("../src/pages-sections/home/Section4"), {ssr:false});
import dynamic from "next/dynamic";

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
        <Section2  />

        <BannerCard title={"Banner1"}/>
  
        {/* TOP CATEGORIES */}
        <Section3 />
  
        {/* TOP RATED PRODUCTS */}
        <Section4  />
  
        <BannerCard title={"Banner2"}/>

        {/* NEW ARRIVAL LIST */}
        <Section5  />
  
        {/* BIG DISCOUNTS */}
        <Section13 />
  
        <Banner3 />
  
        {/* MORE FOR YOU */}
        <Section11  />

        </>
    );
};

export default MarketShop;

