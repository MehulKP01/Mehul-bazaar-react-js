"use client"

import { Box, Container, Grid, Skeleton } from "@mui/material";
import BazaarCard from "components/BazaarCard";
import RankBadge from "components/icons/RankBadge";
import ProductCard4 from "components/product-cards/ProductCard4";
import CategorySectionHeader from "components/CategorySectionHeader";
import { memo, useEffect, useState } from "react";
import { isValidArray } from "common/validation";
import { getTopRating } from "utils/__api__/homeApis";

// =================================================================

const Section4 = () => {
  const [topRatedList, setTopRatedList] = useState([]);

  useEffect(() => {
    const getTopProduct = async () => {
      const data = await getTopRating();
      if (isValidArray(data)) {
        setTopRatedList(data);
      } else {
        setTopRatedList([]);
      }
    };
    getTopProduct();
  }, []);

  return (
    <Box mb={7.5}>
      <Container>
        <Grid container spacing={4}>
          {/* TOP RATINGS AREA */}
          <Grid item lg={12} xs={12} sx={{ cursor: "pointer" }}>
            <CategorySectionHeader
              icon={<RankBadge color="primary" />}
              title="Top Ratings"
              seeMoreLink="/shop?filter-by=top-rating"
            />

            {topRatedList?.length > 0 ? (
              <BazaarCard
                sx={{
                  p: 2,
                }}
              >
                <Grid container spacing={4}>
                  {topRatedList?.map((item) => (
                    <Grid key={item?.id} item md={3} sm={6} xs={6}>
                      <ProductCard4 product={item} />
                    </Grid>
                  ))}
                </Grid>
              </BazaarCard>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "row", gap: "30px" }}>
                <Skeleton width={"300px"} height={"300px"} />
                <Skeleton animation="wave" width={"300px"} height={"300px"} />
                <Skeleton animation={false} width={"300px"} height={"300px"} />
                <Skeleton animation="wave" width={"300px"} height={"300px"} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default memo(Section4);
