"use client";

import Link from "next/link";
import { Fragment, memo, useEffect, useState } from "react";
import BazaarCard from "../../components/BazaarCard";
import useWindowSize from "../../hooks/useWindowSize";
import CategoryIcon from "../../components/icons/Category";
import Carousel from "../../components/carousel/Carousel";
import ProductCard6 from "../../components/product-cards/ProductCard6";
import CategorySectionCreator from "../../components/CategorySectionCreator";
import { getMediaPath } from "../../lib";
import { useRouter } from "next/navigation";
import { isValidArray } from "../../common/validation";
import { getProductcategory } from "utils/__api__/homeApis";
import { Box, Skeleton } from "@mui/material";
// =====================================================

const Section3 = () => {
  const [visibleSlides, setVisibleSlides] = useState(3);
  const width = useWindowSize();
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    if (width < 650) setVisibleSlides(1);
    else if (width < 950) setVisibleSlides(2);
    else setVisibleSlides(3);
  }, [width]);

  useEffect(() => {
    const getCategories = async () => {
      const data = await getProductcategory();

      if (isValidArray(data)) {
        setCategoryList(data);
      } else {
        setCarouselData([]);
      }
    };

    getCategories();
  }, []);

  return (
    <CategorySectionCreator
      seeMoreLink="#"
      title="Categories"
      icon={<CategoryIcon color="primary" />}
    >
      {categoryList?.length > 0 ? (
        <Carousel totalSlides={10} visibleSlides={visibleSlides}>
          {categoryList?.map((item) => (
            <Fragment key={item?._id}>
              <Link
                href={`/shop?category=${item?.slug}`}
                sx={{ cursor: "pointer" }}
              >
                <BazaarCard
                  elevation={0}
                  sx={{
                    p: 2,
                  }}
                >
                  <ProductCard6
                    badgeId={item?.badgeId}
                    title={item?.name}
                    subtitle={item?.description}
                    imgUrl={getMediaPath(`${item?.image?.url}`)}
                  />
                </BazaarCard>
              </Link>
            </Fragment>
          ))}
        </Carousel>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "30px" }}>
          <Skeleton width={"300px"} height={"300px"} />
          <Skeleton animation="wave" width={"300px"} height={"300px"} />
          <Skeleton animation={false} width={"300px"} height={"300px"} />
          <Skeleton animation="wave" width={"300px"} height={"300px"} />
        </Box>
      )}
    </CategorySectionCreator>
  );
};
export default memo(Section3);
