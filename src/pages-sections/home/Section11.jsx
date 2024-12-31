"use client";

import { Box, Container, Grid, Skeleton } from "@mui/material";
import ProductCard1 from "components/product-cards/ProductCard1";
import CategorySectionHeader from "components/CategorySectionHeader";
import { useRouter } from "next/navigation";
import { isValidArray } from "common/validation";
import { getAllProducts } from "utils/__api__/homeApis";
import { memo, useEffect, useState } from "react";

// ====================================================

const Section11 = () => {
  const router = useRouter();
  const [moreItems, SetMoreItems] = useState([]);

  useEffect(() => {
    const getTopProduct = async () => {
      const data = await getAllProducts();
      if (isValidArray(data)) {
        SetMoreItems(data);
      } else {
        SetMoreItems([]);
      }
    };
    getTopProduct();
  }, []);

  return (
    <Container
      sx={{
        mb: "70px",
      }}
    >
      <CategorySectionHeader title="More For You" seeMoreLink="/shop" />
      {moreItems?.length > 0 ? (
        <Grid container spacing={3}>
          {moreItems?.map((item) => (
            <Grid
              item
              lg={3}
              md={4}
              key={item?.id}
              sm={6}
              xs={12}
              sx={{ cursor: "pointer" }}
            >
              <ProductCard1 product={item} hoverEffect />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "30px" }}>
          <Skeleton width={"300px"} height={"300px"} />
          <Skeleton animation="wave" width={"300px"} height={"300px"} />
          <Skeleton animation={false} width={"300px"} height={"300px"} />
          <Skeleton animation="wave" width={"300px"} height={"300px"} />
        </Box>
      )}
    </Container>
  );
};
export default memo(Section11);
