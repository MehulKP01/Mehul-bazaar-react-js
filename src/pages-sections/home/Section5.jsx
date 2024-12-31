"use client";

import { Box, Grid, Skeleton } from "@mui/material";
import NewArrival from "components/icons/NewArrival";
import ProductCard2 from "components/product-cards/ProductCard2";
import CategorySectionCreator from "components/CategorySectionCreator";
import { memo, useEffect, useState } from "react";
import useWindowSize from "hooks/useWindowSize";
import Carousel from "../../components/carousel/Carousel";
import { isValidArray } from "common/validation";
import { getNewArriavle } from "utils/__api__/homeApis";

// =======================================================

const Section5 = () => {
  const [arrivalvisibleSlides, setArrivalVisibleSlides] = useState(4);
  const [newArrivalsList, setNewArrivalsList] = useState([]);

  useEffect(() => {
    const getNewArrivaList = async () => {
      const data = await getNewArriavle();
      if (isValidArray(data)) {
        setNewArrivalsList(data);
      } else {
        setNewArrivalsList([]);
      }
    };
    getNewArrivaList();
  }, []);

  const width = useWindowSize();

  useEffect(() => {
    if (width < 370) setArrivalVisibleSlides(1);
    else if (width < 650) setArrivalVisibleSlides(2);
    else if (width < 950) setArrivalVisibleSlides(3);
    else setArrivalVisibleSlides(4);
  }, [width]);

  return (
    <CategorySectionCreator
      icon={<NewArrival />}
      title="New Arrivals"
      seeMoreLink="/shop/?sort-by=new-arrival"
    >
      {newArrivalsList?.length > 0 ? (
        <Carousel
          totalSlides={newArrivalsList?.length}
          visibleSlides={arrivalvisibleSlides}
          infinite={true}
        >
          {newArrivalsList?.map((product) => (
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              xs={6}
              key={product.id}
              sx={{ cursor: "pointer" }}
            >
              <ProductCard2 product={product} />
            </Grid>
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

export default memo(Section5);
