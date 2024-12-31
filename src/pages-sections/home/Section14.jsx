import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  Container,
} from "@mui/material";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
const products = [
  {
    id: 1,
    name: "Lumenier QAV-S JohnnyFPV Special",
    price: 599.99,
    originalPrice: 649.00,
    imageUrl:
      "https://digibulkmarketing.com/_next/image?url=https%3A%2F%2Fdigibulkmarketing.com%2Fmedia%2Fuploads%2Fd38f20b7-b01a-43d7-890d-177cb9e0cb2b.png&w=640&q=75",
    reviews: 7,
  },
  {
    id: 2,
    name: "DJI FPV Remote Controller",
    price: 299.0,
    originalPrice: 329.00,
    imageUrl:
      "https://digibulkmarketing.com/_next/image?url=https%3A%2F%2Fdigibulkmarketing.com%2Fmedia%2Fuploads%2F75a2ee76-6ed0-4d70-95bf-4c540656de0b.png&w=640&q=75",
    reviews: 21,
  },
  {
    id: 3,
    name: "DJI FPV Goggles V2",
    price: 569.0,
    originalPrice: 599,
    imageUrl:
      "https://digibulkmarketing.com/_next/image?url=https%3A%2F%2Fdigibulkmarketing.com%2Fmedia%2Fuploads%2F1b1caa48-2d9d-4413-9489-7569e3e5b1de.png&w=640&q=75",
    reviews: 8,
  },
  {
    id: 4,
    name: "DJI FPV Goggles V2",
    price: 0,
    originalPrice: 0,
    imageUrl:
      "https://digibulkmarketing.com/_next/image?url=https%3A%2F%2Fdigibulkmarketing.com%2Fmedia%2Fuploads%2F07454c48-7291-4250-a489-61e5e7716e1e.png&w=640&q=75",
    reviews: 8,
  },
];

const Section14 = () => {
  const totalOriginalPrice = products.reduce(
    (acc, product) => acc + (product.originalPrice || product.price),
    0
  );
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
  const discount = totalOriginalPrice - totalPrice;

  return (
    <Box sx={{ p: 2 }}>
      <Container>
        <Box
          mb={4}
          textAlign="start"
          display={"flex"}
          gap={1}
          alignItems={"center"}
        >
          <AlignHorizontalLeftIcon sx={{ color: "#3399cc" }} />
          <Typography fontSize={"25px"} fontWeight={"bold"}>
            Bundle Products
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {products.slice(0, 3).map((product, index) => (
            <React.Fragment key={product.id}>
              <Grid item xs={12} sm={6} md={2.6} textAlign="start">
                <Card>
                  <Box
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        transition: "background-color 0.3s",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl}
                      alt={product.name}
                      sx={{ objectFit: "contain", padding: 1 }}
                    />
                  </Box>
                  <Box p={2}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.reviews} Reviews
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              {index < products.slice(0, 3).length - 1 ? (
                <Grid item xs={12} sm={2} md={0.5} textAlign="center">
                  <Typography variant="h4">+</Typography>
                </Grid>
              ) : null}
            </React.Fragment>
          ))}
          <Grid item xs={12} sm={2} md={0.5} textAlign="center">
            <Typography variant="h4">=</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.6} textAlign="center">
            <Card>
              <Box
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    transition: "background-color 0.3s",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={products[3].imageUrl}
                  alt="Total"
                  sx={{ objectFit: "contain", padding: 1 }}
                />
              </Box>
              <Box p={1}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Total: ${totalPrice.toFixed(2)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Save ${discount.toFixed(2)}
                </Typography>
                <Button variant="contained" color="primary" fullWidth>
                  Add All to Cart
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Section14;
