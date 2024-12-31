"use client";

import { memo, useEffect, useState } from "react";
import { Box, Skeleton } from "@mui/material";
import Light from "../../components/icons/Light";
import useWindowSize from "../../hooks/useWindowSize";
import Carousel from "../../components/carousel/Carousel";
import ProductCard1 from "../../components/product-cards/ProductCard1";
import CategorySectionCreator from "../../components/CategorySectionCreator";
import { useRouter } from "next/navigation";
import { getProductByslug } from "utils/__api__/homeApis";
import { isValidArray } from "common/validation";
// =============================================================

// =============================================================

const Section2 = () => {
  const [visibleSlides, setVisibleSlides] = useState(4);
  const [flashDeals, setFlashDeals] = useState([]);
  const width = useWindowSize();
  useEffect(() => {
    if (width < 500) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(3);
    else setVisibleSlides(4);
  }, [width]);

  useEffect(() => {
    const getFlashDeals = async () => {
      const data = await getProductByslug();
      if (isValidArray(data)) {
        setFlashDeals(data);
      } else {
        setFlashDeals([]);
      }
    };
    getFlashDeals();
  }, []);

  return (
    <CategorySectionCreator
      icon={<Light color="primary" />}
      title="Flash Deals"
      seeMoreLink="/shop/?sort-by=featured-product"
    >
      {flashDeals?.length > 0 ? (
        <Carousel
          totalSlides={flashDeals?.length}
          visibleSlides={visibleSlides}
          infinite={true}
        >
          {flashDeals?.map((item) => (
            <Box py={0.5} key={item?.id} sx={{ cursor: "pointer" }}>
              <ProductCard1 product={item} />
            </Box>
          ))}
        </Carousel>
      ) : (
        <Box sx={{ display: "flex", flexDirection:"row", gap:"30px"}}>
          <Skeleton width={"300px"} height={"300px"}/>
          <Skeleton animation="wave" width={"300px"}  height={"300px"}/>
          <Skeleton animation={false} width={"300px"} height={"300px"} />
          <Skeleton animation="wave" width={"300px"} height={"300px"} />
        </Box>
      )}
    </CategorySectionCreator>
  );
};
export default memo(Section2);
