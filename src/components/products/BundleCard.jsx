import React from "react";

import {
  Box,
  Grid,
  Typography,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { H4, H6 } from "components/Typography";
import { currencyFormat, getMediaPath } from "lib";

const BundleProductCard = ({ products, currency }) => {
    const data = products.map((p) => {
      let product = {};
  
      const { productId, variationId } = p;
  
      const { _id, type, image } = productId;
      product = { _id, type, image };
      if (type === "variation") {
        const variation = productId.variations.find(
          (vari) => vari._id === variationId
        );
        const {
          image: variationImage,
          title: name,
          regularPrice,
          salePrice,
        } = variation;
        product = {
          ...product,
          name,
          regularPrice,
          salePrice,
          variationId,
          variationImage,
        };
      } else {
        const { image, name, regularPrice, salePrice } = productId;
        product = { ...product, image, name, regularPrice, salePrice };
      }
      return product;
    });
    return (
      <Card>
        {data.map((product, index) => {
          const { regularPrice, salePrice } = product;
  
          return (
            <Box>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <img
                      src={
                        getMediaPath(
                          product.type === "variation"
                            ? product?.variationImage?.url
                            : product?.image?.url
                        ) ?? "https://via.placeholder.com/60"
                      }
                      style={{ width: 60, height: 60, objectFit: "contain" }}
                      alt={product.name}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1" component="div">
                      {product.name}
                    </Typography>
                    <Box display={"flex"} gap={1} alignItems={"center"}>
                      <H4 color="primary.main" mb={0.5} lineHeight="1">
                        {currencyFormat(salePrice, currency)}
                      </H4>
                      {regularPrice ? (
                        <>
                          <H6 color="grey.500" mb={0.5} lineHeight="1">
                            MRP{" "}
                            <del>{currencyFormat(regularPrice, currency)}</del>
                          </H6>
                        </>
                      ) : (
                        ""
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              {index + 1 < products.length && (
                <Divider
                  sx={{
                    mb: 1,
                    borderColor: "grey.500",
                  }}
                ></Divider>
              )}
            </Box>
          );
        })}
      </Card>
    );
  };
  
  export default BundleProductCard;